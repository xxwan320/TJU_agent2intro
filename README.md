# 海小棠校园导游

## 2026-09-26：3D Demo 与下一位 Agent 交接（优先阅读）

本节是本轮最新状态；下方 R2/R3 等日期记录属于历史验收，不能代替本节。远程交付分支为 `fix/ip-route-autoplanning`。

### 已完成与边界

- **双图融合 Demo**：启动后访问 <http://127.0.0.1:8000/?demo=fusion>。实际 DA3 联合相机/深度推理 + 置信加权 TSDF，成功场景为悉尼歌剧院；正式接口提交到产物 **9.25 秒**。
- **文字构思 / Agent Demo**：<http://127.0.0.1:8000/?demo=text>。实际 GLM 工具循环 + Shap-E 生成坡屋顶小屋，提交到产物 **55.79 秒**。输入框有浅灰示例，可填入后执行。
- 两个预生成 GLB、示例图片和证据随代码交付，打开已有 Demo 不需要重新运行建模权重。重新生成需要下面的推理环境；完整 Agent 仍需要在线 GLM 服务与个人凭据。
- 验收：后端 **202 passed**；真实浏览器 **12/12**，包括桌面/手机、示例填入、GLB 下载及哈希。详见[验收报告](docs/diagnostics/3d-agent-completion/20260926-strict/DEMO_REPORT.md)、[浏览器证据](docs/diagnostics/3d-agent-completion/20260926-strict/ui/fusion-demo-browser.json)。速度仅为本机 RTX 5060 Laptop 8GB 单次测量。
- 融合仅重建可观察表面，没有补造背面，也没有真实米制/正北校准；文字输出是概念模型。郑东图书馆实验存在错位，**未通过**。不承诺任意图片或完整建筑测绘成功。

### GitHub 与大文件约定

本次不新增上传模型权重、虚拟环境、缓存、密钥和私有会话。代码、安装/下载脚本、模型版本与校验信息保留。仓库历史已有 `models/weights` 的 LFS 管理内容，普通克隆可能只有指针，不能因为文件存在就认定权重完整。

GitHub 普通 Git 阻止超过 100 MiB 的文件；模型可另用 Git LFS 或独立下载渠道（[官方限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)）。如另行转交完整环境，应附权重、许可证、SHA256 清单、依赖安装包和重建脚本；不要直接依赖复制 Windows venv 的绝对路径。不要打包 `.env`、`.runtime` 内会话或访问令牌。当前未交付“全新电脑一键完全离线”安装包。

### 基础环境与启动

Windows PowerShell，Python **3.11**、Node **>=22.12.0**、Git；重新推理需要支持 CUDA 的 NVIDIA GPU 和匹配驱动。本机建模基础环境使用 PyTorch **2.7.1 / CUDA 12.8**、torchvision **0.22.1**。应用依赖由 `uv.lock`、`package-lock.json` 固定。

```powershell
git clone --branch fix/ip-route-autoplanning https://github.com/xxwan320/TJU_agent2intro.git
cd TJU_agent2intro
.\scripts\Install.ps1 -Python 'C:\实际路径\Python311\python.exe'
# 仅首次创建自己的配置，已有 .env 不要覆盖
Copy-Item .env.example .env
# 编辑 .env 后再启动
.\scripts\start-app.ps1 -Build
```

`.env.example` 中 `CAMPUS_LLM_URL`、`CAMPUS_LLM_MODEL`、`CAMPUS_LLM_API_KEY` 需配置为本人可用的 GLM 兼容服务，示例地址不保证对接收者开放。ASR、地图密钥按所用功能独立配置；不要把服务端密钥放进 `VITE_*`。人物/Core 受限素材仍需遵守 [第三方说明](THIRD_PARTY_NOTICES.md)，不会因复制本仓库获得额外授权。

### 模型来源、版本和大小

