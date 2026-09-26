# A 数据与设备协作交接

状态：READY_FOR_INTEGRATION（2026-09-25，A接口/数据/Windows执行器）。实际页面与桌面动作验收仍由B完成；本文件为A窗口共享协作入口。
B 请使用 docs/handoff/B_harness_toolchain.md 回复；A 会在实施过程中读取。
当前没有直接跨 Codex 窗口消息通道，文件写入不等于对方已读。

## 基线
- 分支：fix/ip-route-autoplanning
- HEAD：f459060bd5e8e1c9d5540ca348d5e08fe9a18e36
- 初始变更：仅 .worktrees/publish 子工作树 dirty，保留。
- 任务书：C:/Users/ASUS/Downloads/AI4TJU_A_Data_Sources_and_Mobile.md
- 已读配套 B 文档的分工及共同契约 v1。

## 文件归属与请求
- A 负责数据/检索薄适配、文档受限读取、设备执行器、资产清单和 A 验证报告。
- B 负责共享 schema、根锁文件、应用入口、GLM 编排与最终页面接入。
- A 不改中央会话、地图路线、讲解队列、主页面布局或照片映射。
- 请 B 在回复文件公布共同契约 v1 的实际代码路径、导出类型、provider 接入方式和当前负责文件。
- 未确认文件唯一修改人前，A 不修改 B 负责文件。

## 初步发现（尚未重测）
- backend/knowledge/retrieval.py 已有注册来源、超时、缓存、singleflight 和最后消费者取消逻辑。
- backend/knowledge/user_library.py 已有 TXT/Markdown/PDF 等解析，应复用并补会话/选定 uploadId 约束。
- backend/knowledge/service.py 与 backend/model/service.py 已有本地 RAG 链路。
- frontend/src/ui/tour-photos.ts、tour-videos.ts 已有资产映射；部分照片跨地点复用，清单需标识，不改原图映射。
- backend/speech 与 frontend/src/speech 已有语音链路，待核对配置和设备能力。

## 验证状态
A01—A12：NOT_RUN；目前仅完成静态初查，不代表真实服务或手机验证。
外部服务调用：0；GLM 调用：0。

## 2026-09-25 A 已读取 B 契约（双向文件协作成立）
- A 已读 backend/harness_contracts.py 与 B_harness_toolchain.md，接受共同 v1。
- 实际后端入口：backend/knowledge/harness_provider.py，provider 导出对象及 async list_capabilities / execute_tool / cancel_tool 已落盘，正在测试。
- 同模块导出 router（仅上传 /api/harness/uploads），请 B 挂载。
- 上传安全接线：B 在已授权会话的可信代码中调用 provider.create_upload_ticket(ToolContext)，返回120秒一次性 uploadToken；前端实际选中文件后 POST {uploadToken,filename,contentBase64}。仅TXT/MD，1MiB。不能暴露按任意客户端sessionId签发票据的无校验入口。其他现有文档解析不受影响。
- document_read 仅读取经该票据实际选中的 uploadId，绑定session/campus，1小时过期；此授权记录保存在进程内，重启需重新选择。
- backend 设备能力默认 unavailable/DEVICE_DISCONNECTED；B 必须与当前 browser 能力探针合并后，前端执行 device_*，不能把未知设备当available。
- 前端独立入口 frontend/src/device/a-device.ts 开发中：createDeviceExecutor(options) -> list_capabilities(context), execute_tool(request), resume_tool(actionId, continuationRequest, trustedEvent), cancel_tool(runId,toolCallId), disconnect()。
- options.getSession() 提供可信上下文；注入现有 speechAdapter、upload(file,{request,signal})、可验证apps白名单执行回执。resume必须新toolCallId及新预算，保留原关联。具体签名以落盘模块为准。
- B共享ToolResult禁止额外顶层字段；关联信息放data。
- A新增且唯一修改：backend/knowledge/harness_provider.py，frontend/src/device/a-device.ts，tests/knowledge/test_harness_provider.py，tests/interaction/a-device.test.*，scripts/audit-a-assets.py，scripts/verify-a-provider.py，data/knowledge/a_*，docs/diagnostics/harness-a/，docs/diagnostics/a-data-device-baseline.md。
- A2资产盘点及A3设备执行器由本窗口并行子任务完成，均按上述文件隔离；B负责文件不触碰。
- 当前仍 IN_PROGRESS，未声明READY，测试及真实来源调用证据随后追加。

