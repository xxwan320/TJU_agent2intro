# R3 M0 基线（2026-09-15）

## 结论与边界

本轮只做 M0：冻结、公共装配、隔离夹具、原树同步与环境核验。R3_READY 表示四窗开发条件满足，不表示行程、ASR、口型或比赛验收通过。发布凭据是主目录 `.runtime/R3/parallel-state.json` 的 status=R3_READY；四树的 `.runtime/BASE_COMMIT_R3` 必须同值。

当前代码及较新实测优先。已阅读 AGENTS、原提示词包0—2节、OPEN_SOURCE_DECISION、原 CONTRACTS/OWNERSHIP/PARALLEL_RUN、R2五份准备文档、README、WEB_SEARCH_AND_MAPS、WEB_SEARCH_VALIDATION、R2 FINAL_REPORT 和审核规则。原 `docs/ACCEPTANCE_MATRIX.md` 实际不存在，记录缺件，沿用 R2 矩阵作为历史参照，本轮新建独立矩阵。

## 起始现场（修改前）

|窗口|实际路径|起始分支|起始完整 HEAD|现场/合入关系|
|---|---|---|---|---|
|M|E:\AI4TJU|fix/ip-route-autoplanning|4e488899ecd505f44954930026fdc7abb9821c96|干净，本轮代码起点|
|A|E:\AI4TJU\.worktrees\ui|work/ui|442e32d0250a31699043e13d14074ffe25baf224|干净，HEAD是M起点祖先|
|B|E:\AI4TJU\.worktrees\avatar|work/avatar|610cfc0bd63d86e5fdf56d86176a65d743979ae8|干净，HEAD是M起点祖先|
|C|E:\AI4TJU\.worktrees\api|work/api|91f9ab5e1ae1609343bc5067c5dc6518185a27ee|干净，HEAD是M起点祖先|
|D|E:\AI4TJU\.worktrees\knowledge|work/knowledge|fc836256e3ce17003e2853b4b5c42d9a361a9ea4|干净，HEAD是M起点祖先|

本地 `integration/m0` 仍在95840d4，旧 `integration/r2` 仍在48ebbd1；均不拿来覆盖较新代码。M 本轮新分支 `prepare/r3-m0` 从4e48889创建，保留原分支。没有 reset/clean/stash、没有覆盖未提交修改、没有远端推送或合并受保护分支。

## 发布后的唯一共同基线

共同基线为不可移动标签 `r3-launch` 指向的完整提交，包含本文、共享代码、检查脚本。提交不能包含自身哈希，故用标签和外部本机回执，不循环改号。

```powershell
git rev-parse refs/tags/r3-launch
Get-Content .runtime/R3/parallel-state.json
```

四个原树通过 `scripts/Prepare-R3.ps1` 全量预检后 `merge --ff-only` 到这一提交。如果预检后有人开始修改，脚本再次检查并停止；已快进的树不回滚。不安全时保留现场，另建 `.worktrees/r3-<窗口>` / `work/r3-<窗口>` 从同一标签起步，再由原作者确认迁移独有提交；本轮未需此备选。

## 现有能力（不同证据层分开）

|能力|本轮核对结果|证据层/限制|
|---|---|---|
|应用|127.0.0.1:8000，PID36056；其他已分配业务端口当时空闲|只读HTTP，未重启现有体验进程|
|模型|health configured=true / verified=true|当前进程已成功标记；M0未新增真实模型调用|
|语音|ASR=false；当前进程tts=false|此前四种音色真实合成记录仍有效；不代表本次播放或识别通过|
|地图配置|JS key/security配置均true；REST key=false|/api/maps/status；在线/精准定位/应用内路线状态均UNVERIFIED，不打印配置值|
|地图链路|同源JS安全代理、目的地匹配、IP粗略起点、应用内步行、外部导航均保留|4e48889代码；WEB_SEARCH_VALIDATION的2026-09-15生产navigate实测4888米/3910秒/19步，仅IP区域中心路线|
|知识|106 POI（卫津路50/北洋园56），201原子事实，15来源页，208 documents|knowledge.get_status/get_coverage，版本sha256:a5e0678c385d；documents不等同原子事实|
|坐标/媒体|verified_coordinates=0，两校区usable_media=0|不能因高德匹配成功改成本地资料已核验|
|人物|现有kelaita/Live2D；lip_sync=none|基础音频驱动嘴形归B本轮实现，现阶段不冒称已有|
|浏览器现场|仍待本轮真实点击、定位授权、可听播放、移动端和刷新恢复验收|M0隔离回归与API不能替代现场|

## 环境

四树 `node_modules/.venv/.tools/.runtime` 均为独立普通目录，未发现可写链接或树内.env。npm锁相同；原树Python锁比主目录旧（近期DDGS/lxml及传递依赖），准备脚本按当前 `uv.lock` 冻结同步，默认离线缓存+copy，不复制主目录venv。新增R3零业务依赖、零锁变更。

主目录及每树分别验证导入、R3契约、TS类型、生成文件一致性；主目录再运行完整现有回归与构建。结果见 [VERIFICATION.md](VERIFICATION.md) 及忽略目录回执。检查不加载根.env、不产生模型/地图调用。

## 外部依赖

- 独立ASR服务与真实麦克风权限（B）；缺失时ASR项BLOCKED，文字主线继续。
- D的核心3—5站当前服务/开放时间/入口/门禁依据、歧义别名、授权实景；缺数据时草稿或明确未知，不能强行宣称可行。
- 浏览器与校内设备定位/扬声器/移动端现场证据（A/B/M）；IP粗略位置不代替。
- 模型网关和高德网络可用性由M/C显式授权配置后做有限样本验证；根.env不复制，A/B/D不读取。
- 正式比赛规则未提供，不编造评分权重、Token单价或强制技术要求。
### 准备脚本协调

初次候选标签r3-baseline=c78b8114e09eec0252089a84e0a56e855a787371保持不动。首次同步A树时uv实际安装成功，但Windows PowerShell的Start-Process后单独WaitForExit未可靠读取ExitCode，脚本保守中止，没有发布READY。改为Start-Process -Wait -PassThru并实际复核退出码0。最终四窗共同启动基线改用不可移动r3-launch标签，BASE_COMMIT_R3记录该最终启动号；所有窗口从同一个最终号开始，不把候选号混作本轮启动号。