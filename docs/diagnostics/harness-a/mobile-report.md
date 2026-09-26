# A3 Windows 浏览器功能执行器交接

2026-09-25，READY_FOR_INTEGRATION（仅代码和离线分支）。当前按用户最新要求优先 Windows 浏览器；手机真机后置。Windows 实际页面按钮、麦克风和系统分享验收：NOT_RUN。父代理报告 CUA 两次因 Windows 沙箱 TokenDefaultDacl1344 失败，真实 UI 验证受环境阻塞。

## 已复用与文件归属

- 复用 `shared/contracts.ts` 的 `SpeechAdapter`，生产实例已有 `frontend/src/speech/adapter.ts` 的 `CampusSpeechAdapter`。A 不创建实例、TTS、控制器或 GLM 请求。由 B 注入唯一已有实例并协调当前媒体会话。
- 新增 `frontend/src/device/a-device.ts`，导出 `createDeviceExecutor(options)`。B 维护共享 schema、transport、入口和 UI；本文件是结构化 v1 边界，不修改共享 schema。
- 新增 `tests/interaction/a-device.test.mjs`。无新增依赖、无锁文件修改。

## 接入

options.getSession 返回可信运行程序维护的 `{sessionId,campusId,channel,generation,deviceId,expiresAt,connected}`；不得直接取模型或未认证客户端自报字段。一个 executor 绑定一个页面设备生命周期。断线后调用 disconnect 并丢弃该实例，重连不回放动作；B 还须跨页面生命周期保留服务端幂等策略。

`list_capabilities(context)` 同步探测 API 存在及已注入服务，不调用 getUserMedia 或 Permissions.request，不自动刷新服务配置。动作能力最多 needs_permission：API 存在不等于已通过真机测试。speechAdapter.capabilities.asr 必须经原有服务链路初始化；未初始化返回 unavailable。

`execute_tool(request)` 接受 ToolRequest v1，工具名为 device_capabilities/device_pick_document/speech_input/device_share/device_open_app。设备动作必须有 idempotencyKey，返回 data.pendingAction（actionId/runId/toolCallId/expiresAt/label/kind）；原等待结束。pending 最长45秒且不超原请求和可信设备授权有效期。

`resume_tool(actionId, continuationRequest, event)` 在 B 展示的按钮原生可信 click/pointerup/keydown 回调中直接调用（React 可传 nativeEvent），不要先 await 网络请求再调用。续任务须使用新 toolCallId、deadlineAt/cancelToken，保留 runId/idempotencyKey/context/toolName；预算须由可信调度器产生。必须先由本 executor 执行 execute_tool 建立本地动作，不能将后端自建 actionId 直接当作本地 pending。执行器使用原快照 input，续任务不能换参数。B 需要展示完整待操作参数供用户了解。

`cancel_tool(runId,toolCallId)` 可用原任务或续任务 ID 取消；`disconnect()` 取消全部待操作。执行时有截止定时器并每50ms复核可信会话，异步回执再复核代际。浏览器原生分享面板无法强制关闭，取消仅中止等待与回执接纳；上传/应用注入回调必须遵守 AbortSignal。当前实例保留去重墓碑，不因取消/过期/断线删除。

ToolResult 顶层仅 schemaVersion/toolCallId/status/data/sources/error/observedAt/evidence；关联 runId/sessionId/channel/generation 位于 data；续任务另含 originalToolCallId。B 在更新唯一状态前仍须复核关联字段。

### 上传

options.upload(file,{request,signal}) 必须使用 A 后端受信发放的上传票据，回传 `{uploadId}`。真实 input[type=file] 只在可信动作后打开，仅选中 TXT/MD/Markdown 且不超过1MiB；用户取消不上传，不暴露本地路径。API：POST /api/harness/uploads，JSON `{uploadToken,filename,contentBase64}`；token 由可信调用 `provider.create_upload_ticket(context)` 发放。文件选择后的会话与预算再次检查。旧浏览器未派发 cancel 事件时由截止时间结束，不伪造 uploadId。

### 语音、分享、应用

普通话输入调用注入 SpeechAdapter.start，返回最终文本、recognitionElapsedMs，音频实际时长未知为 null。退出/取消后调用该实例 stop，不开另一套媒体队列。静音/未出最终文本会到期，不返回空成功。

分享只使用 navigator.share，返回 `{apiResolved:true,sent:false}`；API resolved 不证明送达。AbortError 为 cancelled，NotAllowedError 为 PERMISSION_DENIED。

options.apps 为可信 appId→执行回调白名单，默认空。回调返回 `{verified,observation,traceRef}`，只有 verified=true 且有观察和 trace 才完成；给 location 赋 URI、失焦或超时不能充当已打开应用的证据。未知映射 SOURCE_UNAVAILABLE。返回 navigated=false，不声称已导航。

## 验证记录

- PASS_OFFLINE：`node --test tests/interaction/a-device.test.mjs`，12/12（约538ms整套）。测试内浏览器、事件、上传和语音均为明确 fixture，不能当成设备通过。
- PASS_OFFLINE：Windows 无 Web Share API 返回 unavailable；实际项目 Python `Capability.model_validate`/`ToolResult.model_validate` 验证探针、待操作、成功、失败、取消全部回执。executionLocation=frontend，error 仅 code/message，generation 数字，与 B 严格模型一致。
- PASS_OFFLINE：`node_modules/.bin/tsc --noEmit -p tsconfig.json`，无错误。
- 覆盖：无权限探针、未知应用、错设备、可信续任务、重复幂等键、取消/断线墓碑、过期和旧代际、忽略 AbortSignal 的回调超时、执行时代际变化、应用无证据拒绝、分享已resolve仍未证实发送、取消分享、取消文件不上传、选中MD回传uploadId、拒绝麦克风、注入adapter最终转写。
- NOT_RUN：Android/iOS 真机普通话三句、拒权/静音、真实选文件/取消、真实系统分享/取消、应用缺失/成功唤起、页面控制器联动。未发现可由本任务接入的真机或原生壳；未新建原生App、GUI执行器。
- 无外部检索或模型调用；测试无实际上传、麦克风、分享或应用操作。未提交 commit。

冷/热真实设备计时均 NOT_RUN，因此不报告中位数/P95。

## B Windows 页面接线示例

以下为集成代码形状，变量由 B 可信会话/预算与唯一媒体控制器提供；未称已经接入主页面。

```ts
import {createDeviceExecutor} from '../device/a-device';
const executor = createDeviceExecutor({
  getSession: () => trustedDeviceSession,
  speechAdapter: existingSpeechAdapter,
  upload: uploadWithServerIssuedTicket,
  apps: verifiedWindowsAppExecutors, // 没有真实执行回执渠道时传 {}。
});
const pending = await executor.execute_tool(request);
// B 保存 pending.data.pendingAction，展示按钮并提前准备可信续任务预算。
// React onClick 回调内同步调用，不能先 await：
const receipt = await executor.resume_tool(actionId, continuationRequest, event.nativeEvent);
// B 再复核 receipt.data 的 runId/sessionId/channel/generation，记录续任务。
```

取消按钮调用 executor.cancel_tool(runId, toolCallId)；会话断开立即 executor.disconnect()。generation 由 B 数字代际统一维护。Windows 不支持系统分享 API 时，列表 unavailable；应用白名单为空时不暴露虚构成功的默认启动器。


