# 源码读取＋轻量运行探针

读取日期：2026-09-17，Asia/Shanghai。运行目录于15:06:56创建；实际探针时间逐条保存在JSON。仅诊断，未执行 next_step_prompt.md。

## 结论

真实接通了已有 FastAPI 服务、同源前端静态资源、双校区本地知识、OpenAI兼容模型SSE、高德地点查询与步行规划、Edge TTS音频产出。没有浏览器控制面，不能声称页面渲染、地图绘制、麦克风识别、角色动作或扬声器播放已通过端到端验证。结构化行程代码已存在，状态接口报告 implemented/fixture=false，但本轮没有额外付费生成行程。

最高优先级是**校园问答资料筛选及本地充分命中短路**：真实简称问答把明显无关网页带入模型上下文；有明确本地依据的校区历史问题仍等待联网失败约12秒。三个问答均返回正文，未知展厅没有编造开放时间或票价；不能把检索污染直接写成已发生事实幻觉。

## 环境、基线与边界

- Windows路径 E:\AI4TJU 可访问。读取根README、scripts/start-app.ps1、start-dev.ps1、Start-Managed.ps1、Start-Backend.ps1、docs/USER_GUIDE.md、docs/WEB_SEARCH_AND_MAPS.md，并定向查看检查脚本。E:\AGENTS.md、根AGENTS.md均不存在；rg发现的AGENTS只在其他worktree内，不适用于本次根项目只读检查。没有进入这些工作树开展任务。
- 分支 `fix/ip-route-autoplanning`，HEAD `c413c1c4493a6dc327477a83aba04f3eff742ff7`。最初status只有 `?? .worktrees/`；baseline.json是在创建本目录脚本后采集，已包含 `?? docs/diagnostics/`，两者区别见environment.json。
- 实际6个worktree：根目录；api `bb741605`；avatar `10a68446`；knowledge `44d9fbab`；publish `95a8b630`；ui `6c13ddee`。完整分支/路径/HEAD见baseline.json。未切分支、未提交、未合并。
- 已有app模式监听127.0.0.1:8000，PID40832；managed receipt记录35312/42496/40832，根路径为本项目。复用服务，没有启动/停止任何服务或GUI窗口。没有冷启动测量。
- 实际脚本链：`scripts/start-app.ps1 [-Build] → Start-Managed.ps1 -Mode app → .venv/Scripts/python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port <ApiPort> --no-access-log`。app模式要求dist存在、显式加载.env，dev脚本默认端口只是源码默认，本轮实际仅使用已监听的8000。没有运行README中的stop或Build。
- /api/health、knowledge/status、coverage、maps/status及/均响应；这只证明接口/资源可达，真实模型/地图/TTS另由下文实测证明。首页JS内容与当前磁盘dist资产SHA256一致；不能据此证明dist与所有当前TS源码构建一致，也不能证明浏览器执行成功。
- README链接 `docs/R2/LOCAL_TEST_GUIDE.md`不存在；USER_GUIDE仍称7条摘要/2点位，与运行249/106不符。角色也已新增默认VRM。文档不是本轮验收凭据。
- 只记录.env存在；未输出本地密钥、配置文件内容、Authorization、Cookie。参考文本中的带token查询参数已脱敏；地点候选去掉电话和图片字段，只保留公共地点信息。
- 使用已装Python3.11虚拟环境、Node v24.19.0、Vite与ffprobe；不安装依赖。参考仓库只读下载README及少量源码，没有克隆、安装或执行参考系统。

证据：baseline.json、environment.json、runtime_identity.json、source_index.json（符号行号及SHA256）、final_check.json。

## 功能状态与实际调用链

