# 下一轮可执行提示词：校园问答资料筛选与本地充分命中短路

在 E:\AI4TJU 执行一次最小范围修复。先读取适用 AGENTS.md、README、docs/diagnostics/20260917-150656/project_probe.md 和 probe_results.json，核实当前 Git 基线并保护用户改动；诊断基线为 fix/ip-route-autoplanning / c413c1c4493a6dc327477a83aba04f3eff742ff7。以下是下一轮任务，本轮诊断未实施。

问题：backend/model/service.py 的 CampusModelService._retrieval_stage 在本地命中后仍无条件等待 WebSearch.search；backend/knowledge/web_search.py 仅校验公开 URL、排序机构域名，没有主题、实体或校区相关性门槛。真实“北洋园的大通在哪里”收到无关成人/娱乐/社会新闻来源；“校区何时投入使用”本地已有 beiyangyuan-opened-2015，却等待联网失败 12015 ms。三次真实问答的首段有效回答为 16586.46、29624.16、22321.30 ms，完整回答为 16695.39、30273.34、23962.27 ms。小样本不能视为稳定性能基线。

目标：校园问答只注入与问题实体、校区和事实类型相符的资料；有充分本地依据的稳定事实直接走现有单次模型生成；缺资料、当日开放信息继续明确未核验。保留用户明确联网及普通聊天的联网需求。

最小修改范围：优先仅修改 backend/model/service.py 的 _retrieval_stage、_user_payload、必要时 _citations，以及 backend/knowledge/web_search.py 的 search_query / WebSearch.search；只读复用 backend/knowledge/service.py 的 search、resolve_entities 和现有来源字段。在 tests/model/test_web_answers.py 或独立定向测试中补回归。确有必要才扩展文件范围，并解释原因。不要改 UI、地图、语音、角色、依赖、锁文件、模型服务商、数据库或既有知识事实；不要新增向量库、爬虫或微调。

实现约束：
1. 用确定性本地规则判断“资料足够”，不能只凭 hits 非空、域名为 edu.cn 或出现“天津大学”就认定相关。已知历史事实与今天开放/门禁保证分开；同校区目录罗列不能充当具体问题的依据。
2. 无关网页应在正文抓取前尽可能过滤，并在模型上下文和 sources 输出前再次检查。官方但跨校区/跨主题的结果也要排除。禁止用额外 LLM 做分类或相关性评分。
3. 本地充分命中时不调用 DDGS；需要联网时保留有界等待、缓存和取消。被取消的检索不得晚到后继续调用模型、发旧 sources 或污染新请求。不能全局关闭联网来假装通过。
4. 保持 /api/chat 与 /api/chat/stream 请求/响应及 SSE 事件结构兼容，保留 request_id/session_id/campus_id、终态和取消语义；只输出本次实际使用且允许的来源。无依据回答不要因“全部返回检索结果”的 fallback 挂上无关参考。
5. 用现有 runtime.trace 记录本地充分命中跳过、检索候选数/接受数/拒绝理由、联网状态和阶段耗时；不记录密钥、请求头、用户坐标或完整私密会话。应用调用数与供应商重试数分开标注。

验收：
- 固定组1问题，注入会抛异常的 fake WebSearch，仍引用 beiyangyuan-opened-2015 回答2015年9月，断言联网调用0、模型调用1；不依赖真实网络。
- 回放 chat_2.json 的相关/无关候选，用脱敏夹具断言无关来源不进入 _user_payload、retrieved/cited sources；相关“大通学生中心”仍保留或澄清，不能编造方位。
- 回放组3未知展厅，开放时间和票价保持未知；跨校区资料与泛校园网页不能证明展厅存在。补“官方域名但无关”“全部拒绝”“显式联网”“检索超时”和“取消后迟到”的回归。
- 对 SSE 断言 accepted/status 不算有效首答，sources/answer_delta/completed 与取消终态一致。定向测试通过后执行现有相关模型/知识回归；不要运行会安装依赖或启动整套 fixture 服务的总脚本。
- 如环境凭据可用，最多2次真实 LLM复验、0地图/ASR/TTS调用，每次≤60秒且包含重试；保存每次单调时钟原始测量。只能报告实测改善，不预设加速倍数；浏览器不可用时首字显示仍为null。

回退：保存本次补丁和修改前文件基线；失败时只撤销本任务自身修改，不使用 git reset --hard，不覆盖已有改动，不切分支、不提交。交付修改说明、定向测试证据、实际调用预算及仍未验证项。
