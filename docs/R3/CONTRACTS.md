# R3 增量契约 1.2.0

本文件冻结首轮“60分钟校园参观”主线。机器权威源 `backend/r3_contracts.py`；由 `scripts/export-r3-schema.py` 生成 `shared/r3.ts` 与 `shared/r3.schema.json`，OpenAPI在shared/openapi.json。TS不替代后端语义校验。额外字段拒绝、UUID标识、UTC时间、65536字节请求上限和原ApiError均沿用。

旧 /api/health 与旧聊天/三类生成/SSE/语音/地图仍1.1.0兼容；/api/tours/status和TourResult标记增量1.2.0。不是替换既有visit_plan文本生成。

## 范围

输入时长（首轮10—240分钟，主验收60）、兴趣、起终点、单校区；初次3—5站，剩余计划修改后可少于3站。开始导航→手动确认到达→讲解→完成本站→下一站；改剩余时间/删除/替换未完成站；暂停、恢复、取消、明确保存后的刷新恢复。

后续：内容后台、完整弱网/跨设备同步、其他高校、完整3D/捏脸/多角色/社交。无比赛规则，不设置推测的比赛权重。

## 数据摘要

|类型|关键字段/语义|
|---|---|
|TourRequest|request_id/session_id/campus_id/duration_minutes/interests/start/end/accessibility；PlaceRef只含poi ID或current_position/unspecified，不含设备坐标|
|TourStop|稳定stop_id、poi_id、title、visit_minutes、visit_time_source、purpose、evidence_ids；停留分钟是用户偏好或规划分配，不伪装地图测量|
|TourPlan|plan_id/version/campus/status、原结构请求、stops/legs/evidence/warnings/created_at；每次内容修改version+1|
|TourSession|tour_id/session_id/state_version/status/plan/progress/current_stop_id/remaining_minutes/saved/updated_at；每次成功状态变更state_version+1|
|PlanRevision|request_id/session_id/expected_version/expected_state_version，互斥操作set_remaining_time/remove_stop/replace_stop；每次一个原子修改|
|RouteCostResult|from_ref/to_ref、可空distance_m/duration_s、source/verification/checked_at/campus_access/evidence_ids/reason；无来源数字为null|
|Evidence|evidence_id/source_ref/claim/relation/verification/checked_at/valid_until；retrieved不是supports，支持关系还需C按具体结论核验|
|SpeechInteractionEvent|本地B→A，识别文字/插话/真实播放/错误，带interaction/session/campus/generation/request快照；识别text不得写运行日志|
|EvaluationRecord|case/dataset/build、fixture或live、结果/约束/证据计数/耗时/模型调用/Token/地图次数；无prompt/坐标/录音/聊天正文|

Evidence.source_ref引用D同一库的source/fact ID；联网资料可沿用原Source ID，但retrieved只能说明检索到。verified必须有核验时间，入口/开放时间还需有效期和适用日期。C检查引用存在、校区、时效、与结论的支持关系；Pydantic检查形状不是事实验证。

## 状态与版本

C唯一持久/运行权威，A展示服务端快照并持请求/取消代次。TourSession不复制消息；所有LLM上下文继续用 `backend/model` 原HistoryStore（20条/32000字符/1000会话/1小时、同会话单并发、成功完整轮次才提交）。

|动作|允许前态|后态及条件|
|---|---|---|
|create|无|draft或infeasible；初始计划必须3—5站，不可行可空并解释|
|check|draft|checked或infeasible；验证ID/校区/证据/时间缺口；未知路线明确warnings，不宣称路线最优或事实全核验|
|start|checked|active，首个未完成站navigating；A随后发起实际地图导航，服务端start不代表地图成功|
|arrive|active且当前站navigating|当前站arrived；仅用户确认，IP坐标不自动判到达|
|explain|active且当前站arrived|当前站explaining；讲解内容复用原guide_script聊天/流和B播放，状态不代替真实播放证据|
|complete_stop|active且当前站arrived/explaining|当前站completed；最后一站完成则session completed，否则等待next|
|next|active且当前站completed|下一个pending站navigating；无剩余则completed|
|pause|active|paused；A取消当前请求等待/路线与音频，C停止执行计时|
|resume|paused|active；重新确认当前位置/剩余时间，未完成站续接，不自动播放旧音频|
|cancel|draft/checked/active/paused/infeasible|cancelled终态；已完成记录保留；重复同request重放|
|save/forget|任意现存状态|显式saved=true/false；A据返回值存储/删除白名单快照|
|revision|draft/checked/active/paused|只改剩余未完成站，完成站和stop_id稳定；replace生成新stop_id；拒绝已完成/当前正在讲解站，先pause再改当前站|

