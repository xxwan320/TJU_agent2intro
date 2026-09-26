# 3D 导览模型发布准备

本文件记录发布决策和固定来源。当前已验证的融合示例采用 DA3-SMALL 联合相机/深度估计和 CPU TSDF 单表面融合；文字示例采用 GLM 与 Shap-E。最终代码、README交接与浏览器12/12验收证据已同步；下列内容是本次发布的来源快照。

## 产品用途与选择依据

建筑模型用于识别校园地标、理解位置和辅助导览。检查可辨认的主体、主要体块和外观线索；不要求照片级写实，也不把单图推断的隐藏面当作实测几何。地图锚点、参考尺寸与照片模型分别记录依据。路线继续使用原地图服务，不从生成网格推断可通行区域。

GLM 负责根据真实工具结果规划，视觉模型读取输入图片，图像生成模型产出几何。模型数量本身不是质量证据；同一输入的实际效果、耗时、显存和失败记录决定最终选择。

| 组件 | 发布定位 | 当前决定 |
| --- | --- | --- |
| DA3-SMALL + TSDF | 当前已实测的多图融合提供器 | 真实双视图生成统一观测表面；只声明相对尺度及照片覆盖范围 |
| Hunyuan3D-2 / 2mini | 可选单图建模候选 | 保留适配和固定下载来源；本轮融合示例不依赖该权重 |
| TripoSR | 对比基线与可选提供器 | 保留实现，不因历史已安装而必须默认启用 |
| SmolVLM-256M-Instruct | 实际图片描述与预处理建议 | 描述可见内容，不认证隐藏几何、建筑身份或绝对尺寸 |
| Shap-E + CLIP | 可选文字概念模型 | 保留用户明确请求的文字生成能力；不能替代失败的照片重建 |
| U2-Net | 可选去背景 | 是否使用由输入主体完整性和实际预处理结果决定 |

旧资产目录包含119份GLB、110个不同文件哈希。默认校园示例只应选择最终审查通过且与建筑输入对应的产物。旧重复、失败或未审查资产可保留在历史记录中，不作为默认导航成果展示。

## 固定来源

| 组件 | 官方来源 | 固定版本 |
| --- | --- | --- |
| Depth Anything 3 源码 | https://github.com/ByteDance-Seed/Depth-Anything-3 | `3d835ec1a5802d64a8b8b15f817a1ab54809bfe4` |
| DA3-SMALL 权重 | https://huggingface.co/depth-anything/DA3-SMALL | `e08cab65ca0ec38e7826075418411ab90cab4da3` |
| Hunyuan3D 源码 | https://github.com/Tencent-Hunyuan/Hunyuan3D-2 | `f8db63096c8282cb27354314d896feba5ba6ff8a` |
| Hunyuan3D-2mini 权重 | https://huggingface.co/tencent/Hunyuan3D-2mini | `f90a0f7df7d5e6f71109cf333f6a95a0ae3194a6` |
| Hunyuan3D-2 权重 | https://huggingface.co/tencent/Hunyuan3D-2 | `9cd649ba6913f7a852e3286bad86bfa9a2d83dcf` |
| TripoSR 源码 | https://github.com/VAST-AI-Research/TripoSR | `107cefdc244c39106fa830359024f6a2f1c78871` |
| TripoSR 权重 | https://huggingface.co/stabilityai/TripoSR | `5b521936b01fbe1890f6f9baed0254ab6351c04a` |
| SmolVLM 权重 | https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct | `7e3e67edbbed1bf9888184d9df282b700a323964` |
| Shap-E 源码 | https://github.com/openai/shap-e | `50131012ee11c9d2617f3886c10f000d3c7a3b43` |
| CLIP 源码 | https://github.com/openai/CLIP | `d05afc436d78f1c48dc0dbf8e5980a9d471f35f6` |

Hunyuan mini主权重：3,819,958,234字节，SHA-256 `3cc66f3bea33e4062b7dbc875ffe1d70c4888914aec3e91b60f94e9bd01b522b`。

Hunyuan完整模型主权重：4,928,151,562字节，SHA-256 `360bc281fc956d4acac0c3d36d5ec0ebf8cdddbf4b8892e894d12419388d479b`。

其余既有权重的字节数和SHA-256在 `models/MANIFEST.json`。来源、版本与哈希共同用于校验；只检查文件存在不能证明权重已下载。

DA3-SMALL 主权重：137,248,940 字节，SHA-256 `364492e38a3a06d221ac75da7f6621ada3f2361cd24fde11ba79091e9f40efcf`。公开融合示例GLB：SHA-256 `d7e73bcc0e0c2a3b15bff7e60b855c65ed8f7547c2445f39fdd4d7975aacc16f`，977,796 字节。其审核范围为可辨认的已观测表面，不能据此声称全楼测绘或未知面的真实形状。