| 用途 | 官方来源 / 固定版本 | 本地位置 | 实际大小 |
|---|---|---|---:|
| 双图相机与深度 | [DA3-SMALL](https://huggingface.co/depth-anything/DA3-SMALL/tree/e08cab65ca0ec38e7826075418411ab90cab4da3)，revision `e08cab65ca0ec38e7826075418411ab90cab4da3` | `.reconstruction-da3/weights/model.safetensors` | 137,248,940 字节 |
| 文字扩散 | [Shap-E 官方源码](https://github.com/openai/shap-e/tree/50131012ee11c9d2617f3886c10f000d3c7a3b43)，commit `50131012ee11c9d2617f3886c10f000d3c7a3b43` | `.reconstruction/shap-e-weights/text_cond.pt` | 1,262,868,003 字节 |
| 网格解码 | 同上，下载地址与期望 SHA 取官方 `shap_e/models/download.py` | `.reconstruction/shap-e-weights/vector_decoder.pt` | 905,199,688 字节 |
| 文字编码 | [OpenAI CLIP](https://github.com/openai/CLIP/tree/d05afc436d78f1c48dc0dbf8e5980a9d471f35f6)，commit `d05afc436d78f1c48dc0dbf8e5980a9d471f35f6` | `.reconstruction/shap-e-weights/ViT-L-14.pt` | 932,768,134 字节 |

上述实际文件 SHA256 全部保存在 [model-download-manifest.json](docs/diagnostics/3d-agent-completion/20260926-strict/model-download-manifest.json)。DA3 权重 SHA256 为 `364492e38a3a06d221ac75da7f6621ada3f2361cd24fde11ba79091e9f40efcf`；DA3 源码固定提交 `3d835ec1a5802d64a8b8b15f817a1ab54809bfe4`。安装器保存 source-version.json、weights.json 等元数据；这些本地元数据不是实际推理通过证明。

### 下载与构建顺序（需要联网）

以下为仓库现有安装入口。基础安装器同时准备旧 TripoSR，extras 同时准备 SmolVLM；它们是安装脚本当前的耦合，不代表本轮两项 Demo 都调用了这些模型。

```powershell
.\.venv\Scripts\python.exe scripts/install-reconstruction.py
.\.venv\Scripts\python.exe scripts/install-reconstruction-extras.py
.\.venv\Scripts\python.exe scripts/install-reconstruction-extras.py --verify
```

DA3 安装器当前通过 `.pth` 复用 `.reconstruction` 与 `.reconstruction-hunyuan` 的 Python 包。若后者不存在，先只调用其依赖安装函数（不会下载 Hunyuan 权重），随后安装 DA3：

```powershell
.\.reconstruction\venv\Scripts\python.exe -c "import runpy; m=runpy.run_path('scripts/install-reconstruction-hunyuan.py'); m['HOME'].mkdir(exist_ok=True); m['dependencies']()"
.\.venv\Scripts\python.exe scripts/install-reconstruction-da3.py
.\.venv\Scripts\python.exe scripts/verify-reconstruction-da3.py
```

最后一步会真实运行官方 SOH 双图并校验结果后写入本机 `ready.json`，失败必须修复，不能手工伪造 ready。已有本机成功作业可以用 `--existing-job <作业目录>` 校验。新图片仍需独立质量审查；技术可运行不等于每个输入质量合格。

**新机交接风险：**上述现有环境已经实测，但完整全新电脑安装链尚未验收。旧 TripoSR/SmolVLM 安装器部分分支只检查文件存在，必须确认拿到实际权重而非 Git LFS 文本指针；可在有权限的情况下 `git lfs pull` 获取历史权重，或按安装脚本中的固定官方 revision 下载。各环境应使用同一 Python 3.11 ABI，移动目录后需重新建立 `.pth` 与环境。权重下载需 GitHub/Hugging Face/OpenAI 官方存储网络可达，安装成功后还必须执行实际推理验证。

### 下一位 Agent 的工作入口

1. 先读本节与验收报告，运行两个已有 Demo；保留当前通过的 GLB 与哈希，新增结果单独验收。
2. 后端编排：`backend/model/reconstruction_workflow.py`；任务/资产：`backend/reconstruction.py`；融合：`scripts/reconstruction_tsdf.py`；DA3 worker：`scripts/reconstruction-multiview-worker.py`；页面：`frontend` 内 reconstruction 组件。
3. 优先消除安装器对旧模型环境的耦合，补全真正的新机安装验收；不要为获取几个依赖下载 Hunyuan 大权重。旧 Hunyuan/DA2 试验不是已通过融合 Demo 的必需模型。
4. 扩展场景必须使用真实重叠照片、独立重投影和实际网格可视检查。不得把手工几何、照片平面、两个网格叠放或未执行的工具调用包装成融合成功。
5. 可复跑：`.\.venv\Scripts\python.exe -m pytest tests backend/tests -q -p no:cacheprovider`；浏览器验证入口 `scripts/verify-fusion-demo.mjs`（需要 playwright-core、本机 Google Chrome，并先启动 8000 服务；执行 `node scripts/verify-fusion-demo.mjs`）。

---

天津大学双校区数字人工作台，沿用 React/Vite、FastAPI、Live2D 和 LangGraph。校园导游名为海小棠；形象素材沿用用户指定的 kelaita（珂莱塔），素材来源只用于形象。

2026-09-17 功能更新：地点讲解显式开启/停止、选项式必去/避开、两站起行自动画真实路线、注册来源检索与缓存、出发前提示、短录音转写确认流程已接入。真实浏览器已验证音频播放事件和地图画线；真实 ASR 仍缺独立服务配置，人工听音待验。当前验收以 [本轮交付报告](docs/interaction/20260917-functional/REPORT.md) 为准（下方为历史记录）。[标准问题集](docs/evaluation/starter/questions.md) · [扩展40题](docs/evaluation/starter/cases.jsonl) · [来源注册表](docs/evaluation/starter/source_registry.json) · [检索政策](docs/evaluation/starter/retrieval_policy.json)。

2026-09-15 更新：应用内步行支持自动 IP 起点、过期位置更新和未核验目的地的高德匹配，同名候选选择后自动继续。已真实验证“无起点→IP→目的地匹配→步行”服务链路。保留自动联网问答、末尾参考资料及四种导览语音。配置、行为及限制见 [联网与地图说明](docs/WEB_SEARCH_AND_MAPS.md)，测试范围见 [验收记录](docs/WEB_SEARCH_VALIDATION.md)。下方 R2 部分保留此前验收记录，地图当前状态以本机 `/api/maps/status` 为准。

当前 **R2_PARTIAL / BROWSER_QA_PENDING**：三类内容生成、指定glm-5.1聊天/追问、真实日志和取消已通过后端实测；双校区知识、点位与历史相对示意图已集成。构建及前后端回归通过。中文TTS已合成有效音频，真实浏览器自动播报/人物渲染仍待现场验收。

## 本机启动
```powershell
cd E:\AI4TJU
.\scripts\stop.ps1
.\scripts\start-app.ps1 -Build
```
打开 **http://127.0.0.1:8000**。当前电脑已有依赖、角色素材和后端模型配置。新环境先按锁运行 `scripts/Install.ps1`；Git不含密钥及受限人物/Core素材。

[完整本地使用与测试步骤](docs/R2/LOCAL_TEST_GUIDE.md) · [独立验收报告](docs/R2/FINAL_REPORT.md) · [四窗口评审](docs/R2/REVIEW.md) · [返修台账](docs/R2/REWORK.md)

## 现在可以尝试
- 双校区目录、关键词/分类/分页、本地示意图与外部高德名称搜索。
- 校园问答、普通多轮聊天，以及讲解词/参观计划/社交文案三种独立生成。
- 真SSE正文、来源、日志、取消/重试；显式开启的简述、全文、选段语音控制。

尚缺：经核验地理坐标、足够的授权实景照片、ASR服务、真实听音与浏览器完整验收。高德本机JS配置已接入，SDK下载和IP安全代理已实测；在线地图渲染、设备定位与持续更新需要浏览器现场验收。无Key不阻塞文字/知识建设。2017示意图不代表当前道路或入口，角色不是3D/可捏脸模型。

## 开发和边界
`scripts/start-dev.ps1` 为5173/8000开发模式；`scripts/check-r2.ps1` 为统一离线回归。前端所有模型请求只走自有后端。根.env和运行日志忽略，不复制到工作树。原integration/m0和四个work分支保留，审核政策见[REVIEW_POLICY](docs/REVIEW_POLICY.md)。

[开源选型](docs/OPEN_SOURCE_DECISION.md) · [第三方使用与许可](THIRD_PARTY_NOTICES.md) · [后续比赛能力](docs/NEXT_PHASE.md)。成熟组件直接依赖与设计参考明确分开，角色/SDK授权不随代码许可证自动改变。

## R3 多窗口准备

R3首轮围绕60分钟参观的结构化行程、执行与多轮调整、中文语音往返和基础嘴形。当前仅M0共享准备，不表示业务已完成。五窗实际路径、共同基线和启动条件见 [R3基线](docs/R3/BASELINE.md) 与 [并行启动](docs/R3/PARALLEL_RUN.md)，接口见 [R3契约](docs/R3/CONTRACTS.md)，独立验收见 [矩阵](docs/R3/ACCEPTANCE_MATRIX.md)。保留当前高德同源JS代理、IP粗略起点、目的地匹配和应用内步行。统一离线检查：scripts/check-r3.ps1。