| 能力 | 代码状态 | 本轮验证状态 | 证据和实际边界 |
|---|---|---|---|
| 启动/服务与资源 | 已实现 | 既有服务真实运行通过；重新启动未验证 | app.py组装；同源静态JS下载校验通过；不是fallback演示页面。但没有浏览器执行证据 |
| 模型问答/SSE | 已实现 | 真实运行通过（HTTP客户端） | App.runTask → r2Transport.openStream → POST /api/chat/stream → stream_chat → model.prepare → provider.stream → sources/answer_delta/usage/completed → consumeR2Stream/applyStreamEvent → TaskCard |
| 工具/agent | 部分 | 仅静态证据 | LangGraph固定intent/retrieval/answer/scene_action；不是任意tool calling agent。provider拒绝未执行的tool_calls。3次问答各1次模型，无模型自动重试或换服务商 |
| 本地知识/RAG | 已实现 | 真实检索及上下文问答通过；质量部分失败 | LocalKnowledge加载JSON、别名与中文二元词/规则检索，_user_payload注入retrieved_context_untrusted；没有embedding或持久向量索引，chunk_count=0不代表未接通检索增强 |
| 联网检索/引用 | 部分 | 真实运行暴露失败 | WebSearch.search的公开URL检查与机构域名排序不等于相关性过滤；案例2污染上下文，案例3引用不匹配 |
| POI与多校区 | 部分 | 数据加载通过；简称解析部分失败 | ID、campus、aliases、source_refs、schematic_position存在；地理坐标/入口全部缺失，verify状态不能当坐标核验；“大通”resolve_entities=[] |
| 高德真实路线 | 已实现 | 真实同源代理通过；前端录制回放通过；地图未验证 | CampusExplorer.planRoute → OnlineMapHandle.navigate/navigateTour → AmapNavigation.findDestination/walk → /api/maps/amap/_AMapService/v3/... → 高德。不是仅生成文字或连两点直线 |
| 路线图文语音关联 | 部分 | 仅静态＋解析回放 | RouteResponse.steps给showRoute/highlightStep和routeNarration；App.onReadRoute直接playTask，未追加聊天任务。路线切换停止旧讲解的完整链路未验证 |
| 行程规划/状态 | 已实现 | 仅静态＋状态接口；乱序模拟通过 | TourWorkspace → r3Transport → common/tour_routes.py → TourService/TourPlanner；约束后最多一次模型候选建议，非法建议降为目录草稿，不编造路线耗时。完整真实行程本轮未调用 |
| 录音/VAD | 已实现 | 仅模拟通过 | CampusSpeechAdapter获取media stream、MicVAD分段、编码PCM16 WAV；VAD只分段，不是识别服务 |
| ASR | 部分 | 未验证/配置阻塞 | /api/speech/asr → CampusSpeechService.transcribe → 独立OpenAI兼容audio.transcriptions；health asr=false，未提交假录音冒充校园名称识别 |
| TTS | 已实现 | 音频产出真实通过；播放未验证 | /api/speech/tts → edge_tts.save → /api/speech/audio/<token>；ffprobe识别MP3。完整短句合成后返回URL，不是逐字节音频流 |
| 队列/打断 | 已实现 | 仅模拟通过 | IncrementalSpeechSanitizer按句增量、controller FIFO/预取、adapter audio.onplaying/RMS；stop清活动run/queue/预取并取消。fake播放器不等于实际扬声器 |
| 默认VRM数字人 | 部分 | 资产HTTP通过/自定义模型404；其他仅静态 | createAvatarAdapter → vrmAvatarEnabled默认true → VrmRenderer，kelaita.vrm缺失，fallback AliciaSolid样例存在。RoamController点击气泡/姿态与页面游走，不是校区导航或主动地点介绍 |
| Live2D数字人 | 已实现 | 资产HTTP通过；渲染仅静态/口型模拟 | 可用?avatar=live2d；kelaita模型/Core存在；无motion3、无音素viseme、仅参数姿态/RMS嘴形，autoInteract=false。不能把VRM点击能力写成Live2D点击能力 |
| 主动介绍 | 无（语义导览事件） | 仅静态证据 | VRM定时气泡/点击问候未接POI、LLM或TTS；App.onExplain由行程用户动作触发，非自动到达检测 |

