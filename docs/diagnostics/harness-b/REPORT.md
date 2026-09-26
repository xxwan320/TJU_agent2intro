# B Harness 集成交付（2026-09-25）

已在 E:\AI4TJU 实际实现并与 A 共享文件协作。当前可访问 http://127.0.0.1:8000 。未提交、推送或重置分支。

## 先查到什么，修了什么

初始分支 fix/ip-route-autoplanning，HEAD `f459060bd5e8e1c9d5540ca348d5e08fe9a18e36`，仅既存 `.worktrees/publish` dirty。已复核 local_task_prompts、UI/视频及原3D/Harness任务书，未发现适用AGENTS.md。原有资料检索、LangGraph、上传解析、唯一讲解控制器、图片映射和真实路线保留。

1. 最大连接断点：原模型URL使用HTTP，网关已要求HTTPS；只读模型清单证实HTTPS证书验证成功且提供glm-5.1。仅升级协议，不改密钥/型号，不关闭TLS校验。早期失败保留 glm-probe-http-before.json 与 gateway-model-list.json。
2. 新增 contract v1、有限工具执行器与SSE回执。2次模型/6次工具/45秒总期限；外部检索受3.5秒子预算；非法工具/参数零启动，完整重组JSON后执行，独立只读并发最多3。第二轮再提工具时不执行第三轮，保留已取得证据。
3. 接入 A 真正的资料、TXT/MD上传和设备provider，不重复抓取或解析。服务端随机会话与令牌签发上传票据，私有上传隔离并加入gitignore。设备手势动作结束原等待，用原关联、新toolCallId与独立期限续任务；回执过期/代际不符拒收。
4. 增加当前结构化行程Markdown/JSON下载与来源展示；下载限令牌持有人、1小时、内存文件ID。未实现可选ICS。
5. 修复原单点路线绘制后未发onRouteApplied的缺口；等待绘制帧后回执，选点保留有效路径。普通话文字仍走同一入口，明确停止同时取消工具等待。

## 实际调用链

现有普通校园问答仍复用 `CampusModelService → LangGraph intent/retrieval/answer → LocalKnowledge/user_library/campus_feeds/registered retriever → GLM`。
新增工具任务：`App统一入口 → HarnessClient → /api/harness/runs SSE → GLM工具计划 → 白名单/schema/预算 → A provider或现有前端控制器 → ToolResult/真实回执 → 第二轮GLM回答`。
这是有真实工具调用的检索增强流程，不以是否装向量库判断RAG。明确讲解控制和导出直接执行。图片/角色与既有ASR未换。

## 验证结果

统一回归149后端、79前端、A设备12离线通过；末次小改后Harness+上传受影响检查16通过及构建通过。仅有既有Starlette弃用提示、HTTP协程警告和大chunk提示，未把警告写成零问题。
真实Chrome 153：选文件上传；带恶意指令文字的通知按资料处理；GLM回答09:30；MD/JSON实际下载并打开；A→B→A图片；音频playing/pause/resume/stop；高德路径实际绘制且普通选点保线；零模型的任务取消。静态截图不当作人工听音或物理麦克风通过。

| 案例 | 状态 | 验证范围/限制 |
|---|---|---|
| B01 | PASS_REAL | 实际Chrome音频playing/pause/resume/stop；人工听音未测 |
| B02 | PASS_REAL | 最终文档闭环2模型/1工具；非法参数零启动另有离线证据；独立echo初次闭环失败保留 |
| B03 | PASS_OFFLINE | TEST_PROVIDER并发、失败保留部分结果、截止及第三轮拒绝；A官网实源另列 |
| B04 | PASS_REAL | 可信点击选择TXT、上传、GLM回答09:30；正文越权文字未执行 |
| B05 | PASS_REAL | 下载并打开内容对应当前结构化行程；可选ICS未实现/未测 |
| B06 | PASS_REAL | 真实连续选点/图片；迟到与切校区隔离为离线回归 |
| B07 | PASS_REAL | 真实高德walking 1次，画线后回执；切到大通保留routeId |
| B08 | PASS_OFFLINE | 沿用原普通话ASR与唯一adapter；权限/迟到离线通过，物理麦克风NOT_RUN |
| B09 | PASS_REAL | 仅Windows文件选择上传续任务真实通过；系统分享/应用唤起/手机NOT_RUN，异常分支离线通过 |
| B10 | PASS_OFFLINE | 超时不成功、旧代际拒收、重复不执行；设备断线由A离线验证 |
| B11 | NOT_RUN | 用户未选择B5，无校园建筑模型，不启用 |
| B12 | PASS_REAL | Windows真实取消等待起点的路线任务；零GLM/零walking；模型流取消离线；GUI未启用 |

