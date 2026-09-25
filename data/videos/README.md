# 点位讲解视频

将 MP4 / WebM 放在本目录，命名为 `<poi_id>-1.mp4`，例如
`weijinlu-09-teaching-1.mp4`。也兼容 `frontend/public/assets/campus/videos/`。
视频通过后端提供，不需要重新编译前端。

同一地点有多个视频时，可在 `manifest.json` 登记标题和关键词：

```json
[
  {
    "id": "weijinlu-09-building-v1",
    "poi_id": "weijinlu-09-teaching",
    "campus_id": "weijinlu",
    "file": "weijinlu-09-teaching-1.mp4",
    "title": "第九教学楼的建筑故事",
    "kind": "video",
    "poster": "/assets/campus/photos/weijinlu-09-teaching-1.jpg",
    "source": "填写素材实际来源和使用范围",
    "available": true,
    "keywords": ["建筑", "历史"],
    "description": "后台准备的讲解内容摘要"
  }
]
```

接口：`GET /api/knowledge/videos/search?campus_id=weijinlu&poi_id=weijinlu-09-teaching&query=建筑`。
先按校区和点位约束候选，再按标题／关键词匹配排序；无匹配返回 `video: null`。
不指定点位时允许通过唯一名称／别名查找；有歧义不自动选择。
这是本地资料检索，不需要 LLM、向量数据库或外部 API。
现有可演示素材：`beiyangyuan-zhengdong-library-1.mp4`，12 秒、960×540、H.264、静音。
它由项目内三张郑东图书馆真实照片制作，是**实景照片导览片，不是实拍视频**；前端也显示此区分。
原照片来源见 `data/reference_photos/manifest.csv`，沿用原素材的本机导览使用范围。
未取得可公开使用的官方实拍视频直链；官方视频门户需要登录，不绕过限制。
后续将自己的实拍素材放入本目录并更新索引即可替换；不要将一般校园宣传片标成具体建筑视频。

界面入口：选择北洋园校区 → 郑东图书馆 → 开始讲解；或者对海小棠说/输入“介绍一下郑东图书馆”。
仅选择地点不自动播放。配片预加载后由 TTS 的实际 `playing` 事件启动，默认静音；暂停/继续/停止共用同一讲解会话。
语音按句段推进字幕，片间切换不重载视频。12 秒短片循环至讲解结束后停帧；不是逐帧语义对齐。
无匹配时使用该点位照片或文字封面；资源失败和超过 8 秒缓冲也回退，不显示空黑播放器。
`available:false` 或索引中的错误校区记录不会被自动文件扫描重新启用。
媒体元数据及资料补充按点位、校区、主题/日期缓存 60 秒，同时进行的相同请求合并。
