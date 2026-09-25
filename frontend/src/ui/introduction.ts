import type {POI} from '../../../shared/r2';

export type IntroductionIntent = {kind:'none'} | {kind:'control';action:'pause'|'resume'|'stop'|'change'} |
  {kind:'introduce';poi:POI} | {kind:'clarify';candidates:POI[]};

export function mentionedPois(text:string,pois:POI[]):POI[]{
  let matches=pois.map(poi=>({poi,length:Math.max(0,...[poi.name,...poi.aliases].filter(n=>n.length>=2&&text.includes(n)).map(n=>n.length))})).filter(x=>x.length>0);
  if(/北洋园/.test(text))matches=matches.filter(x=>x.poi.campus_id==='beiyangyuan');
  if(/卫津路/.test(text))matches=matches.filter(x=>x.poi.campus_id==='weijinlu');
  const longest=Math.max(0,...matches.map(x=>x.length));return matches.filter(x=>x.length===longest).map(x=>x.poi);
}

export function introductionIntent(text:string, pois:POI[], selected:POI|null):IntroductionIntent {
  const clean=text.trim().replace(/[。！!？?，,\s]+$/g,'');
  if(/^(请)?(暂停|暂停讲解|暂停播放)$/.test(clean))return {kind:'control',action:'pause'};
  if(/^(请)?(继续|继续讲解|继续播放)$/.test(clean))return {kind:'control',action:'resume'};
  if(/^(请)?(停止|停止讲解|停止播放|别讲了)$/.test(clean))return {kind:'control',action:'stop'};
  if(/^(请)?(换一个地方|换个地方)$/.test(clean))return {kind:'control',action:'change'};
  if(/导航|怎么走|路线|地址|在哪|位置|走到|带我去/.test(clean))return {kind:'none'};
  if(!/介绍|讲讲|讲一讲|讲解|有什么特色|详细说|展开说|说说/.test(clean)||/不(?:要|用).*?(?:视频|介绍|讲解)|别.*?(?:介绍|讲解)/.test(clean))return {kind:'none'};
  const candidates=mentionedPois(clean,pois);
  if(candidates.length===1)return {kind:'introduce',poi:candidates[0]};
  if(candidates.length>1)return {kind:'clarify',candidates};
  const refers=/这里|这个地方|当前地点|这儿|它|刚才|进一步|再详细|展开|^(请)?(给我)?(介绍一下|讲讲|开始讲解|详细说说)$/.test(clean);
  // Explicit broad topics belong to normal conversation, even with a selected POI.
  if(/天津大学|天大|校园|校史|文化|校区/.test(clean)&&!refers)return {kind:'none'};
  if(refers&&selected&&pois.some(p=>p.id===selected.id))return {kind:'introduce',poi:selected};
  return refers?{kind:'clarify',candidates:[]}:{kind:'none'};
}