## 用户最新优先级：先完成 Windows 功能调用
- 用户明确手机真机后置，优先 Windows 浏览器内数据/文件/语音/分享/应用能力接线。
- 前端文件已落盘 frontend/src/device/a-device.ts；入口 createDeviceExecutor 已稳定。
- 后端首轮5项测试PASS；真实三个POI官网调用全返回证据，15页面请求、0搜索服务、0模型请求。cold/warm各3次记录 docs/diagnostics/harness-a/provider-probe.json。
- 前端用 execute_tool 在Windows浏览器本地建立pending，resume_tool(actionId,新toolCallId+新deadline+原runId/idempotencyKey/context的请求,event.nativeEvent)须同步由按钮点击进入；不要在resume前await网络，否则丢用户激活。uploadToken请预先向可信后端取得或在选文件之后再取得并上传。
- 后端pending不是浏览器本地actionId，B需先在客户端execute建立动作。
- B shared schema strict差异已要求前端修正并验证：executionLocation=frontend；error仅code/message；generation整数；关联放data。
- computer-use/CUA和node_repl均无法启动：Windows sandbox SetTokenInformation(TokenDefaultDacl)1344。当前真实桌面点击/麦克风/系统分享未通过，不以离线事件替代。
- A2已完成：91原图、104运行照片实例、1视频可读；2角色VRM，0校园建筑模型。42有效POI都有图，真实缺图分支NOT_RUN；8个既有跨点绑定（13图实例）已标记，映射未改。

## READY_FOR_INTEGRATION：A数据与Windows执行器（2026-09-25）
- 后端数据/上传代码：provider及router均可导入；6个A针对性测试+12个既有检索/知识用例，总18通过。document_read仅选定TXT/MD，其他格式在此新入口明确不支持。
- 前端 a-device.ts 已完成：12项离线测试与项目TypeScript检查通过；测试实际用B的Python Capability/ToolResult严格模型验证所有回执。
- 已修复 executionLocation=frontend、error仅code/message、generation数字；B无需再为旧版本browser/retryable/string generation做兼容转换。
- 详细Windows接线见 docs/diagnostics/harness-a/mobile-report.md。
- 阅读B当前App接线发现 createDeviceExecutor 暂未注入speechAdapter，因此speech_input必然unavailable；请B从现有唯一speech controller注入.getAdapter()，不要另建实例。未知apps仍应保持空白名单，不能用打开URI当完成证据。
- 真实Windows界面验收受自动化工具沙箱故障阻塞；现有离线分支已完成。最终页面/麦克风/分享/应用动作需B整合验证。
- 数据真实探针：knowledge_search和official_search三个已有地点均completed；官网共15页面请求、0检索服务请求、0模型请求；另有3次web工具参考页读取。真实耗时见provider-probe.json，不冒充页面绘制。
- 数据样本：data/knowledge/a_fact_samples.json；来源观察：a_source_observations.json；资产：a_asset_inventory.json。
- 无新增依赖、无根锁文件修改、无自动提交。A01—A12独立记录docs/diagnostics/harness-a/acceptance.json，旧H结果未覆盖。
- 复跑：.venv/Scripts/python.exe -B -m pytest tests/knowledge/test_harness_provider.py tests/knowledge/test_registered_retrieval.py tests/knowledge/test_local_knowledge.py -q -p no:cacheprovider；node --test tests/interaction/a-device.test.mjs；.venv/Scripts/python.exe -B scripts/audit-a-assets.py；.venv/Scripts/python.exe -B scripts/verify-a-provider.py --live（会真实联网，最多3POI冷/热各3次）。


## A 最终交付索引
- 探针报告：docs/diagnostics/a-data-device-baseline.md。
- A01—A12：docs/diagnostics/harness-a/acceptance.json；不覆盖原H记录。
- Windows执行器/API接线及限制：docs/diagnostics/harness-a/mobile-report.md。
- A增量补丁：docs/diagnostics/harness-a/a-incremental.patch；SHA256与文件白名单：a-delivery-manifest.json。仅A新增文件，不包含B或用户原有变更；当前目录已有这些文件，不应再应用补丁覆盖当前树。
- B契约是集成依赖，由B维护，未复制到A补丁。
- knowledge_search还复用了现有维护者公开文档库；私有文档不会进入公共检索。对应隔离测试通过。
- 中断的官网请求实际HTTP次数无法确定时账本pageFetches=null，并说明unknown，不报告假的0。
- 暂无新增依赖。未新建手机壳、3D模型、跨应用GUI或任意shell入口。
- 待B：已有唯一语音适配器注入、Windows按钮续任务与回执实测；缺实际apps执行回执渠道保持unavailable。
