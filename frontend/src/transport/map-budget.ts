// Counts application initiations, never vendor quota debits.
export type MapOperation = 'map_load'|'geolocation'|'poi_search'|'walking_route';
export type MapCounters = {initiated:number;completed:number;failed:number;cancelled:number;blocked:number};
export type MapLimits = Record<MapOperation,number>;
export const MAP_SMOKE_LIMITS:Readonly<MapLimits> = Object.freeze({map_load:1,geolocation:1,poi_search:0,walking_route:1});
export const MAP_DAILY_LIMITS:Readonly<MapLimits> = Object.freeze({map_load:100,geolocation:3000,poi_search:100,walking_route:200});
export interface CounterStorage {getItem(key:string):string|null;setItem(key:string,value:string):void}
const kinds:MapOperation[]=['map_load','geolocation','poi_search','walking_route'];
const empty=():Record<MapOperation,MapCounters>=>Object.fromEntries(kinds.map(k=>[k,{initiated:0,completed:0,failed:0,cancelled:0,blocked:0}])) as Record<MapOperation,MapCounters>;
export class MapCallError extends Error {
 code:string;
 constructor(code:string){super(code);this.name='MapCallError';this.code=code;}
}
export class MapBudget {
 private counters=empty();
 private active=new Set<string>();
 private seen=new Set<string>();
 private starts:Record<MapOperation,number[]>={map_load:[],geolocation:[],poi_search:[],walking_route:[]};
 private storage?:CounterStorage;
 private storageKey:string;
 private limits:MapLimits;
 private now:()=>number;
 constructor(options:{limits?:MapLimits;storage?:CounterStorage;scope?:string;now?:()=>number}={}){
  this.limits={...(options.limits??MAP_SMOKE_LIMITS)};
  for(const k of kinds)if(!Number.isInteger(this.limits[k])||this.limits[k]<0)throw new MapCallError('invalid_budget');
  this.storage=options.storage??(typeof window==='undefined'?undefined:window.localStorage); this.storageKey='ai4tju.map-budget.'+(options.scope??'r2-live-smoke-v1');this.now=options.now??Date.now;
  if(this.storage){
   const raw=this.storage.getItem(this.storageKey);
   if(raw){
    try {
     const saved=JSON.parse(raw);
     for(const k of kinds)for(const f of ['initiated','completed','failed','cancelled','blocked'] as const){
      if(!Number.isSafeInteger(saved[k]?.[f])||saved[k][f]<0)throw new Error();
      this.counters[k][f]=saved[k][f];
     }
    } catch {throw new MapCallError('budget_storage_invalid');}
   }
  }
 }
 snapshot(){return {origin:'frontend' as const,kind:'application_operations' as const,platform_quota_debit:null,counters:structuredClone(this.counters),limits:{...this.limits}};}
 async waitForSlot(kind:MapOperation,signal:AbortSignal):Promise<void>{
  // Queue locally before reservation; waiting/cancellation makes no provider call.
  for(;;){
   if(signal.aborted)throw new MapCallError('cancelled');
   const now=this.now(),recent=this.starts[kind].filter(t=>now-t<60000);
   const delay=this.active.size?100:Math.max(0,(recent.at(-1)??-Infinity)+5000-now,recent.length>=6?recent[0]+60000-now:0);
   if(delay<=0)return;
   await new Promise<void>((resolve,reject)=>{
    const abort=()=>{clearTimeout(timer);reject(new MapCallError('cancelled'));};
    const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},delay);
    signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
   });
  }
 }
 private save(){if(this.storage)try{this.storage.setItem(this.storageKey,JSON.stringify(this.counters));}catch{throw new MapCallError('budget_storage_unavailable');}}
 async run<T>(kind:MapOperation,operationId:string,userInitiated:boolean,signal:AbortSignal,invoke:()=>Promise<T>):Promise<T>{
  const key=kind+':'+operationId;
  const deny=(code:string):never=>{this.counters[kind].blocked++;this.save();throw new MapCallError(code);};
  if(!userInitiated)return deny('user_action_required');
  if(signal.aborted)throw new MapCallError('cancelled');
  if(this.seen.has(key))return deny('duplicate_operation');
  if(this.active.size)return deny('operation_in_progress');
  if(this.seen.size>=1000)return deny('operation_capacity');
  const t=this.now();this.starts[kind]=this.starts[kind].filter(x=>t-x<60000);
  const recent=this.starts[kind];
  if(recent.length>=6||(recent.length>0&&t-recent[recent.length-1]<5000))return deny('rate_limited');
  if(this.counters[kind].initiated>=this.limits[kind])return deny('test_budget_exhausted');
  // Persist reservation BEFORE touching SDK. Failed/cancelled requests never refund quota.
  this.counters[kind].initiated++;this.save();this.seen.add(key);this.active.add(key);recent.push(t);
  try {
   const value=await invoke();
   if(signal.aborted)throw new MapCallError('cancelled');
   this.counters[kind].completed++;return value;
  } catch(error) {
   if(signal.aborted||(error instanceof MapCallError&&error.code==='cancelled'))this.counters[kind].cancelled++;
   else this.counters[kind].failed++;
   throw error;
  } finally {this.active.delete(key);this.save();}
 }
}
