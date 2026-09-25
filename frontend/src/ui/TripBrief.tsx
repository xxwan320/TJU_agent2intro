import {useEffect,useState} from 'react';
import type {TourSession} from '../../../shared/r3';
import type {RouteResponse} from '../../../shared/r2';
type Brief={status:string;items:{text:string;publishedAt:string|null;source:{title:string;url:string}}[];pending:string[]};
export function TripBrief({session,route}:{session:TourSession;route:RouteResponse|null}){
 const [brief,setBrief]=useState<Brief|null>(null);
 useEffect(()=>{const abort=new AbortController();setBrief(null);void fetch('/api/campus/trip-brief',{method:'POST',signal:abort.signal,headers:{'content-type':'application/json'},body:JSON.stringify({campusId:session.plan.campus_id,stopIds:session.plan.stops.map(s=>s.poi_id),asOf:session.plan.request.visit_date})}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(v=>{if(!abort.signal.aborted)setBrief(v);}).catch(()=>{});return()=>abort.abort();},[session.tour_id,session.plan.version]);
 const stay=session.plan.stops.reduce((n,s)=>n+s.visit_minutes,0);
 const warnings=[...new Set((session.plan.warnings??[]).filter(w=>!w.startsWith('路线：')&&!w.startsWith('资料：入口')))];
 return <section className="tour-warnings" aria-label="出发前提示"><h3>出发前，确认一下</h3>
 <p>这次可以围绕{session.plan.request.interests.join('、')}参观，留意{session.plan.stops.slice(0,2).map(s=>s.title).join('与')}的建筑和校园环境。停留时长是规划建议。</p>
 <p>{route?`地图已显示实际步行线路：${Math.round(route.distance_m)}米${route.duration_s==null?'':`，约${Math.ceil(route.duration_s/60)}分钟`}。`:'正在按行程起点与站点同步高德步行线路；如定位或匹配失败，地图下方会显示原因。'}建议停留 {stay} 分钟。{route?.duration_s!=null?`步行与停留合计约 ${stay+Math.ceil(route.duration_s/60)} 分钟（不含临时等待）${stay+Math.ceil(route.duration_s/60)>session.plan.request.duration_minutes?'，已超过可用时间，请缩短行程':''}。`:'步行耗时未齐全，暂不能判断是否满足时间预算。'}</p>
 {brief?.items.slice(0,3).map(item=><p key={item.source.url}>{item.text}<br/><small>{item.publishedAt??'一般指南，发布日期未载明'} · <a href={item.source.url} target="_blank" rel="noreferrer">{item.source.title}</a></small></p>)}
 <p>入馆与入校规则需分别确认；已收录消息不代表当天开放。</p>
 {warnings.map(w=><p key={w}>{w}</p>)}
 </section>;
}
