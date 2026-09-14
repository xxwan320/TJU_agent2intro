import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CampusId } from '../../../shared/contracts';
import type { CampusAssets, ExternalNavigation, MapPublicConfig, POI, POICategory, RouteResponse, UserPosition } from '../../../shared/r2';
import { createOnlineMap, type OnlineMapHandle } from '../scene/amap';
import { MapBudget, MAP_DAILY_LIMITS } from '../transport/map-budget';
import { DestinationSelectionRequired, type MapDestination } from '../transport/amap-navigation';
import { r2Transport } from '../transport/r2';
import { freshUuid } from './model';
import { mergePoiPages } from './r2-model';
import { navigationFor, routeFor, OperationScope } from './navigation-model';

const CATEGORY_LABELS: Record<POICategory|'all',string>={all:'全部',teaching:'教学',library:'图书馆',gate:'校门',dining:'餐饮',dorm_area:'宿舍区',sports:'体育',culture:'文化',service:'服务',other:'其他'};
interface Props {
  campus:CampusId; sessionId:string; focusPoiId:string|null; focusRevision:number;
  onSelect(poi:POI|null):void; onAssets(assets:CampusAssets|null):void;
  onAsk(prompt:string,poi:POI):void; onReadRoute(route:RouteResponse):void;
}
function operationError(error:unknown):string {
  const code=error instanceof Error?error.message:'map_failed';
  const labels:Record<string,string>={
    map_not_configured:'在线地图未配置，基础导览和外部导航仍可使用。',
    map_proxy_not_ready:'地图安全代理尚未就绪。',
    test_budget_exhausted:'今日地图调用额度已用完，明日可继续使用应用内规划。',
    rate_limited:'操作过于频繁，请稍后再试。',
    operation_in_progress:'请等待当前地图操作结束。',
    destination_not_found:'高德暂未找到对应地点，可调整目录搜索或使用外部导航。',
    destination_match_expired:'目的地匹配已过期，请重新在高德地图匹配。',
    route_no_data:'高德没有返回匹配地点或可用步行路线。',
    location_accuracy_unverified:'定位精度不足或为IP定位，可设置手动起点。',
    location_expired_or_inaccurate:'起点已过期或精度不足，请重新明确起点。',
    map_timeout:'地图服务超时，请稍后重新规划。',
    NETWORK_ERROR:'无法连接应用内地图接口，请检查本地服务是否运行。',
    TRANSPORT_TIMEOUT:'应用内地图请求超时，请稍后重新规划。',
    UPSTREAM_TIMEOUT:'高德响应超时，请稍后重新规划。',
    RATE_LIMITED:'地图请求过于频繁，请稍后重新规划。',
    VALIDATION_ERROR:'地图请求参数未通过校验，请重新选择起点和目的地。',
    UPSTREAM_PROTOCOL_ERROR:'高德返回的数据格式异常，本次未生成有效路线。',
    INVALID_USER_KEY:'高德 Key 无效或已停用。',
    USERKEY_PLAT_NOMATCH:'高德 Key 平台类型与当前接口不匹配。',
    INVALID_USER_SCODE:'高德安全密钥与 Key 不匹配。',
    INVALID_USER_DOMAIN:'当前访问域名不在高德允许列表中。',
    DAILY_QUERY_OVER_LIMIT:'高德今日服务额度已用完。',
    INSUFFICIENT_PRIVILEGES:'高德未授予此 Key 对应服务权限。',
    NOT_CONFIGURED:'应用尚未加载高德配置，请重启本地服务。',
    NO_ROADS_NEARBY:'起点或目的地附近没有可用道路，请在道路上重新选点。',
    OVER_DIRECTION_RANGE:'起终点超出高德步行规划范围，请选择同一校区内的起点。',
    OUT_OF_SERVICE:'起点或目的地不在高德服务范围内。',
    invalid_route_result:'路线距离或分步数据不完整，请重新规划。',
    invalid_route_step:'高德返回的路线步骤缺少道路信息，请重新规划。',
    invalid_coordinates:'地点坐标格式无效，请重新选点或匹配地点。',
    budget_storage_invalid:'浏览器保存的地图用量数据损坏，请清除此站点的数据后刷新。',
    budget_storage_unavailable:'浏览器无法保存地图用量，请允许此站点使用本地存储。',
    operation_capacity:'本页操作次数达到上限，请刷新后继续。',
    map_provider_failed:'高德定位插件未返回有效位置，可在地图上选择步行起点。',
    city_location_unavailable:'当前出口 IP 未返回可用城市位置。',
    permission_denied:'定位权限被拒绝，请使用手动起点。',
    location_timeout:'定位超时，请设置手动起点或稍后重试。',
    cancelled:'本地已停止；实际额度扣减以高德控制台为准。',
  };
  return labels[code] ? labels[code]+'（'+code+'）' : '地图操作发生未识别异常，请刷新后重试。（map_unexpected_error）';
}
export function CampusExplorer({campus,sessionId,focusPoiId,focusRevision,onSelect,onAssets,onAsk,onReadRoute}:Props) {
  const [items,setItems]=useState<POI[]>([]),[total,setTotal]=useState<number|null>(null),[nextCursor,setNextCursor]=useState<string|null>(null);
  const [queryDraft,setQueryDraft]=useState(''),[query,setQuery]=useState(''),[category,setCategory]=useState<POICategory|'all'>('all'),[loading,setLoading]=useState(false),[directoryError,setDirectoryError]=useState('');
  const [selected,setSelected]=useState<POI|null>(null),[assets,setAssets]=useState<CampusAssets|null>(null),[zoom,setZoom]=useState(1),[view,setView]=useState<'local'|'online'>('local');
  const [mapConfig,setMapConfig]=useState<MapPublicConfig|null>(null),[onlineError,setOnlineError]=useState(''),[onlineRequested,setOnlineRequested]=useState(false),[onlineReady,setOnlineReady]=useState(false);
  const [position,setPosition]=useState<UserPosition|null>(null),[locationMessage,setLocationMessage]=useState('尚未请求定位'),[locating,setLocating]=useState(false);
  const [tracking,setTracking]=useState(false);
  const [destinations,setDestinations]=useState<MapDestination[]>([]),[destination,setDestination]=useState<MapDestination|null>(null),[destinationBusy,setDestinationBusy]=useState(false),[activeStep,setActiveStep]=useState(0),[pickingStart,setPickingStart]=useState(false);
  const pendingMapFocus=useRef<string|null>(null);
  const pendingDestinationRoute=useRef(false);
  const [routeOriginNote,setRouteOriginNote]=useState('');
  const locationTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [manualLng,setManualLng]=useState(''),[manualLat,setManualLat]=useState(''),[externalNav,setExternalNav]=useState<ExternalNavigation|null>(null),[route,setRoute]=useState<RouteResponse|null>(null),[routeBusy,setRouteBusy]=useState(false),[routeError,setRouteError]=useState('');
  const [budgetText,setBudgetText]=useState('地图加载 0 / 定位 0 / POI搜索 0 / 步行规划 0');
  const operationRef=useRef(0),selectedRef=useRef<POI|null>(null),itemsRef=useRef(items),campusRef=useRef(campus);
  itemsRef.current=items;campusRef.current=campus;
  const onlineHostRef=useRef<HTMLDivElement>(null),onlineRef=useRef<OnlineMapHandle|null>(null),budgetRef=useRef<MapBudget|null>(null),mapAttemptedRef=useRef(false);
  const routeScope=useRef(new OperationScope()),locationScope=useRef(new OperationScope()),routeBusyRef=useRef(false);
  const activeMap=assets?.maps.find(map=>map.campus_id===campus)??null;
  const updateBudget=()=>{const counters=budgetRef.current?.snapshot().counters;if(counters)setBudgetText('地图加载 '+counters.map_load.initiated+' / 定位 '+counters.geolocation.initiated+' / POI搜索 '+counters.poi_search.initiated+' / 步行规划 '+counters.walking_route.initiated);};
  const clearRoute=useCallback(()=>{routeScope.current.cancel();routeBusyRef.current=false;setRouteBusy(false);setDestinationBusy(false);setRoute(null);setActiveStep(0);setRouteError('');onlineRef.current?.clearRoute();},[]);
  const choose=useCallback((poi:POI|null)=>{pendingDestinationRoute.current=false;selectedRef.current=poi;setSelected(poi);setExternalNav(null);setDestinations([]);setDestination(null);setPickingStart(false);onlineRef.current?.pickStart(null);onlineRef.current?.showDestination(null);clearRoute();},[clearRoute]);
  useEffect(()=>{onSelect(selected?.campus_id===campus?selected:null);},[selected,campus,onSelect]);
  useEffect(()=>{
    let active=true;
    if(!focusPoiId)return;
    pendingMapFocus.current=focusPoiId;setView('online');setOnlineRequested(true);
    const known=items.find(item=>item.id===focusPoiId);
    if(known){choose(known);return;}
    void r2Transport.poi(focusPoiId).then(poi=>{if(active&&poi.campus_id===campus){setItems(current=>mergePoiPages(current,[poi]));choose(poi);}}).catch(()=>undefined);
    return()=>{active=false;};
  },[focusPoiId,focusRevision,campus,choose]);
  useEffect(()=>{
    const revision=++operationRef.current;setItems([]);setTotal(null);setNextCursor(null);choose(null);setLoading(true);setDirectoryError('');
    const options={...(category!=='all'?{category}:{}),...(query?{query}:{}),limit:20};
    // Local directory settles independently of map configuration and image downloads.
    void r2Transport.pois(campus,options).then(page=>{if(operationRef.current!==revision)return;setItems(page.items);setTotal(page.total);setNextCursor(page.next_cursor);}).catch(()=>{if(operationRef.current===revision)setDirectoryError('点位目录暂不可用，请重试。');}).finally(()=>{if(operationRef.current===revision)setLoading(false);});
    return()=>{operationRef.current++;};
  },[campus,category,query,choose]);
  useEffect(()=>{
    let active=true;setAssets(null);onAssets(null);setZoom(1);clearRoute();locationScope.current.cancel();setLocating(false);setTracking(false);setPosition(null);
    if(locationTimer.current)clearTimeout(locationTimer.current);
    void r2Transport.campusAssets(campus).then(value=>{if(active){setAssets(value);onAssets(value);}}).catch(()=>{if(active){setAssets({maps:[],media:[],version:'unavailable'});onAssets({maps:[],media:[],version:'unavailable'});}});
    return()=>{active=false;};
  },[campus,onAssets,clearRoute]);
  useEffect(()=>{
    let active=true;
    void r2Transport.mapConfig().then(value=>{if(active){setMapConfig(value);if(value.js_key&&value.status.security_key_configured){setView('online');setOnlineRequested(true);}}}).catch(()=>{if(active)setOnlineError('在线地图配置暂不可用，基础导览不受影响。');});
    return()=>{active=false;};
  },[]);
  useEffect(()=>{
    let active=true;setExternalNav(null);
    if(!selected||selected.campus_id!==campus)return;
    void r2Transport.externalNavigation(selected.id).then(value=>{if(active&&selectedRef.current?.id===value.poi_id)setExternalNav(value);}).catch(()=>undefined);
    return()=>{active=false;};
  },[selected,campus]);
  useEffect(()=>{
    if(!onlineRequested||!mapConfig||!onlineHostRef.current||mapAttemptedRef.current)return;
    mapAttemptedRef.current=true;
    const controller=new AbortController();let handle:OnlineMapHandle|null=null;
    try{budgetRef.current??=new MapBudget({limits:MAP_DAILY_LIMITS,scope:'daily-'+new Date().toLocaleDateString('en-CA')});updateBudget();}catch(error){setOnlineError(operationError(error));return;}
    void createOnlineMap(onlineHostRef.current,mapConfig,budgetRef.current,freshUuid(),controller.signal,id=>{const poi=itemsRef.current.find(item=>item.id===id);if(poi)choose(poi);}).then(value=>{
      if(controller.signal.aborted){value.destroy();return;}
      handle=value;onlineRef.current=value;setOnlineReady(true);setOnlineError('');value.setPois(itemsRef.current,selectedRef.current?.id??null);
    }).catch(error=>{if(!controller.signal.aborted)setOnlineError(operationError(error));}).finally(updateBudget);
    return()=>{controller.abort();handle?.destroy();onlineRef.current=null;};
  },[onlineRequested,mapConfig,choose]);
  useEffect(()=>{onlineRef.current?.setPois(items,selected?.id??null);},[items,selected,onlineReady]);
  useEffect(()=>{if(view==='online')onlineRef.current?.resize();},[view,onlineReady]);
  useEffect(()=>{if(position)onlineRef.current?.showPosition(position);},[position,onlineReady]);
  useEffect(()=>{if(route)onlineRef.current?.highlightStep(route.steps[activeStep]?.polyline??[]);},[route,activeStep]);
  useEffect(()=>{
    if(onlineReady&&selected&&pendingMapFocus.current===selected.id){pendingMapFocus.current=null;void viewOnMap();}
  },[selected,onlineReady,focusRevision]);
  useEffect(()=>()=>{routeScope.current.cancel();locationScope.current.cancel();if(locationTimer.current)clearTimeout(locationTimer.current);},[]);
  async function loadMore(){
    if(!nextCursor||loading)return;const revision=operationRef.current;setLoading(true);
    try{const page=await r2Transport.pois(campus,{...(category!=='all'?{category}:{}),...(query?{query}:{}),limit:20,cursor:nextCursor});if(operationRef.current===revision){setItems(current=>mergePoiPages(current,page.items));setTotal(page.total);setNextCursor(page.next_cursor);}}
    catch{if(operationRef.current===revision)setDirectoryError('下一页加载失败，请重试。');}
    finally{if(operationRef.current===revision)setLoading(false);}
  }
  async function beginLocation(continuous=false,ipOnly=false){
    if(!onlineRef.current||locating)return;
    onlineRef.current.pickStart(null);setPickingStart(false);
    if(locationTimer.current)clearTimeout(locationTimer.current);
    const operation=locationScope.current.begin();clearRoute();setTracking(continuous);
    async function update(){
      if(!operation.current()||!onlineRef.current)return;
      if(continuous&&document.visibilityState==='hidden'){locationTimer.current=setTimeout(()=>void update(),30000);return;}
      setLocating(true);setLocationMessage(ipOnly?'正在根据电脑出口 IP 查询城市…':'正在获取设备位置（可降级为 IP 粗略定位）…');
      try{
        const result=await (ipOnly?onlineRef.current.locateCity(freshUuid(),operation.controller.signal):onlineRef.current.locate(freshUuid(),operation.controller.signal));
        if(operation.current()){
          setPosition(result);clearRoute();
          const label=result.accuracy_m===null?'IP 区域中心，可作为粗略路线起点，不代表设备实际位置。':'设备定位，精度约 '+Math.round(result.accuracy_m)+' 米。';
          setLocationMessage(label+(continuous?' 每30秒更新，切到后台暂停。':''));
        }
      }catch(error){if(operation.current())setLocationMessage(operationError(error)+' 可尝试“IP 城市定位”。');}
      finally{
        if(operation.current()){setLocating(false);if(continuous)locationTimer.current=setTimeout(()=>void update(),30000);}
        updateBudget();
      }
    }
    await update();
  }
  function stopLocation(){locationScope.current.cancel();if(locationTimer.current)clearTimeout(locationTimer.current);setLocating(false);setTracking(false);setLocationMessage('定位已停止。');}
  function applyManualStart(){
    const lng=Number(manualLng),lat=Number(manualLat);
    if(!manualLng.trim()||!manualLat.trim()||!Number.isFinite(lng)||!Number.isFinite(lat)||Math.abs(lng)>180||Math.abs(lat)>90){setLocationMessage('请输入有效 GCJ-02 经度和纬度。');return;}
    stopLocation();onlineRef.current?.pickStart(null);setPickingStart(false);clearRoute();setPosition({lng,lat,crs:'GCJ02',source:'manual',accuracy_m:null,timestamp:new Date().toISOString()});setLocationMessage('手动起点（GCJ-02），可随时重新规划，不代表设备实际位置。');
  }
  function pickMapStart(){
    if(!onlineRef.current)return;
    stopLocation();clearRoute();setView('online');setPickingStart(true);setLocationMessage('请点击在线地图，选择步行起点。');
    onlineRef.current.pickStart(result=>{if(campusRef.current!==campus)return;setPosition(result);setPickingStart(false);setLocationMessage('已选择地图起点，可随时规划步行路线。');});
  }
  async function viewOnMap(){
    const poi=selectedRef.current;if(!poi||poi.campus_id!==campus)return;
    setView('online');setOnlineRequested(true);document.querySelector('.map-surface')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    if(!onlineRef.current){pendingMapFocus.current=poi.id;return;}
    if(destination?.poiId===poi.id&&Date.now()-destination.matchedAt<600000){onlineRef.current.showDestination(destination);return;}
    clearRoute();setDestination(null);onlineRef.current.showDestination(null);const operation=routeScope.current.begin();setDestinationBusy(true);setDestinations([]);
    try{
      const matches=await onlineRef.current.findDestination(poi,freshUuid(),operation.controller.signal);
      if(!operation.current()||selectedRef.current?.id!==poi.id||campusRef.current!==campus)return;
      setDestinations(matches);onlineRef.current.showDestination(matches[0]);
    }catch(error){if(operation.current())setRouteError('目的地匹配失败：'+operationError(error));}
    finally{if(operation.current())setDestinationBusy(false);updateBudget();}
  }
  function confirmDestination(match:MapDestination){const resume=pendingDestinationRoute.current;pendingDestinationRoute.current=false;clearRoute();setDestination(match);setView('online');onlineRef.current?.showDestination(match);if(resume)void planRoute(match);}
  async function planRoute(confirmed?:MapDestination){
    const poi=selectedRef.current;if(!poi||poi.campus_id!==campus||!onlineRef.current||routeBusyRef.current)return;
    pendingDestinationRoute.current=false;
    if(tracking||locating)stopLocation();onlineRef.current.pickStart(null);setPickingStart(false);setView('online');setActiveStep(0);
    const operation=routeScope.current.begin();routeBusyRef.current=true;setRouteBusy(true);setRoute(null);setRouteError('');onlineRef.current.clearRoute();
    try{
      const planned=await onlineRef.current.navigate({route_id:freshUuid(),session_id:sessionId,campus_id:campus,destination_poi_id:poi.id,entrance_id:null,origin:position,user_initiated:true},poi,operation.controller.signal,confirmed??destination??undefined);
      if(!operation.current()||selectedRef.current?.id!==poi.id||campusRef.current!==campus)return;
      const result=planned.route;
      const note=planned.origin.source==='manual'?'路线起点：地图手动选点。':planned.origin.accuracy_m===null?'路线起点：IP 所属区域的中心点，可能偏离实际位置；可在地图重新选点以获得更准确的路线。':'路线起点：设备定位。';
      setPosition(planned.origin);setLocationMessage(note);setRouteOriginNote(note);
      if(planned.destination){setDestination(planned.destination);setDestinations([planned.destination]);onlineRef.current.showDestination(planned.destination);}
      setRoute(result);
      try{onlineRef.current.showRoute(result.steps.map(step=>step.polyline));}
      catch{setRouteError('路线已取得，但地图绘制失败；下方可查看实际分步指引。（map_render_failed）');}
    }catch(error){if(operation.current()){
      if(error instanceof DestinationSelectionRequired){if(error.origin)setPosition(error.origin);setDestinations(error.matches);pendingDestinationRoute.current=true;onlineRef.current.showDestination(error.matches[0]);setRouteError('找到了多个同名地点，请在下方选择目的地，随后自动继续应用内步行规划。');}
      else setRouteError('步行规划失败：'+operationError(error));
    }}
    finally{if(operation.current()){routeBusyRef.current=false;setRouteBusy(false);}updateBudget();}
  }
  const filteredSchematic=useMemo(()=>activeMap?items.filter(item=>item.campus_id===campus&&item.schematic_position?.map_id===activeMap.id):[],[items,activeMap,campus]);
  const externalUrl=navigationFor(externalNav,selected?.campus_id===campus?selected:null);
  const visibleRoute=routeFor(route,selected?.campus_id===campus?selected:null);
  return <section className="explorer" aria-label="校园地图与点位目录">
    <div className="explorer-toolbar"><form onSubmit={(event) => { event.preventDefault(); setQuery(queryDraft.trim()); }}><input value={queryDraft} maxLength={100} onChange={(event) => setQueryDraft(event.target.value)} placeholder="搜索点位或别名" aria-label="搜索点位"/><button type="submit">搜索</button></form><select value={category} onChange={(event) => setCategory(event.target.value as POICategory | 'all')} aria-label="点位分类">{Object.entries(CATEGORY_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><div className="map-kind-tabs"><button className={view === 'local' ? 'active' : ''} onClick={() => setView('local')}>本地图</button><button className={view === 'online' ? 'active' : ''} onClick={() => { setView('online'); setOnlineRequested(true); }}>在线地图</button></div></div>
    <div className="map-directory"><div className="map-surface">
      <div className="schematic-viewport" hidden={view !== 'local'}><div className="map-zoom"><button aria-label="放大本地图" onClick={() => setZoom((value) => Math.min(2, value + .2))}>＋</button><button aria-label="缩小本地图" onClick={() => setZoom((value) => Math.max(.7, value - .2))}>−</button></div>{activeMap && activeMap.local_path.startsWith('/assets/campus/') ? <div className="schematic-layer" style={{ aspectRatio: activeMap.width / activeMap.height, transform: `scale(${zoom})`, backgroundImage: `url(${JSON.stringify(activeMap.local_path).slice(1, -1)})` }}>{filteredSchematic.map((poi) => <button key={poi.id} style={{ left: `${poi.schematic_position!.x * 100}%`, top: `${poi.schematic_position!.y * 100}%` }} className={selected?.id === poi.id ? 'selected' : ''} title={poi.name} onClick={() => choose(poi)}><span>{poi.name}</span></button>)}</div> : <div className="map-empty"><strong>暂无可用校园图面</strong><span>点位目录仍可独立浏览；不会用其他学校或生成图片替代。</span></div>}<div className="map-attribution">{activeMap ? `图面：${activeMap.creator} · ${activeMap.usage_basis} · 资料年代 ${activeMap.data_as_of ?? '未知'} · 非精确导航` : '图面来源未返回'}</div></div><div className="online-map-wrap" hidden={view !== 'online'}><div ref={onlineHostRef} className="online-map-host"/>{onlineError && <div className="map-empty overlay"><strong>{onlineError}</strong><button onClick={() => setView('local')}>返回本地图</button></div>}</div>
      <div className="location-panel"><div><strong>我的起点</strong><span>{locationMessage}{position && ` 更新时间 ${new Date(position.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}`}</span></div><div className="location-actions"><button disabled={!onlineReady||locating||tracking} onClick={() => void beginLocation()}>定位一次</button><button disabled={!onlineReady||locating||tracking} onClick={() => void beginLocation(true)}>持续定位</button><button disabled={!onlineReady||locating||tracking} onClick={() => void beginLocation(false,true)}>IP 城市定位</button><button disabled={!onlineReady||locating||tracking} onClick={() => void beginLocation(true,true)}>持续 IP 定位</button>{(locating||tracking)&&<button onClick={stopLocation}>停止定位</button>}</div><button disabled={!onlineReady} onClick={pickMapStart}>在地图选择起点</button>{pickingStart&&<button onClick={()=>{onlineRef.current?.pickStart(null);setPickingStart(false);setLocationMessage('已取消选点。');}}>取消选点</button>}<details><summary>输入起点坐标</summary><div><input value={manualLng} onChange={(event) => setManualLng(event.target.value)} inputMode="decimal" placeholder="GCJ-02 经度" aria-label="手动起点经度"/><input value={manualLat} onChange={(event) => setManualLat(event.target.value)} inputMode="decimal" placeholder="GCJ-02 纬度" aria-label="手动起点纬度"/><button onClick={applyManualStart}>应用</button></div></details></div>
    </div><aside className="poi-directory"><div className="directory-summary"><strong>点位目录</strong><span>{total == null ? `${items.length} 项已加载` : `${items.length} / ${total}`}</span></div>{directoryError && <p className="inline-error">{directoryError}</p>}<div className="poi-list">{items.map((poi) => <button key={poi.id} className={selected?.id === poi.id ? 'selected' : ''} onClick={() => choose(poi)}><span>{CATEGORY_LABELS[poi.category]}</span><strong>{poi.name}</strong><small>{poi.verification_status === 'verified' ? '资料已核验' : '资料待核验'}</small></button>)}</div>{nextCursor && <button className="load-more" disabled={loading} onClick={() => void loadMore()}>{loading ? '加载中…' : '加载更多'}</button>}{!loading && !items.length && !directoryError && <p className="directory-empty">没有符合条件的点位。</p>}</aside></div>
    {selected?.campus_id === campus && <article className="poi-card" data-poi-id={selected.id}><div><span>{CATEGORY_LABELS[selected.category]}</span><h3>{selected.name}</h3><p>{selected.description}</p><small>稳定 ID：{selected.id} · {selected.location ? `${selected.location.quality} / ${selected.location.coordinate_source}` : '无导航坐标'}</small></div><div className="poi-actions"><button onClick={() => onAsk(`请展开讲讲${selected.name}。`, selected)}>展开讲讲</button><button disabled={destinationBusy} onClick={() => void viewOnMap()}>{destinationBusy?'匹配中…':'在在线地图查看'}</button>{externalUrl ? <a href={externalUrl} target="_blank" rel="noreferrer">外部导航{externalNav?.precision === 'name_search' ? '（按名称）' : ''}</a> : <span title={externalNav?.kind === 'unavailable' ? '该点位不满足已核验导航条件' : '导航入口未返回'}>外部导航未提供</span>}<button disabled={!onlineReady||routeBusy||destinationBusy} onClick={() => void planRoute()}>{routeBusy?'获取起点并规划…':position?'从起点步行到这里':'从 IP 位置步行到这里'}</button>{routeBusy&&<button onClick={clearRoute}>停止规划</button>}</div></article>}
    {destinations.length>0&&<section className="destination-matches" aria-label="高德目的地匹配"><strong>{destination?'已确认目的地：'+destination.name:'请选择与当前校区对应的地点'}</strong><p>以下为高德匹配结果；点击地点可在在线地图查看并设为步行目的地。</p>{destinations.map(match=><button key={match.providerId} className={destination===match?'selected':''} aria-pressed={destination===match} onClick={()=>confirmDestination(match)}><strong>{match.name}</strong><span>{match.address}</span>{destination===match&&<small>已选为目的地</small>}</button>)}</section>}
    {routeError && <p className="inline-error route-error">{routeError}</p>}{visibleRoute && <details className="route-result" open><summary>步行方案 · {Math.round(visibleRoute.distance_m)} 米{visibleRoute.duration_s == null ? '' : ` · 约 ${Math.ceil(visibleRoute.duration_s / 60)} 分钟`}</summary><p>{routeOriginNote}</p><p>{visibleRoute.campus_access === 'verified' ? '校园通行信息有资料依据。' : '校内门禁与道路通行尚未核验，请以现场为准。'}</p><div className="route-step-guide" aria-live="polite"><strong>第 {activeStep+1} / {visibleRoute.steps.length} 步</strong><p>{visibleRoute.steps[activeStep]?.instruction} · {Math.round(visibleRoute.steps[activeStep]?.distance_m??0)} 米</p><button disabled={activeStep===0} onClick={()=>setActiveStep(value=>value-1)}>上一步</button><button disabled={activeStep>=visibleRoute.steps.length-1} onClick={()=>setActiveStep(value=>value+1)}>下一步</button><button onClick={()=>{setView('online');onlineRef.current?.showRoute(visibleRoute.steps.map(step=>step.polyline));}}>查看整条路线</button></div><ol>{visibleRoute.steps.map((step, index) => <li key={`${index}-${step.instruction}`}><button aria-current={activeStep===index?'step':undefined} onClick={()=>{setView('online');setActiveStep(index);onlineRef.current?.highlightStep(step.polyline);}}>{step.instruction} · {Math.round(step.distance_m)} 米</button></li>)}</ol><button onClick={() => onReadRoute(visibleRoute)}>朗读实际路线</button></details>}
    <details className="map-budget"><summary>地图用量与配置</summary><p>{budgetText}</p><p>这是应用发起次数，不是高德配额扣减。每日上限：地图加载100、定位3000、POI搜索100、路线200；持续定位每30秒更新，失败和取消也计数。校园目录搜索不调用高德。</p><p>在线地图：{mapConfig?.status.online_map??'未取得状态'}；路线方案来自高德，校园通行另行核验。</p></details>
  </section>;
}