完整案例绝对路径、前提、工具、禁止动作和证据在 `E:\AI4TJU\docs\evaluation\harness-split\cases.jsonl`。A独立验收见 `docs/diagnostics/harness-a/acceptance.json`。

## 性能与调用账本

最终相同Chrome/构建，3个新浏览器上下文各冷/热一次：卡片DOM中位数冷 28 ms、热 17 ms；图片显示中位数冷 46 ms、热 150 ms。热图片更慢的原始值照实保留；测量包含滚动进入视口/等待显示，并非HTTP下载。
另一次实际首playing 1723 ms、停止24 ms；真实路线浏览器总计 5759 ms；最终文档闭环5781 ms；取消等待UI115 ms。单次媒体/路线数据不报告P95。没有改前同样本基线，不能宣称加速倍数，也未补做三组冷/热媒体和路线性能。
原始值 `performance-final.json`、`browser-report.json`、`route-browser.json`、`run-ledger.jsonl`。全轮实际GLM尝试9次（含协议配置修正前失败和诊断），无自动重试；最后成功任务2次。A官网15页面/0搜索服务/0GLM；路线专项1walking+2place搜索。早期浏览器总地图/TTS上游次数未全量埋点，明确unknown；不以成功事件推算计费。详见 `call-accounting.json`。

## 集成、版本和回退

A与B初始HEAD相同，A按新增文件隔离交付。`a-integration-review.json`记录全部哈希核对和增量patch反向检查；同工作区已包含A文件，未再次应用整树覆盖。B增量见 `b-code.patch` 和 `b-code-manifest.json`。无新增依赖，uv.lock/package-lock.json未改；精确现用版本见 `dependencies.json`。

启动：`scripts/start-app.ps1 -Build`。离线：`scripts/check-r3.ps1`、`node --test tests/interaction/a-device.test.mjs`。浏览器：`node scripts/harness-browser.mjs`（真实文档最多2模型请求）、`node scripts/harness-route-browser.mjs`（真实地图）、`node scripts/harness-performance.mjs`（不调模型）。独立 `scripts/harness-probe.py` 是原echo探针，旧第二轮兼容失败保留；最终完整闭环以真实文档任务为准，不再次运行来凑通过。

回退先停止本项目登记进程；对 `b-code.patch` 执行 `git apply --reverse --check`，确认当前无后续重叠修改后才反向应用。A文件独立保留，不reset、不清理用户差异。根.env协议修正不在patch中；当前网关必须HTTPS，不建议恢复已失效HTTP。需取消功能时可移除Harness路由与前端接入后重建；不要删除用户上传来回退功能。

## 明确保留的限制

物理麦克风、人工听音、系统分享/目标应用实际唤起、Android/iOS：未验；无已验证应用回执通道时保持unavailable。天气业务provider未配置；页面原有装饰天气不冒充工具天气。图像/音频模型输入、模型并行工具、多模态/原生MCP未知；未配置实际外部MCP，未启用3D/GUI。设备语音adapter已注入，但模型不额外开启第二麦克风入口。会话/任务/导出在内存，重启需重新选文档/导出。性能改前对照和三组媒体/路线仍未测，不称所有12项全真实通过。

参考官方工具调用接口：[Z.AI function calling](https://docs.z.ai/guides/capabilities/function-calling)。公开设计参考：[Codex](https://github.com/openai/codex)、[Claude Code](https://github.com/anthropics/claude-code)。采用程序掌握执行、受限工具、事件回执与可取消循环的思路；没有复制其完整Agent或改用其模型。

补丁交付核验：A原始patch反向检查未通过（部分文件BOM/末尾换行及快照差异）；没有强行应用。B按已匹配哈希的A白名单生成 `a-reviewed-incremental.patch`，反向检查通过；B自己的 `b-code.patch` 也通过。A原始文件/补丁均未改写。详见 `patch-validation.json`。

补丁交付核验：A原始patch反向检查未通过（部分文件BOM/末尾换行及快照差异）；没有强行应用。B按已匹配哈希的A白名单生成 `a-reviewed-incremental.patch`，反向检查通过；B自己的 `b-code.patch` 也通过。A原始文件/补丁均未改写。详见 `patch-validation.json`。
