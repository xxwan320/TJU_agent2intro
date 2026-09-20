# 校园数字人补充资料

由项目维护者在本机导入校园介绍、校史、建筑讲解、办事指南等资料。访客聊天界面保持原样，资料导入不占用聊天会话，也不向访客开放写入接口。

在 E:\AI4TJU 中运行：

```powershell
.\.venv\Scripts\python.exe -m backend.knowledge.import_campus --campus weijinlu "D:\校园资料\卫津路导览.md"
.\.venv\Scripts\python.exe -m backend.knowledge.import_campus --campus beiyangyuan "D:\校园资料\北洋园介绍.pdf"
```

支持 TXT、Markdown、CSV、TSV、JSON、HTML、DOCX 和可提取文字的 PDF，每文件不超过 12 MB，每校区最多 80 份。请保留资料正文中的原始出处、适用范围、发布日期及有效期；扫描 PDF 需先转成文字版。同一校区重复导入同内容会去重。

补充索引保存在 data/user_knowledge/index.json，原校园知识和地图数据不被改写。导入后下一次提问即可检索，无需重启；仅参与对应校区的回答。以前的会话私有资料不会自动公开。维护导入请串行运行。

本地原有资料与补充资料共同提供依据，联网检索仍按既有流程工作。资料导入时间不能证明当天仍有效。订阅库一小时 TTL，过半生命周期在提问时后台单飞刷新；已有内容立即返回，失败时保留旧内容并短暂退避。当前订阅采集仅发现登记官网中的公众号链接，不能保证覆盖公众号全文。

维基只读取可选的 data/live_knowledge/wiki.json 缓存并标识超过六小时的内容；本次没有新增维基自动抓取器。公众号链接、维基缓存和过期资料均不能单独确认今天的开放或预约规定。
