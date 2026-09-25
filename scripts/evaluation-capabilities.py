"""Explicit one-call gateway capability check. Never prints credentials."""
import asyncio,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.common.config import get_settings
from backend.model.service import create_client
from backend.knowledge.query_routes import TOOLS

async def main():
    settings=get_settings();client=create_client(settings)
    result={'tool_calls':False,'model':settings.llm_model,'llm_calls':1,'asr_configured':bool(settings.asr_url and settings.asr_model and settings.asr_api_key.get_secret_value()),'search_provider':'not configured; registered pages available'}
    try:
        response=await asyncio.wait_for(client.chat.completions.create(model=settings.llm_model,tools=TOOLS[:1],
            tool_choice={'type':'function','function':{'name':'get_poi'}},messages=[{'role':'user','content':'调用get_poi读取 campusId=beiyangyuan、poiId=beiyangyuan-shangxian-stone。'}],stream=False),40)
        message=response.choices[0].message
        calls=message.tool_calls or []
        result['tool_calls']=bool(calls and calls[0].function.name=='get_poi')
        result['returned_calls']=[{'name':c.function.name,'arguments':json.loads(c.function.arguments)} for c in calls]
    except Exception as e:result['error_type']=type(e).__name__
    finally:await client.close()
    Path('.runtime/campus-capabilities.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    Path('docs/interaction/20260917-functional/capabilities.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False))

asyncio.run(main())