模型配置名在运行事件中为 `glm-5.1`，三个真实响应名为 `glm-51-fp8`，在服务适配器允许别名范围内；这只能验证网关响应标识及协议，不能验证底层权重身份。provider懒初始化并缓存AsyncOpenAI客户端，max_retries=0，总超时源码120秒、正文空闲60秒，未向上游设置max_tokens；本轮用≤80字请求及客户端55秒总截止控制，全部在31秒内结束，无重试。连接/首事件不等于正文，隐藏思考没有算入有效回答。

## 数据与来源

运行数据版本 `sha256:d05f72a518c3`，updated_at=2026-09-15。JSON实数：documents7、facts242（合并可检索249）、POI106（卫津路50/北洋园56）、来源登记22、service_rules28、core_routes78；facts卫津路132/北洋园110。building_count106包含由POI投影的建筑，不是另有106个坐标实体。core_routes是资料关系/成本证据，不等于78条高德道路折线。

所有POI location为空且无核验入口。历史示意图位置是2017底图相对坐标，不能换算成现在入口。来源与抓取日期由SOURCE_REGISTRY/evidence_metadata等提供；许多POI只证明“目录列有此处”。coverage.usable_media=0是知识资产登记口径，**不代表没有照片文件**：tour-photos.ts另有用户提供照片映射，未与该计数贯通。

真实路线选点：`beiyangyuan-datong-center`（大通学生中心）→ `beiyangyuan-zhengdong-library`（郑东图书馆）。高德对应ID为B0FFGJ1TQV和B0H04DD3W7，均parent=B0FFF7ALXA、津南区雅观路135号。GCJ02公共地点坐标、查询日期和结果存map_extra/map_candidates，未写回知识库。它们是地图匹配、不是入口/当日通行核验。

## 8组探针与原始指标

所有测量用客户端perf_counter或Node performance.now；后端trace使用后端自己的monotonic。只在各自时钟内相减。原始SSE事件含每段到达相对时间，保存在chat_1..3.json。

“首段有效回答”在本次固定问题中用首次出现核心内容片段定义：组1“2015年9月”、组2“大通学生中心”、组3“未见”。模型最初会输出角色称呼“猫眼石”，因此保留首非空delta指标，但不把它当有效答复。该定义不是标准化行业基准。

| 组 | 固定输入/期待 | 结果 | 首有效答复 / 全文结束（ms） |
|---|---|---|---|
| 1 校园介绍 | 北洋园何时落成投入使用；期待2015年9月及来源 | 本地命中beiyangyuan-opened-2015，正文正确且引用对应；联网超时后回到现有本地资料 | 16586.46 / 16695.39 |
| 2 校区/简称 | “北洋园的大通在哪里”；期待解析或澄清 | resolver=[]，检索仍找到大通学生中心；模型“你说的是…吧”，明确方位未核验。但联网返回成人/娱乐/社会新闻等无关标题并进入retrieved sources，检索质量失败 | 29624.16 / 30273.34 |
| 3 缺失资料 | 未在数据中找到的“量子玫瑰秘密展厅”当日开放/门票 | 本地无命中；未编造展厅、时间或门票。网络泛校园资料不支持该展厅，最终带引用不匹配提示 | 22321.30 / 23962.27 |
| 4 路线 | 同校区大通→郑东图书馆 | 真实高德286m/229s/3步、多点折线；代理返回92.09ms。录制回放走现有TS解析器和routeNarration，逐步指令一致 | 服务92.09；地图应用null |
| 5 旧请求 | A迟到/B先到、取消、跨校区、过期GET | 生产TourLifecycle/事件守卫4项夹具通过；旧ASR与播放器事件由组8覆盖 | 模拟结果，不当真实网络时延 |
| 6 流式 | 复用组1 | accepted约22ms不算首答；首非空正文16455.67ms，多段送达至16693ms，completed16695.39ms。没有全文缓冲到最后一次送达 | 同组1，不新增LLM |
| 7 语音 | “欢迎来到天津大学北洋园校区。” | 1次应用TTS调用1763.82ms，20592字节、24kHz单声道MP3、3.432秒；ASR配置缺失，未做人声测试 | ASRnull；实际播放null |
| 8 角色/中断 | 假播放器播放中停止、迟到ended/RMS闭口；点击静态检查 | 语音4项定向夹具通过。VRM点击代码存在，实际浏览器点击及角色姿态未验证 | 实际播放/角色时延null |

