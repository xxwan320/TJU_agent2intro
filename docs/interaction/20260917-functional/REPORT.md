# 数字人功能交付与验收 · 2026-09-17

## 先回答三个关键问题

- **开始讲解：已修复，真实浏览器播放通过。** 尚贤石使用有出处的本地介绍，点击会启用现有语音控制器。真实 TTS 后观察到 `playing`、`currentTime > 0`、未静音；人工听音仍为 NOT_RUN，不能由自动事件替代。
- **路线：已真实画出。** 地图选择起点、两站必去、生成行程后自动显示高德分段步行线路，472 米、约 7 分钟；普通选点保留路线，清空后没有复活。现场门禁/入口通行不因此获得保证。
- **录音：录制、真实 WAV 转换、可编辑文字和确认发送流程已实现；真实 ASR 为 BLOCKED。** 本机没有 ASR URL/模型/密钥。夹具转写不能视为真实普通话识别成绩。

应用仍运行于 http://127.0.0.1:8000 。未自动提交，原有未提交代码、图片及资料保留。

## 版本、故障与改动

基线 HEAD：`c413c1c4493a6dc327477a83aba04f3eff742ff7`，分支 `fix/ip-route-autoplanning`，工作树起初已脏；本报告不把全部 diff 归为本轮贡献。最终前端 `index-DVOvmffu.js`，SHA256 `65b3daa584c973ac69b742366bfb0c7550e5e3e352fa7f4e9eb63d5f3289dcc6`；真实 HTTP 字节与 dist 一致，见 [final-browser.json](final-browser.json)。后端已用现有脚本重启。

改前直接点击尚贤石“开始讲解”：按钮绑定存在、文本存在，但全局语音默认关闭，未进入 TTS，audio 事件为空；不是已证明的供应商失败。尚贤石数据仅为目录句。见 [改前 DOM/事件](before-result.json)、[截图](before-selected.png)。

主要实现文件：

- `frontend/src/ui/App.tsx`、`speech/adapter.ts`：同次操作启用现有播放器，拒绝播放保留音频并就地恢复；文本/voice/语速缓存，失败清理；8秒等待时显示已有资料，40ms合并流更新。
- `data/knowledge/pois.json`、`documents.json`、`SOURCE_REGISTRY.json`：定点补入尚贤石官方事实和出处，未重绑定图片。
- `TourWorkspace.tsx`、`CampusExplorer.tsx`、`transport/amap-navigation.ts`：稳定 ID 多选、交叉约束报错、独立起点与路线代际、真实路径自动应用、缓存；至少两站草稿默认不等待模型。
- `TripBrief.tsx`、`PoiSources.tsx`：有内容的出发提示、实际路线成本、日期/来源入口，技术风险折叠。当前出发面板使用已收录官方样例，**不是每次自动在线核验**。
- `backend/knowledge/retrieval.py`、`query_routes.py`：注册表、严格来源/参数校验、并发有限检索、正文提取、日期校区过滤、分级缓存与 singleflight、5类工具、查询 trace。
- `backend/model/service.py`、`stream_routes.py`：接入已有 LangGraph 的 intent/retrieval/answer/scene_action；稳定事实直答；复合问题保留稳定事实并单列动态状态；模型工具选择与程序分流明确区分。
- `frontend/src/speech/recorder.ts`：显式短录音，MediaRecorder 解码并真正重采样到 16kHz 单声道 PCM16 WAV，最多29秒，取消/卸载释放资源；识别文字不自动执行路线。
- `backend/r2_contracts.py`、`shared/r2.ts`、`shared/r2.schema.json`：兼容扩展流事件关联及查询状态；R2/R3 schema 校验通过。

电脑操作技能用于选择验证方式；浏览器工具清单为空后，按任务许可使用本机 Chrome/Playwright。首次真实地图测试受网络沙箱阻止，取得执行批准后才继续，未绕过权限。

## 验收状态与证据边界

