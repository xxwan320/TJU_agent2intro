# 海小棠资料卡与同步配片修复记录

2026-09-18 · 工作区 `E:\AI4TJU` · 分支 `fix/ip-route-autoplanning` · HEAD `7c0f14b`。
保留上轮全部未提交工作，本轮未 reset、提交或推送。运行地址：http://127.0.0.1:8000 。

## 交付状态

- **资料卡完整可见**：1440×900、1366×768、390×844 的真实 Chrome 边界检查和截图通过。目录独立滚动，卡片按内容撑高。
- **判断标签移除**：删除公开查询状态行，简化来源文案，修改模型提示词，并在正文展示与语音清理层移除检索过程标签。保留“开放时间暂不清楚”等事实不确定性。
- **介绍自动联动配片**：文字、录音识别后发送、卡片按钮都进入同一讲解会话。郑东图书馆已有可播放的真实照片导览片；**不是实拍视频**。没有视频的地点继续照片/图文讲解。
- **实际验证层级**：已运行 Google Chrome、真实本地接口、真实 TTS、真实 MP4、真实高德步行接口及本地 faster-whisper。录音测试使用合成普通话 WAV 注入 Chrome 的虚拟麦克风；没有真人麦克风、扬声器回声或噪声环境验收。

## 根因与修改

1. 资料卡已经挂载且数据存在，但 `.tour-map` 被限制为 800px，`.explorer` 为 flex 纵向容器；地图目录不收缩，资料卡默认收缩并 `overflow:hidden`。Chrome 实测卡片仅 **30px 高、内容需 293px**，内部 profile 高度为 0。现在资料卡置于目录前，取消父级高度限制和卡片收缩；桌面基础卡约377px，手机约661px，卡片 `scrollHeight == clientHeight`。见 [修复前边界](before-layout.json)。
2. 原视频按选中点位/头像 speaking 状态绑定，缺少“明确介绍 → 地点身份 → 实际音频播放”的会话归属。`introduction.ts` 解析明确指令；`narration-session.ts` 包装既有 `CampusSpeechController`，没有新增 TTS 队列。每次介绍唯一 ID，切换时中止网络并丢弃旧回调。
3. `GuidePresentation.tsx` 只有一个有源视频，由音频实际 `playing` 事件驱动。普通换段、暂停/续播不重建播放器；句段字幕来自正在播放的队列项。短片循环，结束/停止后停帧。媒体检索4秒、缓冲8秒截止，失败回退照片。
4. VRM renderer 将实际左手掌世界坐标投影到展示容器；正常文档流为视频留出完整空间，头像移动到同一展示区托举。桌面560px上限、16:9；窄屏采用视频在上、人物在下的相邻面板。Live2D 保留原路径，缺少手掌 API 时使用普通媒体面板。旧头像视频元素只在旧兼容接口需要时挂载，正常导览不重复创建播放器。
5. 保留上轮按 `(request_id, utterance_id)` 区分预合成语音操作的 `speech_conflict` 修复；补上“合成尚未完成就暂停”、失败片段恢复队列、权限失败重试。恢复声音入口也走当前讲解控制器。
6. 同地点基础资料和配片元数据采用有界60秒缓存，按校区、地点、主题/日期区分；同时请求去重，取消一个消费者不影响另一个消费者。后台按规范 POI/校区选择本地媒体，禁用或错误校区索引不会被文件名扫描重新启用。
7. Chrome 还发现跨校区时，旧高德 SDK 尚未加载完会占用地图操作锁。新地图等待本地操作槽，旧加载可取消并在15秒截止，迟到的脚本不能创建旧地图。实际地图加载与步行路线再次验证通过。

主要文件：`frontend/src/ui/{App,CampusExplorer,PoiProfile,GuidePresentation,TourWorkspace}.tsx`、`guide-presentation.css`、`introduction.ts`、`narration-session.ts`、`frontend/src/speech/controller.ts`、`frontend/src/avatar/vrm/*`、`frontend/src/transport/{cached-read,r3-knowledge,amap-navigation}.ts`、`backend/knowledge/videos.py`、`shared/presentation-text.ts`。

## 实际素材与接口

`beiyangyuan-zhengdong-library` → `data/videos/beiyangyuan-zhengdong-library-1.mp4`。
由本项目三张郑东图书馆现场照片编排，12秒、960×540、25fps、H.264、无声，305996字节。前端明确显示“实景照片导览片 · 非实拍视频”，来源和本机使用范围记录在 manifest。

