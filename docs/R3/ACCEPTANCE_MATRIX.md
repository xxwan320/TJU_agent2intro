# R3 首轮验收矩阵

状态：PASS=该行范围真实通过；NOT_IMPLEMENTED=业务待实现；NOT_TESTED=已具代码/准备但未验；BLOCKED=明确外部依赖。FIXTURE_PASS只说明隔离测试。M0和M1分列，不能以M0准备替代现场效果。无比赛官方权重，以下是工程验收项。

|ID|负责人|要求|依赖|方法/证据|M0状态|M1状态|
|---|---|---|---|---|---|---|
|P01|M|五树共同不可移动基线，现场保留|Git现场|祖先/干净/ff-only、完整SHA receipt|见parallel-state.json|NOT_TESTED|
|P02|M|独立依赖、端口、无秘密复制|锁与缓存|每树uv frozen、npm ls、tsc、导入/契约；目录非链接|见parallel-state.json|NOT_TESTED|
|P03|M|9个最小类型、HTTP/TS/schema一致|公共代码|Pydantic边界、schema --check、OpenAPI及typecheck|PASS|NOT_TESTED|
|P04|M|正常服务不返回夹具成功|独立app|生产501、fixture标头和app依赖不污染测试|PASS|NOT_TESTED|
|P05|M|旧聊天/三类生成/地图/语音兼容|当前基线|check-r3完整离线回归/构建，最新地图测试|见VERIFICATION|NOT_TESTED|
|T01|A/C|时长兴趣起终点→3—5站单校区结构计划|D核心资料/真实模型|60分钟输入，真实JSON/卡片、正确模型/usage|NOT_IMPLEMENTED|NOT_TESTED|
|T02|C/D|草稿/checked/不可行可区分|来源/成本|缺时间/关闭/冲突案例，unknown不造数，不宣称最优|NOT_IMPLEMENTED|NOT_TESTED|
|T03|A/C/M|开始导航保留IP/目标匹配/内部步行/外部入口|现有地图/网络|真实点击，单次预算，粗略起点标识，目的地歧义续跑|原链路代码/既有API实测；R3待接|NOT_TESTED|
|T04|A/C|到达→讲解→完成本站→下一站|任务状态/B|手动确认，状态转换/界面与实际播放分证据|NOT_IMPLEMENTED|NOT_TESTED|
|T05|A/C|减少剩余时间|成本/D|60改30，完成站不动，新版本仅剩余计划|NOT_IMPLEMENTED|NOT_TESTED|
|T06|A/C|删除未完成站|版本/状态|删后站点顺序与进度一致，锁定已完成站|NOT_IMPLEMENTED|NOT_TESTED|
|T07|A/C/D|替换站点/别名歧义|真实POI检索|同校区候选、证据/成本重查，不替换已完成站|NOT_IMPLEMENTED|NOT_TESTED|
|T08|A/B/C|暂停/恢复|音频/位置/状态|停止请求与播放、计时冻结，继续不重复已完成站|NOT_IMPLEMENTED|NOT_TESTED|
|T09|A/B/C|取消终态|原runtime|LLM/TTS/路线各时点取消，迟到无写入，上游未知如实|NOT_IMPLEMENTED|NOT_TESTED|
|T10|A/C|用户明确保存后刷新恢复|localStorage/C恢复校验|未保存不恢复、保存可恢复为paused、forget删除、篡改/过期拒绝或重验|NOT_IMPLEMENTED|NOT_TESTED|
|T11|C/M|计划/执行双版本与幂等|原runtime|同ID同body一次调用；冲突、处理中、旧版本、提交前取消|NOT_IMPLEMENTED；仅字段已验|NOT_TESTED|
|T12|A/M|旧响应不覆盖新计划|A lifecycle|延迟交叉/切校区/取消重试；公共guard测试|FIXTURE_PASS；A装配待验|NOT_TESTED|
|T13|C/M|原HistoryStore唯一|模型服务|代码审查、连续两轮修改，失败取消不写入历史|边界冻结|NOT_TESTED|
|N01|M/A/C|统一预算/无隐藏重算/取消|原MapBudget|按4类计数、刷新预算保持、失败不退款、0定位自动路线|原隔离测试；R3待装配|NOT_TESTED|
|N02|C/D|距离时间来源与通行核验分离|当前证据|数值来源/核验期；无资料null；高德成功不提升门禁核验|字段FIXTURE_PASS|NOT_TESTED|
|N03|M/A/C|精确位置不进模型/持久化/日志/评测|导航内存边界|结构字段拒绝+自由文本坐标输入+网络/存储/导出白名单检查|结构FIXTURE_PASS；全链待验|NOT_TESTED|
|S01|B|真实中文识别→A请求→TTS可听往返|ASR/麦/声音|服务/权限、真实中文音频和final事件、模型及onplaying关联|BLOCKED：独立ASR未配置|NOT_TESTED|
|S02|A/B|连续5轮与插话|ASR/浏览器|partial不发模型，final由A处理，旧generation不回流|NOT_IMPLEMENTED|NOT_TESTED|
|S03|B/A|实际音频驱动基础嘴形|Analyser/人物|画面与RMS、静音/停止归零，不用随机值|NOT_IMPLEMENTED|NOT_TESTED|
|S04|B/A|停止播报与取消回答分开|原队列|连续讲解/导航/插话无重叠、跨chunk净化、4音色|原代码/隔离回归；现场待验|NOT_TESTED|
|D01|D/C|核心3—5站真实服务/开放/门禁资料|官方/现场证据|可回查claim、适用日期、冲突/无资料记录|NOT_IMPLEMENTED：需核心线核验|NOT_TESTED|
|D02|D|别名检索与歧义/跨校区|同一资料库|冻结题集，相关证据/错误拒答分别统计|原库已有；R3题集待补|NOT_TESTED|
|D03|D/A|合法校园实景|授权/下载来源|逐张作者/原链接/使用依据、对应校区、实际显示|BLOCKED：可用照片0|NOT_TESTED|
|E01|D/M|独立任务评测题集冻结|D证据|ID/版本/hash，核心流程和失败案例预先固定|NOT_IMPLEMENTED|NOT_TESTED|
|E02|C/M|任务效果与Token效率|真实usage|EvaluationRecord验证；fixture/live分开；unknown不记0|字段FIXTURE_PASS|NOT_TESTED|
|X01|A/M|小屏/中文IME/空错误态|浏览器|实际交互截图/录屏，不用API代替|NOT_TESTED|NOT_TESTED|
|X02|M|秘密和私密日志零进入提交/构建|本地白名单扫描|只输出命中位置数量，.env/录音/原始提示词保持忽略|见VERIFICATION|NOT_TESTED|
|X03|M/全体|完整真实60分钟场景|T/S/D各项|需求→3—5站→导航→讲解→语音调整→中断继续，独立审查/返修后再跑|NOT_TESTED：M1范围|NOT_TESTED|

外部依赖局部阻塞不阻止其他行继续。M1逐行填PASS/FAIL/BLOCKED和提交/证据，不删除难项。原R2目标及历史记录保留，但不以旧“无地图Key”否认当前代码。实际定位、开放/入口通行、中文听音必须现场独立验收。