组4最初选择“东门→图书馆”；东门候选混有天大公交站、工业大学地点和其他设施，未以首条结果冒充真实东门。使用目录中另一个真实地点“大通学生中心”替代后取得路线。3次POI查询分别173.20、356.05、127.02ms，只有1次步行规划。前端navigate在多候选时要求选择，但选择列表未做充分实体/校区过滤；viewOnMap会预览首候选。未证明系统已把错误候选规划成路线。

本轮实际3次LLM（每次1次上游、max_retries=0）、1次高德步行、0次ASR、1次应用TTS合成；另有3次POI查询、3次应用联网检索。**TTS预算观测限制**：已安装edge_tts内部可在403后重试一次，服务未记录供应商尝试数。本轮只观测到1次应用合成，底层尝试数null，不能严格证明供应商层≤1；未补发任何TTS调用。LLM总数3≤4，高德规划1≤2，ASR0≤1。DDGS内部搜索引擎次数也未暴露，不能虚构计数。

所有调用复用已有暖应用、新UUID隔离会话；网关是否冷启动、LLM缓存是否命中未知。三次web trace为unavailable/completed/completed，没有cached。浏览器首字显示、首音实际播放、地图应用完成均null。没有P95、加速倍数或未测内部阶段。

## 性能与一致性判断

1. **确定的等待与上下文问题**：组1本地检索16ms，联网失败12015ms，上游首正文阶段4407ms；组2/3联网6563/6437ms，上游首正文22812/15641ms。组2/3 prompt_tokens4516/4077（组1为902），含无关或弱相关网络内容。只能说明上下文污染与更长等待同时出现，不能声称已证明token增长造成某个固定倍数。
2. **组件生命周期风险，尚无性能实测**：App每段setTasks，TaskCard及非memo的TourWorkspace随父渲染；TourWorkspace注册回调effect可重跑。avatar装载effect为[]，Map SDK有loading缓存和mapAttemptedRef，模型客户端懒初始化；没有证据称它们每个token都重建。React.StrictMode开发环境可能双mount，未计为生产性能故障。
3. **语音并不等全文**：IncrementalSpeechSanitizer在完整句子出现后排队，controller有FIFO与预取；短文本缺断句时会等finish。TTS每句先保存完整MP3，浏览器再下载和play；实际播放器何时开始本轮未测。文本完成不等待音频排空。
4. **路线共享结果范围**：planRoute保存RouteResponse并绘制其steps，routeNarration也使用这些steps，零额外LLM。路线说明在地图面板；App.onReadRoute临时task直接播放，没有加入聊天列表。clearRoute/choose没有直接停止公共语音队列，故“路线变更时旧讲解必停”缺少集成保证；现有停止后迟到事件测试不能证明这个触发路径。下轮浏览器复现前按静态风险处理，不写成真实打断失败。
5. **资料问题分型**：缺数据＝无核验坐标/入口、未知展厅无资料；检索不到＝“大通”无实体别名匹配，且联网主题过滤失效；生成错误＝未知来源ID导致引用提示，未发现所问事实幻觉；前端/语音等待＝无实测，不能拿后端TTS时间替代播放时间。

## 三个参考项目：读取日期与适配