| 项目 | 状态 | 证据和限制 |
|---|---|---|
| U01 A/B/A 图文切换 | PASS browser | 最终 DOM 中稳定ID正确，原图 naturalWidth=640/474/640；[最终事件](final-browser.json) |
| U02 尚贤石讲解/停止 | PASS browser+live_http；NOT_RUN human_audio | [真实播放记录](after-result.json)、[截图](after-selected.png)；最终构建音频夹具复验 |
| U03 播放中切点/停止旧队列 | PASS browser+mock；NOT_RUN human_audio | [最终浏览器记录](final-browser.json)；实际播放器+合成音调夹具，提交文本分别为正确POI；不是现场听音 |
| U04 关闭语音/拒绝后恢复 | PASS browser+mock | 默认关闭能启动；注入 NotAllowedError 后出现再次播放，恢复后currentTime推进 |
| U05 多选冲突 | PASS browser+mock | [真实控件](route-browser-final.json)冲突禁提交；跨校区ID后端拒绝及前端换校区用离线交互回归 |
| U06 两站自动画线 | PASS browser+live_http | [截图](route-browser-final.png)、[routeId与事件](route-browser-final.json)；该次构建 `index-DHWLp9bA.js`，最终构建仅做离线路线回归，未重复耗尽预算的地图调用 |
| U07 出发建议/日期 | PASS browser（本地已收录资料）；PASS mock（异常过滤） | 同上截图已有建议、实际成本、2026-09-07消息及无日期一般指南；超时/旧公告是[夹具trace](offline-traces.json)，未宣称今日已核验 |
| U08 录音编辑发送/取消 | PASS browser+mock；BLOCKED live ASR | [最终录音记录](asr-browser-final.json)、[截图](asr-browser.png)；假麦克风真实编码，夹具文字编辑成Q01后发送，收到有据本地答案；真实ASR接口返回未配置 |
| Q01/Q02/Q04 | PASS live_http | [本地直答SSE](live-answers.json)，零LLM，分别核对2015年9月、北洋园、赵冷月/墨子 |
| Q03 | PASS browser | 最终选中尚贤石的本地介绍和讲解文本；未额外付费重跑独立问答 |
| Q05/Q11 | PASS mock；NOT_RUN live current verification | 空图书馆正文、超时均不等价“没有通知”；官方入口仍可访问，不保证今日闭馆时刻 |
| Q06 | FAIL早期样本，修复后PASS live模型+recorded_replay检索 | [修复后答案](model-composite-fixed.json)准确保留稳定事实；早期错误保留于原日志；最终流式首正文未额外实测 |
| Q07 | NOT_RUN 独立整题 | 未为了题目覆盖增加真实调用；未知ID/跨校区校验有单测，不能替代整题评分 |
| Q08/Q09 | PASS 约束与路线子项；NOT_RUN Q08精确30分钟整题 | 两站主链已画线，must/avoid冲突不静默删除；不承诺路径避让区域 |
| Q10 | PASS browser本地出发面板；BLOCKED live档案馆正文 | 本次档案馆读取失败，未把已收录9月7日消息冒充本次实时成功 |
| Q12 | BLOCKED live ASR | 需补配置后真人普通话验收 |

## R01—R08 与起点按钮

| 项目 | 状态/证据类型 | 本轮结果 |
|---|---|---|
| R01 目录不足/正文/缓存 | PASS local+live_http+browser | 新闻网正文实取1290字符，尚贤石已定点入库；固定讲解零LLM/网页，原图绑定保留 |
| R02 社区备用 | PASS mock；NOT_RUN live正文证据 | 社区标“非官方”，只补文化；实际维基分类页取得标题/链接但没有正文，不作为介绍依据 |
| R03 图书馆空壳 | PASS mock | 注册抓取器保持禁用，返回unavailable而非无公告，社区不确认今日开放 |
| R04 日期/校区/否定 | PASS mock（已测部分） | 旧有效期不变成当前、跨校区拒绝、保留“不开放”；同文去重实现；复杂转载冲突整组尚未独立实测 |
| R05 共享deadline | PASS mock | 受剩余请求时间约束、两轮不重置、取消释放；未对供应商账单做推断 |
| R06 缓存隔离 | PASS mock | campus/poi/day/query/约束/来源/版本隔离，must/avoid集合排序，stopIds保序；失败15秒不变成无公告 |
| R07 合并/取消/代际 | PASS mock+browser | 两消费者只合并一组实际请求、取消一方不伤另一方；A/B/A与路线清空迟到保护 |
| R08 速度/真实正文 | PASS已测部分；NOT_RUN完整冷/热三组 | 原始样本与失败均保留；不把状态和占位算正文，不据小样本宣称P95或稳定倍数 |

R01—R07详细回放：`tests/knowledge/test_registered_retrieval.py`、`tests/interaction/*`、[offline-traces.json](offline-traces.json)。

起点按钮逐项：地图选起点 PASS browser/live地图；手输坐标 PASS mock；定位一次权限拒绝 PASS mock；持续定位启停与清理 PASS mock；IP城市粗定位限制 PASS mock；持续IP启停 PASS mock；实时跟随移动/时间阈值和单监听 PASS mock。真实GPS、真实持续IP及现场跟随均 NOT_RUN，不用地图选点替代这些成绩。

## 实际检索与模型能力

默认链路：当前问题/校区/POI → 本地关键词与别名索引 → 充分时直答，否则注册来源检索 → 过滤与6段/6000字符上下文 → 一次GLM → 实际来源ID引用。不是向量库，也不是新增多Agent平台。

联网阶段最多3500ms、单来源1500ms、两轮4页、总并发3/域名2；45秒是整请求资源截止，不是响应速度承诺。缓存稳定86400秒/新闻300秒/当前规则60秒；失败15秒/完成范围但无证据30秒。没有配置搜索供应商，覆盖仅本地和注册公开页，搜索调用为0。

真实记录：[已批准的3页读取](live-pages-authorized.json)：新闻网成功；档案馆unavailable；维基分类页只有线索。每种异常/备用类型的可复跑trace见 `scripts/evaluation-offline-traces.py`，该脚本明确全部离线。