当前没有可公开使用的官方实拍视频直链。[天津大学图书馆视频门户](https://v.lib.tju.edu.cn/show)需要登录，未绕过访问限制。实拍视频素材仍待提供，放入 `data/videos/<poi_id>-N.mp4` 并更新 manifest 即可。详见 [媒体接入说明](../../../data/videos/README.md)。

后端返回 `video/mp4`；真实 Range 请求返回206、1024字节，与当前服务 OpenAPI 一致。见 [接口检查](api-report.json)。目录仍为卫津路22、北洋园22；其余62条原始数据没有删除或重新进入规划池。

## Chrome 同步实测

设备：Windows，AMD Ryzen 9 9955HX（16核32线程），Google Chrome 153.0.8010.48，headless，通过已有 Playwright 控制系统安装的 Chrome。
本地服务与素材，服务器及文件缓存未清空。首轮新建浏览器上下文，第二轮同页再次播放；**不是整机冷启动测试，也未将 HTTP 缓存命中作为已证明事实**。

| 项目 | 起算与终点 | 实测 |
| --- | --- | --- |
| 首次介绍准备 | introduction.request → speech.speaking | 2151.2ms |
| 首次配片联动 | speech.speaking → video.playing | 5.0ms |
| 同页再次播放 | speech.speaking → video.playing | 17.0ms |
| 暂停画面 | command.pause → video.pause | 5.4ms |
| 停止画面 | session.stop → video.pause | 5.8ms |

本地启动差≤500ms、暂停/停止≤300ms的目标均达到。最后联网截图中，各新上下文实际传输 MP4 约306296字节，资源请求耗时30.2/8.6/9.6ms。外部视频检索、远程大视频冷启动未测，不外推这些数字。
证据：[实际媒体事件](real-media-events.json)、[9项浏览器场景](browser-report.json)、[6项边界与语音场景](edge-case-report.json)。

边界测试中的404、10.5秒延迟和旧媒体迟到是明确的网络故障注入，其余接口与 TTS 保持真实；缺媒体回退采用实际大通学生活动中心，无伪造视频。
语音实测路径：合成“介绍一下这里。” → Chrome MediaRecorder → PCM WAV → 真实 faster-whisper CPU → 返回“介绍一下这里。” → 确认发送 → 同一讲解会话 → 真实 TTS/视频。
录音端超时已与后端60秒识别窗口协调为65秒。真人普通话识别率、远场/噪声和回声性能仍需设备验收。

## 验收结果与截图

- `npm run build` 通过（现有大包大小提示仍在）。
- `CAMPUS_WEB_SEARCH_ENABLED=false .venv\Scripts\python.exe -m pytest -p no:langsmith -q`：121 passed，1条依赖弃用警告。
- `node scripts/check-interaction.mjs`：73 passed，包含明确标记的离线 fixture，不作为真实地图证明。
- `node --test --test-skip-pattern=FIXTURE tests/ui/*.test.*`：22 passed；和上一条有部分重叠，不相加为独立总数。最后UI小改又跑了13项受影响测试，全部通过。
- 9项真实浏览器场景、6项边界/录音场景通过；最终三尺寸截图无横向溢出、卡片裁切或视频标题重叠。最后媒体宽度960，只有一个有源播放器。
- 高德在沙箱内曾收到 `ERR_NETWORK_ACCESS_DENIED`；获得权限后在沙箱外复验，SDK加载、手动起点、到第九教学楼的127米/约2分钟/3段路线成功。导航没有启动配片。见 [联网导航与兼容性](navigation-compatibility.json)。
- `?avatar=live2d` 的 Cubism core 与画布存在，页面无脚本错误，忽略入库的 vendor 文件保留。此项是基础兼容检查，不代表所有 Live2D 动作均复测。
- `git diff --check` 通过。只重启 managed-processes 收据中属于本项目的进程，当前8000服务加载当前源码/构建，8010为本地ASR。

最终截图（`before-*` 为修复前，`iteration-*` 为过程稿，其余无 final 前缀的图片来自中途场景测试）：

- [桌面资料卡1440](final-card-1440.png) / [笔记本资料卡1366](final-card-1366.png) / [手机资料卡390](final-card-390.png)
- [桌面讲解全页](final-playing-1440.png) / [笔记本讲解全页](final-playing-1366.png) / [手机讲解全页](final-playing-390.png)
- [手掌托举近景](final-presentation-1440.png) / [手机相邻面板](final-presentation-390.png) / [无配片回退](missing-media-fallback.png)

## 立即操作

1. 用 Google Chrome 打开 http://127.0.0.1:8000 。已打开旧页面时刷新。
2. 选择北洋园校区 → 郑东图书馆：先看到资料卡，不自动播音。
3. 点击“开始讲解”，或打开“和海小棠聊聊”输入“介绍一下郑东图书馆”“介绍一下这里”。语音开始时出现静音照片导览片，桌面人物托举，手机相邻展示。
4. 点同一入口暂停/继续，或输入“暂停”“继续”“停止讲解”“换一个地方”。暂停时视频停住，恢复保持进度；换点停止旧音频和视频。
5. 点击麦克风说“介绍一下这里”，停止录音，确认识别文字后发送。自动发送仍遵循既有用户设置。
6. 选择大通学生活动中心开始讲解，检查照片回退；仅选点、问地址或请求导航，不会自动播放介绍视频。

剩余具体缺口：自己的正式实拍讲解视频；真人麦克风与扬声器环境的识别、打断及回声验收；外部视频冷启动性能。本轮不将照片导览片或合成音频测试冒充上述完成项。