以下只采用README和源码证据，均未在本机运行。源码快照及metadata/完整commit位于references/。引用链接固定commit，未来复用代码另审许可证与素材权利，不建议迁移数据库、模型或UI。

**Hangout AI**，2026-09-17读取，commit `be7ad07249ae32f74710ac4e510e8f88aa8eb5a3`。

- README宣称地点向量检索、行程与地图预览；[README](https://github.com/ayusudi/hangout-ai/blob/be7ad07249ae32f74710ac4e510e8f88aa8eb5a3/README.md)。源码[llm/db/connector.py](https://github.com/ayusudi/hangout-ai/blob/be7ad07249ae32f74710ac4e510e8f88aa8eb5a3/llm/db/connector.py)把country metadata过滤和top_k=2检索用于生成。可借鉴“检索前缩小结构化地域范围”，映射本项目WebSearch缺少实体/校区过滤；不需要更换当前本地关键词检索。
- 同一文件从source_nodes取稳定ID并取回地点metadata；[ChatPage.jsx](https://github.com/ayusudi/hangout-ai/blob/be7ad07249ae32f74710ac4e510e8f88aa8eb5a3/client/src/pages/ChatPage.jsx)用cid加载预览。可借鉴“答案来源→稳定POI身份→预览”的显式链，映射本项目POI ID与地图provider ID的校验缺口。可见的是地点预览/embed和外链，没有由这些文件证明导航折线/讲解一致性。

**Open-LLM-VTuber**，2026-09-17读取，commit `992309c0aa19845960228f880013d4685fde93b5`。

- [README](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber/blob/992309c0aa19845960228f880013d4685fde93b5/README.md)宣称语音中断和Live2D；[tts_manager.py](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber/blob/992309c0aa19845960228f880013d4685fde93b5/src/open_llm_vtuber/conversations/tts_manager.py)将文本/角色actions/音频组合为payload，以序号缓冲有序发送。映射本项目已有controller队列：补route_id/场景代际关联及测试即可，不再建立第二套播放器；不因源码并行合成就扩张本项目调用预算。
- [conversation_handler.py](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber/blob/992309c0aa19845960228f880013d4685fde93b5/src/open_llm_vtuber/conversations/conversation_handler.py)显式取消会话task，并把heard_response传给agent中断处理。映射App.cancelLane、speech.stop与路线场景变更：统一触发取消并区分“已生成”和“用户已听到”。这里只证明服务端通信机制，未读取其独立前端子模块或验证真实播放。

**Pipecat**，2026-09-17读取，commit `ff21057d8a53532852b811bfab99fb47ebe276e9`。

- [README](https://github.com/pipecat-ai/pipecat/blob/ff21057d8a53532852b811bfab99fb47ebe276e9/README.md)宣称可组合语音处理流程。实际[pipeline/worker.py](https://github.com/pipecat-ai/pipecat/blob/ff21057d8a53532852b811bfab99fb47ebe276e9/src/pipecat/pipeline/worker.py)以CancelFrame驱动有界取消和任务清理；task.py已是弃用转发文件。借鉴显式取消事件＋清理完成区分，映射runtime.cancel、speech.interaction和路线epoch，不迁移框架。
- [user_bot_latency_observer.py](https://github.com/pipecat-ai/pipecat/blob/ff21057d8a53532852b811bfab99fb47ebe276e9/src/pipecat/observers/user_bot_latency_observer.py)区分UserStoppedSpeaking、BotStartedSpeaking和逐服务TTFB/聚句阶段；[service_metrics_observer.py](https://github.com/pipecat-ai/pipecat/blob/ff21057d8a53532852b811bfab99fb47ebe276e9/src/pipecat/observers/service_metrics_observer.py)发服务耗时/usage事件。映射本项目已有audio.onplaying trace与runtime事件，补同一客户端单调时钟的请求→有效字→playing→地图应用观察，不能把该框架BotStarted事件直接当本机扬声器已响。

## 最多三项优先级

1. **资料筛选与本地充分命中短路**：真实无关来源入上下文＋本地有答案仍等待网络12秒；修复方案见next_step_prompt.md。先提高依据质量，同时消除这条已有证据的等待。
2. **地点身份/路线联动补齐**：核验少量核心POI坐标与入口、约束同校区候选；确认路线变化同步取消旧讲解、地图和文本共享route_id。当前0坐标、东门检索错配是实证；真实绘制/旧音未停尚待浏览器验证，不能宣称已失败。
3. **语音入口补齐并现场验收**：ASR未配置，当前无法完成中文语音往返；配置现有适配器后用一条已知录音验证，再确认真实播放/停止/角色闭口。不新增主动导览或更换整套语音框架。

## 复跑、人工验证与副作用

实际执行命令（工作目录E:\AI4TJU）：

```powershell
.\.venv\Scripts\python.exe -B docs/diagnostics/20260917-150656/probe.py baseline
.\.venv\Scripts\python.exe -B docs/diagnostics/20260917-150656/probe.py local
# 本轮分别执行chat 1、chat 2、chat 3；外部案例已有记录时脚本拒绝重复付费
.\.venv\Scripts\python.exe -B docs/diagnostics/20260917-150656/probe.py chat 1
# 另执行maps_find、map_extra、maps_route、tts，顺序与JSON一致
node docs/diagnostics/20260917-150656/offline.mjs
node docs/diagnostics/20260917-150656/route-replay.mjs
ffprobe -v error -show_entries format=duration,size:stream=codec_name,sample_rate,channels -of json docs/diagnostics/20260917-150656/tts_sample.mp3
.\.venv\Scripts\python.exe -B docs/diagnostics/20260917-150656/assemble.py
.\.venv\Scripts\python.exe -B docs/diagnostics/20260917-150656/probe.py final
```

安全复跑优先执行offline.mjs和route-replay.mjs，零外部调用。offline包装器复用仓库既有测试，只筛选4+4项，不运行会启动服务的FIXTURE HTTP测试；生成物集中本目录。首次route回放data URL导入Vite分块失败，修正独立探针输出路径后通过，未改业务代码。

新一轮真实调用须创建新的时间目录并独立预算，不删除本轮记录来绕过防重复保护。参考下载命令为 `.venv\Scripts\python.exe -B <本目录>/references.py`，之后带仓库名和已发现文件路径；初次网络沙箱ConnectError，批准只读网络后完成。参考材料不执行。

最短人工验收（属于未来验证，本轮未执行）：

1. 浏览器打开8000，确认当前渲染器/控制台无资源失败；点VRM身体观察气泡与姿态，使用?avatar=live2d单独检查原模型。不要把自定义VRM404后样例回退当珂莱塔自定义素材成功。
2. 用已保存tts_sample.mp3检查真实声音；在应用播报中点停止，检查播放器paused、队列清空、角色闭口，等待迟到事件确认不复活。重新合成必须另记预算。
3. 路线场景先播A，再选B/清空/重规划，检查旧音停止、地图/说明/朗读指向同一route_id；可先用本轮录制路线夹具，真实地图调用另预算。
4. ASR配好后提交一条已知“天津大学北洋园校区”录音；分别计ASR、首有效字、真实audio playing时刻。没有真人麦克风则仍标录音输入验证。

副作用：本目录独立脚本、JSON、报告、参考文本、离线构建、音频副本；既有服务隔离UUID内存会话/事件和联网缓存；.runtime/model-r2.jsonl、map-r2.jsonl追加脱敏trace；.runtime/speech-audio新增本轮token MP3并触发服务原有缓存清理。没有数据库、依赖/锁、业务源码、UI改动。所有前台探针进程均已结束，没有启动需清理的服务；原PID40832保持运行。最终逐tracked文件SHA256及Git状态校验见final_check.json。