checked表示结构与约束检查已运行，不等于路线/通行已实地确认。缺少路线时间时无法证明60分钟可行，需明显警告并由用户确认开始；有确定冲突返回infeasible，不能将未验证标最优。

两个expected版本都必填。C在提交结果前原子检查两版本和取消标记；任何冲突409且不落库。成功revision计划version+1、state_version+1；普通command仅state_version+1（check若修改计划内容也增plan version）。不可行的修改可作为错误返回，不覆盖正在执行的有效计划，附安全原因，UI允许重新编辑。

幂等：R3沿用request_id，作用域(session_id,request_id)，请求指纹含路径/tour/action/所有正文。相同ID+相同请求已完成→返回原结果（replayed=true），不再调用模型或累加usage；处理中→409 TOUR_REQUEST_IN_PROGRESS；同ID不同内容→409 TOUR_IDEMPOTENCY_CONFLICT。先查幂等，再查版本，因此保存结果丢失可用同一ID重试。原聊天重复ID409行为不变。

保留期1小时，最多1000 tours/1000幂等结果，全应用沿用runtime并发上限，不复制LLM历史。过期GET404 TOUR_EXPIRED；不得静默复用过期ID执行新任务，C与原runtime保留期一致。A对旧request/session/campus/generation、较旧plan/state版本全部拒收；公共acceptsTourResult只辅助判断，不能代替A唯一请求生命周期。

## 增量HTTP（同源JSON）

|方法/路径|输入→输出|M0|
|---|---|---|
|GET /api/tours/status|contract_version/implementation/fixture|实际not_implemented，C可在实现后更新service.implementation|
|POST /api/tours|TourRequest→TourResult|501|
|GET /api/tours/{tour_id}?session_id=|TourSession|501|
|POST /api/tours/{tour_id}/revisions|PlanRevision→TourResult|501|
|POST /api/tours/{tour_id}/commands|TourCommand→TourResult|501|
|POST /api/tours/restore|TourRestore→TourResult|501|
|POST /api/maps/route-costs|RouteCostRequest→RouteCostResponse|501|

M公共router注入C的tour_service/cost_service；C只实现所属service文件。JSON响应等待上限125秒，C业务任务总上限120秒；不增加WebSocket或第二种SSE。计划操作用原GET runtime/events和POST requests/{request_id}/cancel，C在同一runtime注册操作、stage=request/model/knowledge，日志仅状态/数量/耗时/安全错误码；不向旧RuntimeEvent添加任意payload。

A中止fetch后仍使用原cancel请求通知C，不能将断开本地等待当上游确认。取消结果未确认继续标unconfirmed。原route取消链和音频stop继续独立。

错误均原ApiError外壳：422 VALIDATION_ERROR；404 TOUR_NOT_FOUND/TOUR_EXPIRED；409 TOUR_VERSION_CONFLICT/TOUR_IDEMPOTENCY_CONFLICT/TOUR_REQUEST_IN_PROGRESS/TOUR_INVALID_TRANSITION/TOUR_STOP_LOCKED；422 TOUR_INFEASIBLE/TOUR_RESTORE_INVALID；429 TOUR_CAPACITY；499 cancelled；501 TOUR_NOT_IMPLEMENTED/ROUTE_COST_NOT_IMPLEMENTED；503 model/map/asr原错误沿用。409后A重新GET，不盲目覆盖或自动重发修改。

## 保存与恢复

默认saved=false，内存tour idle TTL1小时；用户明确点击保存并收到成功后，A仅在本机存储该TourSession白名单快照（`ai4tju.r3.saved-tour.v1.<session_id>`）。不保存UI聊天/麦录音/精确位置/路线polyline/厂商POI匹配结果；非保存任务刷新后不自动恢复。

restore需原session_id及saved=true快照。C视客户端快照为不可信输入：重新核对真实POI/校区/证据、唯一站点、已完成状态、版本与时效，不相信客户端verified字段；同tour仍存活时不以旧快照覆盖新状态；过期或重启可重建新的tour_id并返回版本化快照，active恢复为paused等待用户继续。不自动恢复麦克风、定位或播放。用户forget清除本机快照；取消是否保留已保存记录由用户删除动作决定。跨设备、完整离线、服务端用户账户存储留第二轮。

