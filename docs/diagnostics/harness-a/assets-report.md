# A2 既有资产审计

状态：PASS_REAL（本地文件探测、全媒体解码、进程内真实资源路由）；浏览器绘制/3D 渲染 NOT_RUN。

## 初始状态与结果

```json
{
  "referencePhotos": 91,
  "runtimeBindings": 59,
  "runtimePhotoInstances": 104,
  "unreadableReferencePhotos": 0,
  "brokenRuntimePhotos": 0,
  "crossPoiPhotoInstances": 13,
  "videos": 1,
  "avatarModels": 2,
  "campusModels": 0,
  "activePois": 42,
  "activeMissingPhotos": 0,
  "originalsAndMappingsUnchanged": true
}
```

既有照片与映射均保留，前后 SHA-256 一致。所有照片执行 ffprobe 元数据探测和 ffmpeg 全解码，按哈希复用结果；未安装依赖。模型只校验 GLB 容器头、长度和资源服务，不代表渲染或几何准确性已验证。

## 前端与路由

- 照片映射：frontend/src/ui/tour-photos.ts；PHOTO_COUNTS 将 jpg 主图扩展为多图。缺图返回明确 SVG 占位，不计实景。
- Vite 直接服务 frontend/public；生产仅 AI4TJU_SERVE_FRONTEND=1 时 backend/app.py 挂载 dist/assets。每个照片映射分别检查 public、dist 和生产路由响应。
- 视频从 /api/knowledge/videos/file/{filename} 读取；郑东视频为 photo_film（照片导览片），不是实拍视频；前端要求响应 POI/校区一致。
- backend/model/tour_catalog.py 的 planning_pois 只保留 reference_photos 中存在命名图片的点。缺图地点可能仍在目录，但不能进入当前自动规划池。
- data/knowledge/media_manifest.json 的 usable_media 与 assets.json 的 media 仍为空；不能把这里的历史许可状态当作照片不存在。

## 首轮样本与限制

郑东图书馆、大通学生中心、尚贤石均有照片。尚贤石不能当缺图测试。
当前有效公开目录没有未绑定且无原图地点；不能伪造缺图 POI。缺图分支仅能以隔离测试夹具验证，不能宣称真实有效 POI 已覆盖。

## 既有跨点复用（未修改）

- weijinlu-09-teaching → weijinlu-25-teaching
- weijinlu-dorm-san → beiyangyuan-dorm-cheng
- weijinlu-gym → beiyangyuan-gym
- weijinlu-haitang → weijinlu-feng-jicai
- weijinlu-swimming → beiyangyuan-gym
- weijinlu-water-building → beiyangyuan-earthquake-facility
- weijinlu-xue-4-dining → beiyangyuan-xue-4-dining
- weijinlu-xue-5-dining → beiyangyuan-xue-5-dining

这些既有绑定不能作为当前点照片的可信证明，尤其跨校区复用。清单保留 crossPoiReuse 标记供 B 阻止错误展示；本次不更改映射。

## 模型

实际角色 VRM：2；校园建筑模型：0。角色不等于校园模型；未知 scale/upAxis/preview 为 null，geometryAccuracy=unknown。

## 计时

各 3 次新客户端/复用客户端 HTTP 原始耗时及中位数在清单中。OS 缓存未清空，不能声称真实冷盘/冷网络或浏览器绘制结果。不报告 P95。

## 复跑

```powershell
.\.venv\Scripts\python.exe -B scripts/audit-a-assets.py
```

脚本仅写 data/knowledge/a_asset_inventory.json 与本报告；外部调用为 0；无 commit。完整逐资产尺寸、哈希、许可、资源路由和缺图分支见清单。

## 验收边界

A06 文件读取/服务与原文件保留 PASS_REAL；真实当前有效缺图分支 NOT_RUN（有效目录无此样本）；既有跨点语义映射 FAIL，需 B 审查后阻止误配。A07 实际文件与 HTTP 可用状态 PASS_REAL；3D 浏览器渲染 NOT_RUN。

原图重复哈希分组：0；地图/媒体静态映射：2；完整记录在清单。

PoiProfile.tsx 在占位或加载失败时显示当前地点文字封面；GuidePresentation.tsx 隐藏失败照片；PhotoCarousel.tsx 按校区筛选已登记照片，失败时显示当前标题占位。没有借此证明跨点旧绑定正确。
