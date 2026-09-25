import os
from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="CAMPUS_", extra="ignore")
    llm_url: str = "https://111.32.22.35:32592/mgate/v1/chat/completions"
    llm_model: str = "glm-5.1"
    llm_api_key: SecretStr = SecretStr("")
    asr_url: str = ""
    asr_model: str = ""
    asr_api_key: SecretStr = SecretStr("")
    tts_provider: str = "edge"
    tts_voice: str = "zh-CN-XiaoxiaoNeural"
    amap_js_key: str = ""
    amap_security_key: SecretStr = SecretStr("")
    amap_web_service_key: SecretStr = SecretStr("")
    web_search_enabled: bool = True
    web_search_timeout: float = 12.0
    web_search_backend: str = "bing,duckduckgo,brave"
    tour_model_suggestions: bool = False
    @property
    def sdk_base_url(self) -> str:
        suffix = "/chat/completions"
        if not self.llm_url.endswith(suffix):
            raise ValueError("CAMPUS_LLM_URL must end with /chat/completions")
        return self.llm_url[:-len(suffix)]
def get_settings() -> Settings:
    # No implicit root .env inheritance. Only M/C opt in; process env wins.
    env_file = os.environ.get("AI4TJU_ENV_FILE")
    if env_file and not Path(env_file).is_file():
        raise RuntimeError("Explicit AI4TJU_ENV_FILE does not exist")
    return Settings(_env_file=env_file, _env_file_encoding="utf-8")
