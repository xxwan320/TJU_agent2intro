"""Public application assembly with no model-key or upstream probe on boot."""
import os
os.environ["LANGSMITH_TRACING"] = "false"
os.environ["LANGCHAIN_TRACING_V2"] = "false"
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from starlette.exceptions import HTTPException
from starlette.middleware.trustedhost import TrustedHostMiddleware
from backend.common.config import get_settings
from backend.common.errors import DomainError
from backend.contracts import ApiError, ErrorDetail, Health, CONTRACT_VERSION
from backend.common.knowledge_tour_routes import router as knowledge_tour_router
from backend.common.tour_routes import router as tour_router
from backend.model.routes import router as model_router
from backend.model.stream_routes import router as stream_router
from backend.maps.routes import router as maps_router
from backend.knowledge.r2_routes import router as knowledge_r2_router
from backend.knowledge.videos import router as videos_router
from backend.speech.routes import router as speech_router
from backend.knowledge.routes import router as knowledge_router
from backend.model.service import connectivity
from backend.knowledge.service import knowledge
from backend.speech.service import speech
settings = get_settings()
app = FastAPI(title="AI4TJU campus guide", version=CONTRACT_VERSION,
    responses={status: {"model": ApiError} for status in (400,404,409,413,422,429,499,500,501,503)})
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost", "testserver"])
from backend.knowledge.query_routes import router as campus_query_router
app.include_router(campus_query_router)
def error_response(code, message, status, request_id=None, retryable=False):
    return JSONResponse(status_code=status, content=ApiError(error=ErrorDetail(
        code=code, message=message, request_id=request_id, retryable=retryable)).model_dump(mode="json"))
@app.middleware("http")
async def body_limit(request: Request, call_next):
    size = 0
    chunks = []
    upload_paths = ("/api/reconstruction/images",)
    is_reconstruction_upload = request.url.path in upload_paths or (
        request.url.path.startswith("/api/reconstruction/images/")
        and request.url.path.endswith("/apply-mask")
    )
    limit = 2097152 if request.url.path in ("/api/speech/asr", "/api/harness/uploads") else 12001000 if is_reconstruction_upload else 65536
    async for chunk in request.stream():
        size += len(chunk)
        if size > limit:
            return error_response("payload_too_large", "请求体超过该端点的大小上限", 413)
        chunks.append(chunk)
    request._body = b"".join(chunks)
    return await call_next(request)
@app.exception_handler(DomainError)
async def domain_error(request, error):
    response = error_response(error.code, error.message, error.status, error.request_id, error.retryable)
    if error.status == 429: response.headers["Retry-After"] = "60"
    return response
@app.exception_handler(RequestValidationError)
async def validation_error(request, error):
    # Never echo input, headers, prompt or secret in validation errors.
    return error_response("VALIDATION_ERROR", "请求字段、类型或长度不符合契约", 422)
@app.exception_handler(HTTPException)
async def http_error(request, error):
    return error_response("http_error", str(error.detail) if request.url.path.startswith("/api/reconstruction/") else "端点不存在或请求方法不支持", error.status_code)
@app.exception_handler(Exception)
async def internal_error(request, error):
    return error_response("internal_error", "服务内部错误", 500)
@app.get("/api/health", response_model=Health)
def health():
    return Health(status="ok", contract_version=CONTRACT_VERSION,
        model={"configured": connectivity.configured, "verified": connectivity.verified},
        capabilities={"chat": connectivity.configured,
            "asr": bool(settings.asr_url and settings.asr_model and settings.asr_api_key.get_secret_value() and settings.asr_url.rstrip("/") not in (settings.llm_url.rstrip("/"), settings.sdk_base_url.rstrip("/"))),
            "tts": speech.tts_verified, "knowledge": knowledge.get_status().status == "ready", "scene_3d": True})
app.include_router(knowledge_tour_router)
app.include_router(tour_router)
app.include_router(model_router)
app.include_router(speech_router)
app.include_router(knowledge_router)
app.include_router(stream_router)
app.include_router(maps_router)
app.include_router(knowledge_r2_router)
app.include_router(videos_router)
from backend.harness_routes import router as harness_router
app.include_router(harness_router)
from backend.knowledge.harness_provider import router as selected_upload_router
app.include_router(selected_upload_router)


from backend.reconstruction import router as reconstruction_router
from backend.model import reconstruction_workflow
app.include_router(reconstruction_router)

# Build output is an explicit opt-in. API routes always take precedence.
if os.environ.get("AI4TJU_SERVE_FRONTEND") == "1":
    dist = (Path(__file__).resolve().parents[1] / "dist").resolve()
    if not (dist / "index.html").is_file():
        raise RuntimeError("Frontend build missing; run npm run build")
    app.mount("/assets", StaticFiles(directory=dist / "assets"), name="assets")
    if (dist / "vendor").is_dir():
        app.mount("/vendor", StaticFiles(directory=dist / "vendor"), name="vendor")

    @app.get("/{path:path}", include_in_schema=False)
    def frontend(path: str):
        if path == "api" or path.startswith("api/") or any(part.startswith(".") for part in path.split("/")):
            return error_response("http_error", "端点或资源不存在", 404)
        # No arbitrary filesystem lookup: public assets have dedicated mounts.
        if "." in path:
            return error_response("http_error", "端点或资源不存在", 404)
        return FileResponse(dist / "index.html", headers={"Cache-Control": "no-cache"})
