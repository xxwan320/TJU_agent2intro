# 点位资料、视频展示与语音修复（2026-09-18）

基于 `fix/ip-route-autoplanning` 的 `7c0f14b`，更改尚未提交。

## 已实现

- 通过本地应用代理重新查询全部 106 个点位；44 个可匹配，两个校区各 22 个，62 个未匹配。此次没有服务错误后沿用旧状态的记录。更新 `map_searchability.json` 日期与候选数量，目录／下拉／规划池仍仅提供可匹配点位，原始资料保留。
- 目录去掉“资料已核验／待核验”。点击后展示地点照片、校区、类型、简介、别名，以及知识库中与该地点关联的文化历史资料。空的补充资料区域不显示。
- 对话不再输出 `no_evidence` 状态行和空的等待依据提示；来源和真实请求失败仍可查看。
- TTS 操作按 `(request_id, utterance_id)` 区分，支持前端预取下一语音段；停止请求取消其所有语音段。仍拒绝同一语音段的重复并发请求，并保持会话隔离。
- 视频通过后台本地文件与 manifest 检索。限定校区和地点后按标题／关键词选片；未选地点时仅接受唯一名称／别名匹配。支持 MP4、WebM，文件缺失不返回匹配，限制文件访问路径。用法见 [视频目录说明](../data/videos/README.md)。
- VRM 播报且有视频时抬起左臂、掌心向上，视频位置跟随动画手掌的屏幕投影并限制在视口内。展示视频时不触发双臂摊开，保留轻微侧头；没有视频时隐藏窗口。Live2D 代码和本地 vendor 文件保留。
- 普通话识别显式传 `language=zh`，VAD 阈值和短句时长降低，句间停顿放宽，首音缓冲增加；保留较严格的自动打断回声判断。
- 本地 ASR 默认使用 faster-whisper `turbo`，CPU/int8；推理在线程池执行，增加单次音频长度限制。后端配置指向本机 8010 时，`start-app.ps1` 自动启动识别服务并记录所属进程，`stop.ps1` 一起停止。

## 本机部署

本机 `.env` 已配置本地 ASR（三个变量），没有提交该文件。模型保存在 `.runtime/asr-models`，约 1.6 GB，不入库。本地应用地址为 `http://127.0.0.1:8000`。

其他机器安装可选依赖：

```powershell
.\.tools\Scripts\uv.exe pip install --python .venv/Scripts/python.exe -r scripts/requirements-asr.txt
```

配置：

```dotenv
CAMPUS_ASR_URL=http://127.0.0.1:8010/v1
CAMPUS_ASR_MODEL=whisper-turbo
CAMPUS_ASR_API_KEY=local-asr
```

首次启动需要下载模型。独立启动可运行 `scripts/Start-LocalAsr.ps1`。

参数依据：[faster-whisper 官方说明](https://github.com/SYSTRAN/faster-whisper)、[VAD 参数说明](https://docs.vad.ricky0123.com/user-guide/api/)。

## 验证记录与待验收

- 前端生产构建成功。
- 后端测试 120 项通过，含多段并发合成、重复段冲突、跨会话拒绝、停止全部段及视频候选隔离／缺失文件／路径限制。
- 前端、语音、导航、传输测试 59 项通过。
- 真实服务同一 request 下两段并发 TTS 均返回 200，音频分别为 14400、13680 字节。
- 本地 ASR 三条合成普通话测试音频均识别出语义和地点名，耗时约 4 秒／条；输出存在标点差异，三十被转写为 30。这是合成音频冒烟验证，不是用户麦克风、噪声环境或方言准确率测试。
- `/api/speech/asr` 完整链路成功识别“我想去第九教学楼，然后去图书馆”。运行后健康接口 ASR、TTS 均为 true。
- 未提供正式视频，当前检索返回 `video: null`，没有虚构校园视频。
- Chrome 控制连接返回 `Browser is not available: chrome`，桌面工具返回 native pipe 不可用。因此 Chrome 实际页面、模型托举姿态和视频加载的目视验收待浏览器连接恢复后完成。

接口实测结果保存在本机 `.runtime/guide-live-results.json` 和 `.runtime/asr-smoke-results.json`。
