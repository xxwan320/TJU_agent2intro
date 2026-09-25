import {useEffect,useRef,useState} from 'react';
import type {AvatarAdapter} from '../../../shared/contracts';
import type {NarrationSnapshot} from './narration-session';

export function GuidePresentation({session,avatar,onPause,onResume,onStop}:{session:NarrationSnapshot;avatar:AvatarAdapter|null;onPause():void;onResume():void;onStop():void}){
  const hostRef=useRef<HTMLDivElement>(null);
  const [collapsed,setCollapsed]=useState(false),[expanded,setExpanded]=useState(false),[index,setIndex]=useState(0),[failedSources,setFailedSources]=useState<string[]>([]);
  const active=!['stopped','ended'].includes(session.status);
  const photos=session.photos.filter(photo=>!failedSources.includes(photo.src));
  const photo=photos.length?photos[index%photos.length]:null;
  useEffect(()=>{setIndex(0);setFailedSources([]);},[session.id]);
  useEffect(()=>{
    if(!active||collapsed)return;
    avatar?.setPresentationHost?.(hostRef.current);
    return()=>avatar?.setPresentationHost?.(null);
  },[avatar,session.id,active,collapsed]);
  useEffect(()=>{
    if(session.status!=='playing'||collapsed||photos.length<2)return;
    const timer=window.setInterval(()=>setIndex(value=>(value+1)%photos.length),4500);
    return()=>window.clearInterval(timer);
  },[session.id,session.status,collapsed,photos.length]);
  const step=(delta:number)=>setIndex(value=>(value+delta+photos.length)%photos.length);
  const title=({preparing:'正在准备讲解',buffering:'正在准备下一段',playing:'海小棠正在讲解',paused:'讲解已暂停',ended:'讲解结束',stopped:'讲解已停止',error:'声音暂未播放'})[session.status];
  return <section className={'guide-presentation'+(expanded?' expanded':'')+(!avatar?.setPresentationHost?' adjacent':'')} data-narration-id={session.id} data-narration-status={session.status} aria-label="地点讲解">
    <header><div><small>{title}</small><strong>{session.poi.name}</strong></div><button type="button" onClick={()=>setCollapsed(!collapsed)}>{collapsed?'展开画面':'收起画面'}</button></header>
    <div className="narration-stage" ref={hostRef} hidden={collapsed}>
      <div className="narration-visual">
        {photo&&!photo.placeholder?<img key={session.id+photo.src} src={photo.src} alt={`${session.poi.name}讲解图片 ${index%photos.length+1}`} onError={()=>setFailedSources(current=>current.includes(photo.src)?current:[...current,photo.src])}/>:<div className="place-cover"><span>海小棠 · 校园漫游</span><strong>{session.poi.name}</strong><small>地点资料</small></div>}
        {photos.length>1&&<><button type="button" className="media-arrow prev" aria-label="上一张讲解图片" onClick={()=>step(-1)}>‹</button><button type="button" className="media-arrow next" aria-label="下一张讲解图片" onClick={()=>step(1)}>›</button></>}
        <span className="media-caption">{!photo||photo.placeholder?'图文讲解':photos.length>1?`${index%photos.length+1} / ${photos.length} · 图片轮播`:'点位图片'}</span>
        <button className="media-expand" onClick={()=>setExpanded(!expanded)} aria-label={expanded?'还原画面':'放大画面'}>{expanded?'还原':'放大'}</button>
        {photos.length>1&&<div className="media-dots" aria-label="讲解图片选择">{photos.map((item,itemIndex)=><button type="button" key={item.src} className={itemIndex===index%photos.length?'active':''} aria-label={`第 ${itemIndex+1} 张`} onClick={()=>setIndex(itemIndex)}/>)}</div>}
      </div>
    </div>
    {session.caption&&<p className="narration-subtitle" aria-live="off">{session.caption}</p>}
    <div className="narration-controls">
      {['paused','error'].includes(session.status)?<button onClick={onResume}>继续讲解</button>:active&&<button onClick={onPause}>暂停讲解</button>}
      {active&&<button onClick={onStop}>停止讲解</button>}
      {!photos.length&&<span role="status">点位图片暂时无法显示，继续为你讲解。</span>}
      {session.error&&<span role="status">{session.error}</span>}
    </div>
  </section>;
}
