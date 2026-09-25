"""Typed query tools and trip information; no arbitrary URL execution."""
from dataclasses import asdict
from datetime import date
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from .service import knowledge
from .retrieval import ROOT, retriever, today
from .campus_feeds import campus_feeds
from .user_library import user_library

router=APIRouter(prefix='/api/campus',tags=['campus-evidence'])

class ToolArgs(BaseModel):
    model_config=ConfigDict(extra='forbid')
    campusId: Literal['weijinlu','beiyangyuan']
    poiId: str | None = None
    query: str = Field(default='',max_length=2000)
    asOf: date | None = None
    stopIds: list[str] = Field(default_factory=list,max_length=5)


async def execute_tool(name:str,args:dict,deadline=None):
    value=ToolArgs.model_validate(args)
    for poi_id in [*value.stopIds,*([value.poiId] if value.poiId else [])]:
        poi=knowledge.get_poi(poi_id)
        if not poi or poi.campus_id!=value.campusId:
            raise ValueError('地点不存在或校区不匹配')
    if name=='get_poi':
        if not value.poiId:raise ValueError('poiId required')
        poi=knowledge.get_poi(value.poiId)
        return {'poiId':poi.id,'campusId':poi.campus_id,'name':poi.name,'description':poi.description,'sourceIds':poi.source_refs}
    if name=='search_local':
        local=knowledge.search(value.query,value.campusId,6)
        return [s.model_dump() for s in local+user_library.search_campus(value.query,value.campusId,4)]
    if name=='search_subscriptions':
        return [s.model_dump() for s in await campus_feeds.search(value.query,value.campusId,6)]
    if name in ('search_official','search_supplemental'):
        return asdict(await retriever.retrieve(value.query,value.campusId,value.poiId,
                      str(value.asOf) if value.asOf else today(),deadline=deadline,supplemental=name=='search_supplemental'))
    if name=='get_trip_brief':
        seed=json.loads((ROOT/'official_content_seed.json').read_text('utf-8'))
        sources={s['id']:s for s in seed['sources']}
        records=[r for r in seed['records'] if r['kind'] in ('recent_news','general_visit_guide')]
        return {'status':'partial','asOf':str(value.asOf or today()),'stopIds':value.stopIds,
                'advice':'按兴趣留意建筑外观和校园文化细节；建议停留时间由行程分配。',
                'items':[{'text':r['display_text'],'publishedAt':r['published_at'],'source':sources[r['source_ids'][0]],
                          'currentVerified':False,'label':'一般指南' if r['published_at'] is None else '已收录的近期消息'} for r in records],
                'pending':['入馆与入校规则需分别确认；收录资料不代表当天开放。']}
    raise ValueError('unknown tool')


@router.post('/trip-brief')
async def trip_brief(body:ToolArgs):
    try:return await execute_tool('get_trip_brief',body.model_dump(mode='json'))
    except ValueError as e:raise HTTPException(422,str(e)) from None


@router.get('/query-trace/{request_id}')
async def query_trace(request_id:str):
    from backend.model.service import model
    value=model.query_traces.get(request_id)
    if value is None:raise HTTPException(404,'Trace not retained')
    return value


TOOLS=[{'type':'function','function':{'name':name,'description':description,
        'parameters':ToolArgs.model_json_schema()}} for name,description in [
    ('get_poi','读取同校区已登记地点，不能生成ID'),('search_local','查询本地校园资料'),
    ('search_subscriptions','检索校内公众号链接与可用维基缓存；标题和旧缓存不能确认今日规定'),
    ('search_official','限时读取注册官方来源'),('search_supplemental','读取社区文化资料，不能确认今日开放'),
    ('get_trip_brief','取得已选站点出发提示和已收录公告')]]
