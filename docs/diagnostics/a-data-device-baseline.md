# A 数据、资产与 Windows 设备基线

日期：2026-09-25。原始探针：`harness-a/baseline.json`。用户后续明确优先 Windows 功能调用，手机真机验证后置。

## 仓库与协作

- 初始分支 `fix/ip-route-autoplanning`，HEAD `f459060bd5e8e1c9d5540ca348d5e08fe9a18e36`。
- 初始只有 `.worktrees/publish` 子工作树 dirty；未切换、清理、提交或覆盖。
- 根目录及上级未发现适用 AGENTS.md；其他工作树内 AGENTS.md 不适用于主工作区。
- 已读 A/B 任务书、`docs/evaluation/starter/local_task_prompts.md`。README 引用的 `docs/REVIEW_POLICY.md` 在本次主工作区不存在，未将其当成已执行门禁。
- A/B 通过 `docs/handoff/A_data_device.md` 与 `B_harness_toolchain.md` 双向确认。B 维护共享契约、入口、锁文件、模型和页面接入；A 维护数据与设备执行器。

## 复用的已完成部分

| 能力 | 位置 | 当前观察 |
|---|---|---|
| 权威 POI 与过滤 | `backend/knowledge/service.py`；`data/knowledge/pois.json`、`map_searchability.json` | 原始106条，前端隐藏过滤后104条，当前公开/可搜索目录42条；未恢复被过滤点 |
| 本地资料 | `data/knowledge/documents.json`、`facts.json`、`SOURCE_REGISTRY.json`、`evidence_metadata.json` | 242条事实，保留来源与原始日期 |
| 来源注册及预算 | `docs/evaluation/starter/source_registry.json`、`retrieval_policy.json` | 可执行检索已引用；文件中的design_only历史标签不能替代当前代码事实 |
| 网络检索 | `backend/knowledge/retrieval.py` | 注册域名、重定向目标检查、3.5秒总期限、1.5秒单源、最多4页面、并发3/同域2、查询缓存、共享请求取消 |
| 文档解析 | `backend/knowledge/user_library.py` | TXT/Markdown及已有其它格式解析；维护者公共资料与私有session记录分开 |
| 语音 | `backend/speech/service.py`；`frontend/src/speech/adapter.ts`、`interaction.ts` | 既有普通话采集/转写/取消通道；本机ASR配置项存在，但不等于本轮麦克风实测 |
| 照片/视频/人物 | `frontend/src/ui/tour-photos.ts`、`tour-videos.ts`；`frontend/src/avatar/vrm/manifest.ts` | 资产已独立盘点；不改原图或映射 |

## 实际 RAG 链路

`backend/model/service.py:CampusModelService._retrieval_stage` 根据问题与校区调用 `LocalKnowledge.search`。本地检索使用关键词、别名和中文二元字符匹配，在加载时合并 documents、facts 与POI资料。其返回的 Source 保留具体文档id、片段、URL及时间。稳定本地命中可以直接回答；需要动态证据时调用注册来源检索。`_user_payload` 把选中的片段放入 `retrieved_context_untrusted`，同时传入查询状态和来源范围，之后由已有GLM生成回答。

该项目已有真实检索增强链路；没有在本轮训练、微调或另装向量数据库。A provider只返回证据，不调用GLM。

## 本轮新增接入

- `backend/knowledge/harness_provider.py` 导出 `provider`，复用 B 的 `backend/harness_contracts.py`。
- `knowledge_search`、`official_search`、`document_read`、`weather_query`、`device_capabilities`；真实未知设备不当作可用。
- 官方检索优先已有POI登记正文地址；仅官方来源。来源正文缓存补充原查询缓存，保留抓取时间；成功60秒、无正文30秒、失败15秒。原查询TTL、合并和取消继续生效。
- 上传router只接收一次性票据与实际TXT/MD内容，最多1MiB；票据须由B在可信会话验证后签发。读取仅限本次进程内选定且绑定session/campus的uploadId。不会读取模型给出的本地路径。
- `frontend/src/device/a-device.ts` 为Windows浏览器提供能力探针与待用户动作执行器，注入已有语音适配器和B上传回调；不改主UI或创建第二媒体会话。

## Windows 与设备探针

Windows本机 Python/Node、项目依赖与ffprobe可用。未发现ADB命令，没有已确认的手机、原生壳或设备授权通道。Windows浏览器API的实际可用状态由执行时能力探针决定，不由服务端猜测。

CUA两次启动失败，第二次报告 `SetTokenInformation(TokenDefaultDacl) failed: 1344`。computer-use的node_repl初始化也退出。因此本轮没有真实桌面点击、权限弹窗、麦克风录音、系统分享或应用唤起证据。离线设备事件测试不会记作真实Windows操作通过。

配置报告只含项名称和存在布尔值，不含密钥、网关凭证或其散列。天气没有已配置provider；返回 `SOURCE_UNAVAILABLE`。

## 验证边界

本地及官方数据、文件可读、图像/视频解码属于实际资源验证；HTTP/容器检查不代表浏览器绘制或VRM首帧。设备错误与权限/取消分支为离线模拟；完整页面、音频和工具编排验收归B。
