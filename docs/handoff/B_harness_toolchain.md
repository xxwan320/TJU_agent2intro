# B Harness 协作契约 v1

2026-09-25 IN_PROGRESS。B 已读取 A_data_device.md（基线 f459060），文件通信已成立；尚不代表 A 已读取本回复。

## 所有权
B：backend/harness_contracts.py、backend/model/harness*.py、backend/harness_routes.py、shared/harness*、frontend/src/transport/harness.ts、App.tsx/TourWorkspace.tsx 最小接入、backend/app.py、scripts/harness*、tests/harness/、docs/diagnostics/harness-b、docs/evaluation/harness-split。不改 A 的检索/文档/设备实现，不升级依赖。
A：建议 backend/knowledge/harness_provider.py 与 frontend/src/device/，沿用已约定归属。请回复真实路径和可导出对象。

## 接入接口（现在发布，允许离线接入）
Python 类型在 backend/harness_contracts.py：ToolContext、ToolRequest、ToolResult、Capability、SourceEvidence、Evidence、ToolError、PendingAction。
A 导出 provider 对象，三个 async 方法：list_capabilities(context: ToolContext) -> list[Capability]；execute_tool(request: ToolRequest) -> ToolResult；cancel_tool(runId: str, toolCallId: str) -> 任意真实取消结果。
B 从 backend.knowledge.harness_provider import provider；若名称不同请在本文件对侧回复。允许返回 dict，B 会用共享类型校验。
字段统一 camelCase；schemaVersion='1.0'。deadlineAt ISO UTC，cancelToken 关联句柄。context 的 sessionId/campusId/channel/generation 必填，deviceId/poiId 可选。上下文 extra 允许受信扩展，但不会授予权限。
ToolResult：toolCallId、status(completed/pending_user_action/failed/cancelled)、data、sources、error、observedAt、evidence；pending_user_action 的 data.pendingAction 为 PendingAction（actionId/runId/toolCallId/expiresAt/label/kind）。
Capability：toolName、status(available/unavailable/needs_permission)、inputSchema/outputSchema、executionLocation、cancellable、conditions、error、sideEffect、timeoutMs、maxResultBytes。未知能力返回 unavailable，并说明未测。
source 的 registryId/sourceId/title/url/localRef/excerpt/publishedAt/fetchedAt 未知为 null。证据 type/observed/traceRef，夹具 type=TEST_PROVIDER。

A 建议工具：knowledge_search、official_search、document_read、weather_query、device_capabilities、device_pick_document、speech_input、device_share、device_open_app。B 通过能力与后端允许名单相交注册，不暴露任意 URL/路径/shell。
检索上限3500ms，普通总预算45s/2模型/6工具。不额外模型润色或自动重试。请将内部调用计数放 data.callLedger，无法观测标 unknown，勿填假零。
设备动作先返回 pending_user_action；请提供前端执行入口与回执结构，B 负责待操作按钮与任务代际核对。文档上传路由由 A 提供 router，B 在 app.py 挂载；请勿修改 app.py。

## 基线与启动
分支 fix/ip-route-autoplanning；HEAD f459060bd5e8e1c9d5540ca348d5e08fe9a18e36。初始仅 .worktrees/publish dirty；保留。
启动 scripts/start-app.ps1 -Build；开发 scripts/start-dev.ps1。模型 glm-5.1，已有 OpenAI SDK max_retries=0；LangGraph 已使用。B 不读取/输出凭证，不切模型。
B0—B4 尚未验收；已有报告不能代替本轮实测。3D/GUI 不启用。

## B 接入进度与待 A 注意（2026-09-25）
B 已读取 A 的确认，双向文件协作成立。JSON Schema 已生成 shared/harness.schema.json；后端导入正常，前端 typecheck 通过，7项离线边界回归通过。GLM stream+tools echo 探针1次请求返回 BadRequestError（未重试），nativeTools=unknown，暂保留规则工具路径。
A 设备类型需要薄适配：executionLocation='browser' 转为 frontend；ToolError 的 retryable 字段在 B 边界去掉（共享 v1 不改）；generation统一数字。B 将建立服务端签发的 Harness 会话令牌，上传票据只凭该令牌签发，不能指定任意 sessionId。
B 将挂载 A router，并为 /api/harness/uploads 设置约1.5MiB body上限（1MiB base64）。前端待操作通过 A executor，续任务保留原 runId 与 context、新 toolCallId/期限并单独记账，不无限挂住模型。

## 网关配置断点已定位
HTTP 400 的真实原因为 nginx: plain HTTP request sent to HTTPS port。已只读验证同一网关 HTTPS 模型列表，TLS验证正常，唯一返回 glm-5.1。B 将根.env的同一CAMPUS_LLM_URL升级HTTPS（不改key/型号），配置默认值同改。此前3次生成失败均保留账本；修正配置后执行新的最多2次echo闭环探针。非自动重试，不掩盖旧失败。
B 无头Chrome已真实通过选文档上传、下载并打开MD/JSON、播放暂停继续停止；A可引用最终browser-report，但模型回答范围需按最终ledger区分。

## B 最终集成实测更新
- A provider/router 已真实接入；服务端签发 Harness session + token，上传票据只在认证后签发；根body limit仅对upload增至2MiB。
- HTTPS与glm-5.1保持TLS校验，无SDK重试。首轮真实工具调用+第二轮真实文档回答已通过，2模型/1文档工具；证据 document-final.json / run-ledger.jsonl，capabilities.json 已据该运行发布 available。
- Windows Chrome153真实：选择文档、原文注入不执行、09:30文档问答、MD/JSON真实下载、音频playing/pause/resume/stop、A→B→A图片、真实高德步行画线回执及普通选点保线。路线仅1次walking，2次place/text。无物理麦克风/人工听音/系统分享送达声明。
- 已注入现有asrRef.current，仍由原按钮输入优先；设备speech_input未对模型开放，避免重复麦克风控制。
- 最终统一回归149后端+79前端，通过；A设备12离线通过；无新依赖。
- 新增B所有权：frontend/src/ui/CampusExplorer.tsx，仅补单点路线实际绘制后的onRouteApplied回执。A不需修改。

## B交付收尾
最终报告 docs/diagnostics/harness-b/REPORT.md；12项表 docs/evaluation/harness-split/cases.jsonl；来源、设备、配置阻塞和未测逐项列明。
A manifest全部SHA256匹配；A原patch反向检查未过，B按匹配清单生成 a-reviewed-incremental.patch，保留原始patch与所有A文件。B增量 b-code.patch 单独交付，二者仅做 --reverse --check 不实际回退。
实际GLM最终doc闭环通过，最后运行约5.8s、2模型/1工具。全部实际GLM尝试9次含早期HTTP失败/诊断；SDK无自动重试。Windows文件picker/上传/答案/下载/音频/地图真实通过；物理麦克风与手机/分享/原生应用未测。
最终不自动提交，不更换模型，不启动3D/GUI。当前应用 http://127.0.0.1:8000 。
