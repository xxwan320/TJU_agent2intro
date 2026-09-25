import { useEffect, useState } from 'react';
import type { POI } from '../../../shared/r2';
import { tourPhotoFor } from './tour-photos';
import {guideTrace} from './narration-session';
import {poiIntroduction} from './poi-introduction';

/** A place's introduction stays available even when additional material is offline. */
export function PoiProfile({poi, categoryLabel}: {poi: POI; categoryLabel: string}) {
  const [expanded,setExpanded]=useState(false),[imageFailed,setImageFailed]=useState(false);
  const photo = tourPhotoFor(poi.id, poi.name);
  const aliases = poi.aliases.filter(alias => alias !== poi.name);
  useEffect(() => {
    guideTrace('card.visible',{poi:poi.id,campus:poi.campus_id});
    setExpanded(false);setImageFailed(false);
  }, [poi.id, poi.campus_id]);
  const introduction=poiIntroduction(poi);
  return <div className="poi-profile">
    <figure>{!photo.placeholder&&!imageFailed?<><img src={photo.src} alt={photo.caption} loading="lazy" onError={()=>setImageFailed(true)}/><figcaption>{photo.caption}</figcaption></>:<div className="place-cover"><span>海小棠 · 校园漫游</span><strong>{poi.name}</strong><small>{categoryLabel} · 地点资料</small></div>}</figure>
    <div className="poi-profile-copy"><span className="poi-profile-kicker">{poi.campus_id === 'weijinlu' ? '卫津路校区' : '北洋园校区'} · {categoryLabel}</span>
      <h3>{poi.name}</h3>
      {aliases.length > 0 && <p className="poi-profile-aliases">也称：{aliases.join('、')}</p>}
      <section className="poi-profile-stories"><h4>认识这里</h4><p className="poi-profile-brief">{!expanded&&introduction.length>160?introduction.slice(0,160)+'…':introduction}</p></section>
      {introduction.length>160&&<button type="button" className="expand-intro" onClick={()=>setExpanded(!expanded)}>{expanded?'收起介绍':'展开介绍'}</button>}
    </div>
  </div>;
}
