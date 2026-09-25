# 第三方来源与许可记录

本项目不导入 OLV/AIRI 完整应用。安装解析以 `package-lock.json` 和 `uv.lock` 为准，直接依赖的许可证清单及原文位于 `docs/DEPENDENCY_LICENSES.json` 和 `docs/licenses/`。本文不是给第三方资产重新授权。

## 实际直接依赖

- React/React DOM、Vite及React插件、TypeScript、PixiJS：保留安装包许可证。
- pixi-live2d-display 0.4.0（Guan，MIT），入口pixi-live2d-display/cubism4；所用PixiJS 6.5.10。MIT不覆盖Cubism Core。
- @ricky0123/vad-web 0.0.31：ISC；Silero ONNX模型另为MIT，onnxruntime-web另按其许可证。仅活动检测，不能声称这是ASR。
- FastAPI、Uvicorn、Pydantic/Pydantic Settings、HTTPX、OpenAI Python SDK、LangGraph按安装包许可证；SDK只用于指定GLM/独立ASR服务适配，不改变供应商。
- edge-tts 7.2.8：LGPL-3.0，作为未修改的独立Python依赖保留原许可与源码链接：https://github.com/rany2/edge-tts 。M0未打包独立可执行文件或修改该库；后续分发应保留适用材料。
- LangGraph 1.2.11：MIT；直接运行固定 intent→retrieval→answer→scene_action 工作流，未开启 LangSmith 追踪。

## 独立运行时与素材（本机复制，不进入Git）

Cubism Core取自已审查的上游固定提交，未复制该仓库UI代码：
https://github.com/Open-LLM-VTuber/Open-LLM-VTuber-Web/blob/d176e7df2366952e3bacbf12cf9a8b18a4315932/src/renderer/WebSDK/Core/live2dcubismcore.min.js

SHA256：942783587666a3a1bddea93afd349e26f798ed19dcd7a52449d0ae3322fcff7c。
Core 保留原版权头，属于 Live2D 专有条款，不能统一标 MIT。相关运行资源只在有权使用的本机环境中准备。

kelaita源目录：
C:\Users\ASUS\Desktop\desktop-pet\Open-LLM-VTuber\live2d-models\kelaita
由用户选定，仅复制必要素材文件及 README。原角色为鸣潮珂莱塔/BongoCat 风格，作为本产品首版展示角色；不冒称原创素材。保留 README、水印、文件相对引用；不复制整个桌宠，不运行其程序。未核验人物再分发/商用权利，不导入本地克隆音色。

本机归档在 `.runtime/asset-source`，运行素材复制到 `frontend/public/assets/kelaita` 及 `frontend/public/vendor`，均被 Git 忽略。素材可替换，不成为 LLM 或知识模块依赖。人物/Core 原文件保持忽略，未部署云应用。

## 审查但未采用源码

OLV 后端 MIT、OLV-Web 附加条件许可、AIRI MIT、TalkingHead MIT、three-vrm MIT、FastAPI 模板 MIT。其 README/源码只读审查不计作本项目实际源码复用，不将各自 MIT 覆盖到第三方模型或 SDK。

## R2新增直接依赖

eventsource-parser 4.1.0（MIT）：M的frontend/src/transport/r2.ts导出createParser给A做真实SSE消费；许可证快照见docs/licenses/eventsource-parser/LICENSE。R2的frontend/src/ui/r2-model.ts实际消费该解析器，正文/终态实现已合并；真实浏览器渲染另待验。
@amap/amap-jsapi-loader 1.0.1：发布包package.json声明MIT，已安装供A按需加载JSAPI2.0及Geolocation插件；发布包没有单独LICENSE文本，保存PACKAGE_METADATA.json并记录此缺口，不能将其MIT元数据扩大为高德在线服务/底图/厂商POI许可。在线平台条款和来源限制单独适用。
# 联网检索增补

- DDGS 9.11.4：公开搜索聚合组件，MIT，https://github.com/deedy5/ddgs 。
- lxml 6.1.3：网页 HTML 文本解析，BSD，https://lxml.de/ 。其底层库及传递依赖仍适用各自许可证。
- 搜索所得网页的内容权利属于原站点；应用短时保留检索摘要和有限正文摘录，显示原始链接，不把搜索结果作为项目授权素材。