## 公共导航与预算

A调用 `frontend/src/transport/tour-navigation.ts`，委托已有 `AmapNavigation.navigate`。其无起点→IP、过期设备/IP更新、缺失/近似/未核验目标→高德匹配、同名候选续跑、应用内步行和名称外部导航均保留。起终点只发固定同源JS安全代理；不能退回AMap.Walking插件回调或改成必须REST Key。外部导航仍由原r2Transport.externalNavigation取得。

- 生产应用日预算沿用map_load=100/geolocation=3000/poi_search=100/walking_route=200；低额真实smoke=1/1/0/1；默认MapBudget构造仍smoke，A生产装配使用已有按日scope与MAP_DAILY_LIMITS，不自行重置。
- 应用发起次数≠代理HTTP次数≠高德控制台扣减。失败/取消不退款；单实例单并发，每类6次/分钟且间隔至少5秒。按钮防重，provider无自动重试；容量/失败保留外链。
- 目标匹配仅内存10分钟、最多100项；不改D目录坐标。当前路线仅当前导航内存持有，暂停/取消/切校区/离页释放，已发请求中止并忽略迟到结果；不持久缓存polyline或精确位置。
- 设备/IP位置2分钟过期；手动起点不随时间失效。IP明确“网络区域中心，非设备位置”。连续定位30秒仅移动标记，不自动请求路线；开始规划沿用停止持续定位。
- 首轮无自动偏航重算。用户发现偏航→提示→点击确认重算，沿同一预算/取消通道新route_id；不存在虚构的精准自动到达。修订下一站之后也等待明确继续/导航动作。
- RouteCostRequest仅public POI或抽象起终点，不发设备坐标。C用已有资料返回可追溯成本，未知null；不因规划3—5站穷举高德所有排列。真实设备路线详情只给导航UI，含设备轨迹的距离/步骤不进入LLM、持久行程、运行日志和EvaluationRecord。
- 用户在自由文本主动输入坐标时，A/C在交给模型/持久化前移除坐标并要求通过导航位置入口提供；不能以“没有lat字段”代替文本隐私检查。

## 语音与人物

`shared/r3-speech.ts` 冻结B的可选增量入口：`frontend/src/speech/interaction.ts` 导出createSpeechInteractionController；start/stop/dispose和onEvent。B发送recognition.partial/final、speech.interrupted、playback.started/ended/cancelled、speech.error。每条带上下文代次；partial只展示，final由A决定提交，B不触发LLM。新发言/切校区先失效旧代次，A取消模型并调用B.stop，迟到识别或音频回调不得污染新任务。

playback.started仅来自实际onplaying，ended来自onended；音频URL/合成完成不等于播放。原SpeechController保持同一串行队列和中文音色，导航讲解也共用该队列。

B在自身AvatarAdapter增加可选setAudioLevel(level 0..1)，用音频Analyser/RMS驱动基础嘴形；停止/静音/取消归零，不能用随机振幅冒充真实音频。RMS不提供音素级专业口型，能力按真实实现标记。若需修改shared/contracts.ts或现有公共类型先向M提协调请求。

## 效果与Token效率

D冻结独立题集/期望约束/支持证据与版本；C导出EvaluationRecord，M独立复算。case至少覆盖完整60分钟、时间缩减、删/替换、暂停恢复、保存刷新、歧义/无资料、受限入口、跨校区、取消和旧响应；不是比赛官方评分标准。

usage=null就是unknown，不能记0；多次调用已知部分可相加但usage_status=partial，unknown_usage_calls保留。fixture与live分开统计，重放幂等结果不再算新模型调用。报告任务完成率、约束满足率、证据支持比例、已知Token/成功任务以及usage覆盖率；无成功任务或unknown分母不能输出伪造的“0 Token效率”。不捏造价格/上游计费，更不导出隐藏推理、完整prompt、识别正文或坐标。

## 隔离联调

`tests/r3_fixture.py` 独立FastAPI app，合成fixture-stop-*，所有响应带X-R3-Fixture=TEST-ONLY；不被backend.app导入、不读.env、不调用provider。它是响应形状/页面流程模拟器，不是C的幂等、合法转换或可行性实现验证；那些必须由C和M1单独测试。

`docs/R3/examples.json` 供四窗对齐字段；测试/明确开发环境才能使用。生产新接口明确501，旧接口实际功能继续。B真实ASR和D真实资料缺失不阻塞A/C用夹具验证协议。