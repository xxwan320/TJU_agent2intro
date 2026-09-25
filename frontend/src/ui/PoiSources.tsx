import {useEffect,useState} from 'react';
import type {POI} from '../../../shared/r2';
import type {Source} from '../../../shared/contracts';
export function PoiSources({poi}:{poi:POI}){
 const [sources,setSources]=useState<Source[]>([]);
 useEffect(()=>{const abort=new AbortController();setSources([]);void fetch('/api/knowledge/search?'+new URLSearchParams({campus_id:poi.campus_id,query:poi.name,limit:'5'}),{signal:abort.signal}).then(r=>r.json()).then(body=>{if(!abort.signal.aborted)setSources((body.hits??[]).filter((s:Source)=>s.snippet.includes(poi.name)));}).catch(()=>{});return()=>abort.abort();},[poi.id]);
 return sources.length?<details><summary>资料来源</summary>{sources.slice(0,3).map(s=><p key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> · {s.published_at??'发布日期未载明'}</p>)}</details>:null;
}