## 下载与仓库内容

新的Hunyuan权重通过固定版本的官方地址下载，不把 `.reconstruction-hunyuan/` 环境、分块缓存或虚拟环境提交到仓库。发布适配器、安装脚本、来源锁定信息及必要许可材料即可。现有约5.48GB的LFS权重历史不在本次准备阶段改写。

GitHub Free/Pro目前的LFS单文件上限为2GB，Team为4GB，Enterprise Cloud为5GB。Hunyuan mini和完整主权重均超过Free/Pro上限；仓库计划和剩余LFS额度未经本次确认，不能承诺全量权重推送成功。[GitHub官方说明](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)

Shap-E相关权重合计约3.10GB，按需获取可保留文字概念能力并避免所有使用者默认下载。TripoSR与SmolVLM等既有LFS文件也应按选用提供器拉取，不把跳过LFS下载后留下的指针文件当成可加载模型。

对应安装入口在最终同步后统一确认：

- `scripts/install-reconstruction.py`：现有基础重建环境和TripoSR。
- `scripts/install-reconstruction-extras.py`：现有可选文字生成与图像描述依赖。
- `scripts/install-reconstruction-hunyuan.py`：Hunyuan mini；`--full`选择完整模型。
- Hunyuan 单图 GLB 将输入照片烘焙为嵌入式 UV 纹理，只给相机可见面贴图；未观测面保留中性灰。纹理提升不代表几何更准确，多角度输入仍是覆盖不同立面的必要条件。
- Hunyuan 安装器仅在源码、依赖与权重全部就绪后写入本地 `ready.json`，用于显示可选提供器；安装完成不代表某个输入的模型质量已经通过审核。单图自动默认仍为 TripoSR。
- `scripts/install-reconstruction-da3.py`：固定 DA3-SMALL 源码及权重，独立环境；复用已安装的基础重建依赖，不更改 Web 环境。安装本身不等于通过真实推理或自动创建质量验收记录。

准备阶段不执行这些下载或安装入口。最终发布前需要核对可选组件分离及LFS指针检测，避免仅为使用视觉描述而被迫下载Shap-E，也避免仅凭占位指针创建ready记录。

发布前只读 LFS 核查：2026-09-26 对基线分支执行 `git lfs push --dry-run origin release/3d-navigation-20260926` 成功且未列出待上传对象。本轮不新增模型权重，仅新增小型公开GLB与证据文件；最终提交后应再次 dry-run。旧 TripoSR/SmolVLM 安装入口存在只凭文件存在接受 LFS 指针的风险；在其修复前，新克隆需要显式拉取选定权重并核对哈希。此次静态示例浏览不需要安装或加载这些权重。

## 许可与通知

锁定的 DA3 源码 LICENSE 和 DA3-SMALL 权重模型卡均声明 Apache-2.0；保留来源及上游通知。官方示例照片作为重建输入的来源应随公开证据保留，模型权重的协议不自动替代照片本身的权利说明。

TripoSR和SmolVLM的既有来源记录分别声明MIT与Apache-2.0；发行时保留对应上游协议、版权和来源。Shap-E代码仓库使用MIT，官方模型卡同时建议避免商业用途；应保留模型卡说明，不能仅凭代码协议扩展对权重用途的承诺。[Shap-E官方模型卡](https://github.com/openai/shap-e/blob/main/model-card.md)

Hunyuan使用腾讯社区协议，包含地域、分发、使用与通知条件。发布使用它的产品应包含适用协议与NOTICE，标注修改及实际服务提供者，不暗示腾讯赞助或背书；不能将其标为MIT或默认认为可无条件全球再分发。采用官方权重下载入口仍需遵守适用条款。[锁定版本Hunyuan协议](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/f8db63096c8282cb27354314d896feba5ba6ff8a/LICENSE)

## 最终同步待办

1. 从根工作树导入最终通过验证的代码与明确的新文件，不导入旧publish工作树的未提交清理。
2. 保持当前多图默认 DA3-SMALL + TSDF 与可选单图提供器边界，避免把实验单图产物当作融合结果。
3. 更新公开资产manifest，记录选择的GLB、输入、提供器和审核范围；保留尺度与隐藏面限制。
4. 验证安装脚本对缺失权重、LFS指针及下载校验失败的处理。
5. 重新读取目标远端HEAD，保留新增上游历史，然后以普通推送更新 `fix/ip-route-autoplanning`。
