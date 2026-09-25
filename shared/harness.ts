import type {CampusId} from './contracts';
export type ToolContext={sessionId:string;campusId:CampusId;channel:string;generation:number;deviceId?:string|null;poiId?:string|null;[key:string]:unknown};
export type ToolRequest={schemaVersion:'1.0';runId:string;toolCallId:string;toolName:string;input:Record<string,unknown>;context:ToolContext;deadlineAt:string;cancelToken:string;idempotencyKey?:string};
export type ToolResult={toolCallId:string;status:'completed'|'pending_user_action'|'failed'|'cancelled';data:Record<string,any>|null;sources:Record<string,any>[];error:{code:string;message:string}|null;observedAt:string;evidence:Array<{type:string;observed:unknown;traceRef?:string|null}>};
export type HarnessEvent={type:string;runId:string;context:ToolContext;token?:string;request?:ToolRequest;result?:ToolResult;text?:string;code?:string};
