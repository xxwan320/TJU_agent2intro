/** Bounded read cache. Concurrent consumers share IO but cancel independently. */
export function cachedRead<T>(ttlMs=60000,limit=64){
  const cache=new Map<string,{at:number,value:T}>();
  const pending=new Map<string,{controller:AbortController,promise:Promise<T>,users:number}>();
  return (key:string,signal:AbortSignal|undefined,read:(signal:AbortSignal)=>Promise<T>):Promise<T>=>{
    if(signal?.aborted)return Promise.reject(signal.reason);
    const hit=cache.get(key);
    if(hit&&Date.now()-hit.at<ttlMs)return Promise.resolve(hit.value);
    let entry=pending.get(key);
    if(!entry){
      const controller=new AbortController();
      const created={controller,users:0,promise:null! as Promise<T>};
      created.promise=read(AbortSignal.any([controller.signal,AbortSignal.timeout(8000)])).then(value=>{
        if(!controller.signal.aborted){cache.set(key,{at:Date.now(),value});if(cache.size>limit)cache.delete(cache.keys().next().value!);}
        return value;
      }).finally(()=>{if(pending.get(key)===created)pending.delete(key);});
      entry=created;pending.set(key,entry);
    }
    const shared=entry;shared.users++;
    return new Promise<T>((resolve,reject)=>{
      let done=false;
      const finish=(fn:()=>void)=>{if(done)return;done=true;signal?.removeEventListener('abort',abort);if(--shared.users===0&&pending.get(key)===shared){pending.delete(key);shared.controller.abort();}fn();};
      const abort=()=>finish(()=>reject(signal?.reason));
      signal?.addEventListener('abort',abort,{once:true});
      shared.promise.then(value=>finish(()=>resolve(value)),error=>finish(()=>reject(error)));
    });
  };
}
