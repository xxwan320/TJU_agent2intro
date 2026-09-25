# 按用户图片建模及Agent要求重新验收

结论：未完成。基础Harness部分完成；图片生成3D、已有图片建筑还原、地图三维布局没有实现。旧关闭报告仅覆盖A/B限定范围，不能作为这些功能的交付证明。本次检查没有安装3D依赖、生成模型或修改产品代码。

## 直接证据
- 后端ALLOWED仅有device_capabilities, device_open_app, device_pick_document, device_share, document_read, itinerary_export, knowledge_search, narration_control, official_search, poi_select, route_plan, speech_input, weather_query，没有image_to_3d / reconstruction / scene_focus / scene_layout工具。
- App.tsx submitTourText 主要按关键词分流。介绍、控制、单点导航和导出可直接返回；复合请求不能仅凭存在Harness类就认定完整处理。
- 模型相关工具子集没有itinerary_export：该工具仅从按钮或直接导出分支使用；模型无法把它加入复合计划。
- 上轮唯一有真实模型调用的任务：[{"runId": "37b016cb-8e7c-46a1-bf27-6b7992f1340f", "modelCalls": 2, "toolCalls": 1, "tools": ["document_read"]}]。2模型+1个document_read，不是跨工具依赖长链验收。
- 实际服务能力与PNG扩展探针见evidence.json。现有文件入口只接受TXT/Markdown，不接受用户建筑图片。
- 现有资产清单：91原始照片、2个角色VRM、0个校园建筑模型；代码没有建筑重建provider。Three.js/three-vrm依赖目前不能证明图片建模功能存在。
- pois.json共106条，非空location 0条。样本定位见evidence.json；已有地图运行时匹配不等于已有可复用的三维建筑坐标、朝向和真实尺度注册表。

## 完成标准需要改为
1. 图片入口：用户选JPG/PNG，或选择项目内经核对的郑东/大通原图；会话绑定、预览和地点归属明确。
2. 真实重建：固定版本的开源项目实际推理，保存输入hash、项目/权重版本、参数、耗时、失败和GLB产物；不能用照片平面或占位盒子冒充生成。
3. 质量：至少检查正面轮廓、主要体块/比例、开口和贴图；同建筑多图用于比对和条件允许的重建，不把批量单图推理叫多视角融合。背面/遮挡处为推断，允许换图/裁剪及尺度朝向调整。
4. 地图布局：真实匹配或用户确认地理点，显式坐标系转换，再设尺度和朝向。无地理标定只报告相对示意布局，不把旧地图像素当经纬度；图片生成本身不能提供可靠建筑高度。
5. Harness：复合意图不被早期单一分支吞掉；注册图片、生成任务提交/状态/取消、模型展示/场景布局工具；依赖顺序、部分失败和前端实际绘制回执可观察。
6. 长任务：生成作为独立有期限GPU作业运行，普通聊天45秒预算不变；submitted只代表排队，完成和可见分别验证，停止需取消GPU作业并阻止迟到展示。

## 应使用的验收指令（当前尚不支持完整执行）
- “用我上传的图片生成简单3D模型，尽量保留建筑外形，完成后展示并提供GLB下载。”
- “用已有的郑东图书馆和大通学生中心照片分别建模，按地图位置摆放，标出哪些尺寸是估计的。”
- “读取这份活动通知，找出集合地点，展示它的模型，在地图定位，最后导出安排。”
- “取消这次建模，保留已经生成的模型。”
每条必须同时有工具序列trace、真实输出文件、页面操作结果；不能仅看回答说完成。

## 本机开源候选核查
GPU：NVIDIA GeForce RTX 5060 Laptop GPU, 8151 MiB, 5299 MiB, 616.92。
TripoSR官方代码及权重MIT，默认约6GB显存，可作为本机单样本低成本基线候选；当前空闲显存不足6GB时不能保证默认配置能跑，需隔离环境与实际测试。建筑复杂度/背面质量不能预先保证。
Hunyuan3D-2.1官方标准形状/纹理要求更高，TRELLIS.2标准方案也不能直接当8GB机器已可运行。低显存社区方案须单独核查版本、许可、CUDA和真实质量，再决定是否采用。
官方来源：
- https://github.com/VAST-AI-Research/TripoSR
- https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1
- https://github.com/microsoft/TRELLIS.2

本次API探针零GLM、零TTS、零地图查询；未更换模型/网关，未改原图映射、未提交推送。
