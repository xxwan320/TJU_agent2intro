# R3 M0 验证记录

日期：2026-09-15。M准备分支prepare/r3-m0；代码起点4e488899ecd505f44954930026fdc7abb9821c96。业务实现与现场验收仍按ACCEPTANCE_MATRIX的M1列执行。

## 已通过

|检查|结果|最窄边界|
|---|---|---|
|npm build + adapter build|PASS|TS类型和生产/适配器构建，不证明浏览器画面|
|原前端/地图/语音/传输回归|70 PASS|包括IP粗略起点、目标匹配、同源内部路线、取消/预算|
|Python完整隔离回归|84 PASS|77个既有用例+7个R3契约用例；无真实模型/地图请求|
|R3响应代次与取消|2 PASS|拒收旧请求/校区/session/plan/state；取消不自动重放POST|
|R3 schema/types --check|PASS|同一Pydantic源生成，TS与JSON未漂移|
|运行中旧服务OpenAPI与新app语义比较|27个原路径，0变化|展开schema引用后比较；新OpenAPI含共享输入/输出定义整理，不改变旧接口形状|
|独立fixture HTTP启动|PASS|临时8011进程，读取标头/状态、创建3站样例、MapPublicConfig验证；结束仅关闭自己的子进程|
|fixture隔离|PASS|生产501/无fixture标头、独立依赖注入、无provider调用；不是C业务可行性通过|
|本机秘密值扫描|297个候选/构建文件，0匹配|只扫描已配置的模型/ASR/安全密钥等敏感值，不输出值；不是对任意未来秘密的绝对保证|
|五工作区现场核对|PASS|起始均干净、四原HEAD均在主目录历史内，依赖目录无可写链接、树内无.env|
|发布后的四树同步/冻结依赖/类型/契约|以parallel-state.json为准|status=R3_READY且四树同SHA才代表最终通过|

主目录原始结果：`.runtime/r3-check-final.log`、`.runtime/r3-audit.json`。发布精确号与每树结果：`.runtime/R3/parallel-state.json`；每树日志在自己的.runtime/r3-*，不提交。

## 已修正的准备问题

新增传输测试最初错误引用项目未安装的esbuild，改为已有Vite后2项通过，未新增依赖或修改锁。样例生成脚本首次缺少项目导入路径，修正后所有样例经Pydantic验证。夹具MapStatus枚举按既有契约纠正，并经真实本地HTTP解析核验。

pytest有一条现有Starlette/anyio BlockingPortal弃用警告，不影响通过；本轮没有为消除提示升级依赖。

## 保留限制

本轮不新增模型/地图额度探针，不声称真实中文ASR、现场播放/嘴形、在线地图绘制、设备定位或完整60分钟导览通过。当前既有8000进程未重启，仍运行R3准备前的已启动版本；新R3端点由各树启动的新进程提供，M0默认返回501。无需关闭当前用户体验进程即可并行开发。

本轮只本地提交/标签和原work分支安全快进，不远端推送、不合并后续PR、不代做A/B/C/D业务。
同步脚本初次对A树出现退出码读取失败：uv日志已安装ddgs/lxml/primp，未伪报READY。使用Start-Process -Wait -PassThru复核退出码0；协调修复保留原候选标签，最终使用r3-launch。四树发布结果仍以最终parallel-state.json为准。