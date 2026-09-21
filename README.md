# TJU校园导游
天津大学双校区数字人工作台，沿用 React/Vite、FastAPI、Live2D 和 LangGraph。角色为用户指定的 kelaita（珂莱塔），素材来源只用于形象，产品是校园导游。

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
