# A/B 收尾实测报告 — 2026-09-25

工作区 E:\AI4TJU；HEAD f459060bd5e8e1c9d5540ca348d5e08fe9a18e36；分支 fix/ip-route-autoplanning。未提交、推送或重置。当前运行 http://127.0.0.1:8000 。

## 结论与范围
已修复2类实际状态管理故障，并在最终构建验证桌面主链。不是C01—C15全部子场景通过：真麦克风、人工听音、真机、系统分享、同步视频与当日官网规则仍有限制。没有观察到本轮引入的回归；未观察能力不计通过。

## M0 进入本轮时
A最终READY_FOR_INTEGRATION、B最终集成交付已写入同一主工作区，均基于当前HEAD。历史.worktrees/api/avatar/knowledge/ui/publish与当前HEAD不同，未重合并或覆盖；publish原有dirty保留。适用根AGENTS.md未发现，各子工作树AGENTS不用于主树。任务书复制到docs/plans。
entry.json保存HEAD、工作树与源码/数据哈希；entry-build.json确认进入时服务返回HTML与dist一致。后端8000，FastAPI托管生产dist，无5173开发实例。A/B既有未提交文件全部保留；结束逐文件哈希证明只有manifest中的3个既有文件发生本轮修改。来源不明的额外源码变更为零。
配置沿用原GLM及HTTPS网关，不输出.env。真实文档闭环使用原生工具协议；2模型/6工具/45秒、检索3.5秒预算未放宽。固定数据：郑东图书馆、大通学生中心；低成本性能脚本另使用第九教学楼。已有42可见点均有映射，未伪造缺图点/坐标。资料版本见entry/final-build中的data/knowledge哈希。
状态入口：App selectedPoi与refs管理选择，TourWorkspace管理结构化行程，CampusExplorer管理地图/路线，tour-photos管理原图映射，NarrationSession与既有speech controller管理媒体，HarnessClient只管理工具通道；保留独立聊天/ASR/路线代际。
进入时旧套件149后端+79前端+12设备离线通过；历史A/B真实PASS仅作为待复核，本轮重跑证据见下表。

## M1/M2 故障、修复和基线
1. CLOSEOUT-01：会话异步建立前未登记活动任务。等待中停止仍提交1个旧任务；反序会话响应提交[new,old]。在await前建立requestEpoch，取消失效预约，await后检验，旧超时只取消自己的任务。两个修前失败用例转为通过；真实Chrome延迟真实session响应、停止、再放行后零/runs提交。
2. CLOSEOUT-02：256容量淘汰覆盖incoming key，把新任务登记到被淘汰会话。修前KeyError；改为evicted_key后同例通过，下一代正确取消上一代。
bugs.json、command-*.json保留红/绿日志。增量所有权：原B transport/runtime最小修复，本轮新增边界回归；A实现与原图映射未改。新增测试已接入既有check-interaction入口。
fixed-baseline.json是修复后的基线，不能与entry坏版本做性能收益比较。最后产品源码修改后完成tsc+vite构建、项目登记进程stop/start，final-build.json记录实际资产哈希与进程，服务返回HTML/JS/CSS逐字节与dist一致。

## M4 逐项结果
| 案例 | 状态 | 证据范围及限制 |
|---|---|---|
| C01 | PASS_REAL | 郑东→大通→郑东，原图路径、解码尺寸、当前卡片正文一致；地图选中 marker 与行程选中态未在该专项逐一断言；真实缺图样本没有补造 |
| C02 | PASS_REAL | 开始→暂停→继续→停止；AUDIO playing/pause 和 stopped 状态；无人工听音、嘴形/字幕推进量化；stop=26ms为UI状态观察 |
| C03 | PASS_OFFLINE | 媒体迟到、切点代际与取消既有回归；未新增真实TTS迟到场景；本轮TTS额度已用完 |
| C04 | PASS_REAL | 地图手选可靠起点→聊天导航郑东→真实1009m路径→选大通保线；清空、重规划和起点失效仅既有离线回归；不把全部子场景算真实通过 |
| C05 | PASS_OFFLINE | 必去/避开、未知点、非法坐标与粗定位策略；未真实遍历全部输入组合；实际结构化行程创建及导出另见C08 |
| C06 | PASS_OFFLINE | 来源过滤、过时通知、部分失败与取消；保留本地知识；当日官网规则和天气NOT_RUN；未重复A历史联网请求，天气provider未配置 |
| C07 | PASS_REAL | 真实选TXT上传→询问集合时间→有来源的09:30回答；恶意文字未执行；上传隔离/非法路径有后端离线证据；不宣称所有文档格式均支持 |
| C08 | PASS_REAL | 当前行程实际下载MD 1052字节、JSON 5920字节并解析；可选ICS未实现；没有系统日历写入 |
| C09 | NOT_RUN | 真麦克风三句普通话、拒绝与取消；缺可控真人录音与听音；权限/取消只有离线测试，未以TTS冒充ASR |
| C10 | PASS_REAL | Windows真实文件picker、授权上传续任务；分享取消/应用不存在/断线只有离线验证；系统分享、真机与目标应用动作NOT_RUN |
| C11 | PASS_REAL | 原生GLM文档工具闭环；非法工具/参数与无回执超时另有离线验证；工具闭环证据范围不扩展为视觉/原生MCP支持 |
| C12 | PASS_REAL | 会话等待中停止零提交；缺起点任务可取消；容量淘汰和反序请求离线修复；重连、全部独立通道组合未全真实遍历 |
| C13 | PASS_OFFLINE | 检索超时/部分结果、预算边界、分片JSON与不完整流协议；未做真实供应商故障注入；断流浏览器表现未做独立验收 |
| C14 | NOT_RUN | 已接入可选3D/视频保留；已有角色正常截图；校园3D未启用，同步视频播放未专项验证 |
| C15 | PASS_OFFLINE | 逐项旧功能保护见 protection.json；不是所有项目合并PASS；页面通过、离线通过和未测项目分别记录 |