GLM网关：[能力探针](capabilities.json)真实返回合法get_poi tool_call，能力支持。但后续选择曾不返回工具、强制选择又返回畸形JSON，旧失败保留于 [model-tool-replay-final.json](model-tool-replay-final.json)。现已拒绝非法参数并回退后端工作流，回归通过。合法工具实际执行使用离线模型提案验证；**不能称整个在线自主工具链已稳定验收通过**。换网关后需重跑显式能力探针；删除 `.runtime/campus-capabilities.json` 可关闭工具选择，保留程序工作流。

复合问题修复后，实际进入上下文的 `beiyangyuan-opened-2015` 等ID和582字符统计见 [最终模型trace](model-composite-fixed.json)。动态状态为unavailable，未编造当天闭馆时间。

## 性能与调用审计

DOM三次原始值（ms）及中位数：

| 样本 | 改前原始值 / 中位数 | 改后原始值 / 中位数 |
|---|---|---|
| 大通 | 39.921,31.553,23.366 / 31.553 | 51.872,31.244,21.679 / 31.244 |
| 郑东 | 22.923,17.928,19.466 / 19.466 | 31.255,20.189,17.515 / 20.189 |
| 尚贤石 | 23.790,23.329,19.659 / 23.329 | 27.585,30.093,25.078 / 27.585 |

以上包含自动点击调度开销，同一点重复点击有热缓存/无状态变化因素，并非严格冷启动图像性能。可见介绍达到热样本≤300ms目标，**不是介绍大幅提速的证据**；主要收益是尚贤石内容充实且按钮可播。图片decode自然宽度验证通过，未采集完整三次冷/热图片下载耗时。

真实首音：改前没有音频事件，改后冷样本2669ms，热样本33.7/28ms。三次混合中位33.7ms不能当冷启动成绩；单独冷缓存三次未测。最终夹具首音不计入真实TTS速度。

路线：早期修复构建草稿90.18ms/画线11180.36ms；后一次158.724ms/5585.803ms，两次网络环境有波动，不宣称固定加速倍数。热缓存重绘54.187/47.903/44.700ms，中位47.903ms，零新增POI/步行调用。没有任务前相同路线的有效改前基线。

Q01/Q02/Q04真实SSE首正文106.408/4.511/3.933ms，完成110.271/7.080/5.042ms。Q06早期错误样本首正文43529.675ms、完成44197.811ms；修复后实际模型生成完成18813ms，但检索为回放、非同条件SSE对照，不能由此声称模型首token加速。最终UI夹具停止录音到可编辑98.828ms，仅前端/模拟ASR性能。

外部调用预算审计（失败计入，不含本地HTTP）：

- LLM 8次：能力1、初次动态题1、两轮模型回放3+2、最终复合题1；已停止追加。另一次未加载显式env在本地被NOT_CONFIGURED拒绝，未发供应商请求。
- TTS 4次，**比默认3次多1次**；原因是分句预取/取消仍发起一次额外请求，已停止真实调用并切换夹具。没有把取消视为免费。
- POI查询4次、步行分段4次，达到上限；后续全部离线/缓存。
- ASR供应商0次；真实本地ASR未配置失败2次，模拟成功/取消不计供应商识别。
- 搜索0次。公开页明确记录10次（动态题4+受限直读3+获批补读3）；初次测试隔离遗漏还触发未逐条留存的公开页尝试，按最多7次保守记账，**不能声称严格守住原12次上限**。补读3次曾另获明确批准。最终离线测试已替换联网函数，不再泄漏调用。
- SDK基础资源、地图瓦片、Edge音色目录不等于POI/步行/TTS合成计数；供应商内部行为和计费不可见。

后续执行真实探针前请重新明确预算；不要一键重复所有 evaluation 脚本。

## 验证、配置与剩余工作

`npm run build`通过；最终后端115项全量通过；`node scripts/check-interaction.mjs` 最终71项通过；R2/R3两套schema及知识schema均通过。构建仍有原有大chunk提示；测试有Starlette弃用警告，不影响本轮通过结果。

独立ASR最小配置在根 `.env`，**不要发到聊天或前端**：`CAMPUS_ASR_URL`（支持OpenAI兼容audio/transcriptions的base URL）、`CAMPUS_ASR_MODEL`、`CAMPUS_ASR_API_KEY`。不能使用普通聊天completions地址替代。配置后重启，真人说Q12→停止→检查地名→编辑→发送；无误前不自动执行路线。

人工最短验证：打开应用，北洋园选大通/郑东确认图片；选尚贤石开始并听音→停止→切点；地图选起点→必去大通与郑东→观察路线；点录音说Q12→停止→编辑确认。权限拒绝恢复、设备实际扬声器、真实GPS及完整现场路线仍需人工完成。

已知未闭环：真实ASR配置、人工听音、实时图书馆正文来源、档案馆本机取页失败、模型工具选择稳定性、出发面板自动动态刷新，以及完整同条件冷/热三次测量。没有将这些事项包装成“全部完成”。