C15具体旧功能结果在protection.json，包含聊天、本地介绍、图片、选点、讲解、普通话、地图、行程、导出及历史生成/保存能力，未删掉未测项目。真实桌面截图和音频事件同属最终产品构建；地图截图可见实际路径，1009米约14分钟，普通选点保线。普通聊天实测完成耗时16332ms。
后端全套150通过；前端既有79+新增2通过；A设备12通过；两份R3 schema检查通过。保留Starlette弃用、connect_tcp未await警告和大chunk构建提示，未把警告写成零问题。

## M3 性能结论
未采纳额外性能改动：当前低成本测量不足以定位稳定可归因瓶颈。第九教学楼三个新上下文DOM原始211/28/23ms，热17/74/73ms；图片250/47/45ms，热106/152/1051ms。尾部1051ms含滚动/等待，不能由此归因图片网络或擅自压缩原图。追加郑东/大通严格映射检查原始值见local-browser.json，未混成同条件优化对照。
讲解首次playing 2071ms、停止状态26ms；路线请求至完成绘制回执5674ms，各1次，不报P95。人工首音、首段有效正文未测。performance.json包含修复后原始数据、空优化后数据、未采纳理由；不宣称速度提升。

## 调用账本
本轮Harness真实GLM 2次，另普通聊天1次请求；TTS2次、POI4次、步行1次、主动官网抓取/搜索0、视觉0、ASR0。具体run-ledger.jsonl及call-ledger.json；供应商内部不可见重试为unknown，历史A/B调用不混入本轮。真机与TTS/离线fixture分开。

## 运行、复跑与5步人工验收
```powershell
cd E:\AI4TJU
.\scripts\stop.ps1
.\scripts\start-app.ps1 -Build
# 离线回归（不必重启）
.\scripts\check-r3.ps1
node --test tests/interaction/a-device.test.mjs
```
1. 打开http://127.0.0.1:8000，北洋园选择郑东→大通→郑东，核对名称/正文/实景图。
2. 开始、暂停、继续、停止讲解，人工确认声音、字幕及角色；本轮没有替你宣称听音通过。
3. 地图手选起点，聊天输入“导航到郑东图书馆”，核对真实路径；再选大通检查保线。
4. 选择TXT/MD，问通知集合时间，核对来源原文；生成行程并下载MD/JSON。
5. 真麦克风录入“暂停讲解”，验证转写确认及权限拒绝/取消；未配置或拒绝时应真实报错。
浏览器脚本scripts/closeout-*.mjs是本轮可复跑步骤，联网脚本有请求预算账本；预算达到后不应反复重跑或删除账本绕过限制。再次验收使用新的运行目录与预算。

## 限制和回退
实现/证据限制：源站时效规则没有本轮真实重查；图片缺图退化仅离线；C03/05/13部分场景离线；未覆盖所有SSE浏览器断流恢复组合。已有协程警告根因未定位，后续需专项跟踪。
环境：没有真人音频/物理麦克风验证与手机、系统分享/原生应用完成回执；天气provider未配置；模型视觉、音频输入、原生MCP未知。可选：校园3D/GUI不启用，已有同步视频未专项播放验证，ICS未实现。
本轮只保存incremental.patch，适用进入本轮已包含A/B未提交成果的快照；不是基于HEAD直接重放A/B整份diff。patch-validation.json仅做git apply --reverse --check且通过，没有实际回退。若要回退，先核对manifest哈希/后续重叠变更，停止本项目登记实例后再审阅反向应用；不得reset或回退A/B原成果。新报告/截图保留作审计。
