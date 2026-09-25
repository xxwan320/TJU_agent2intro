import asyncio,json
from unittest.mock import patch
from fastapi.testclient import TestClient
from backend.app import app
from backend.model.harness import Harness,drive,ToolContext,ToolResult,Evidence,Capability
client=TestClient(app)
def test_upload_session_cannot_be_chosen_by_client():
 s=client.post('/api/harness/sessions',json={'campusId':'weijinlu'}).json()
 context={'sessionId':'somebody-else','campusId':'weijinlu','channel':'harness','generation':1}
 assert client.post('/api/harness/upload-ticket',json=context,headers={'X-Harness-Session':s['token']}).status_code==403
 context['sessionId']=s['sessionId']
 assert client.post('/api/harness/upload-ticket',json=context).status_code==401
 assert client.post('/api/harness/upload-ticket',json=context,headers={'X-Harness-Session':s['token']}).status_code==200
def test_parallel_partial_and_second_round_cannot_execute_more_tools():
 async def check():
  h=Harness();r=h.begin(ToolContext(sessionId='TEST_PROVIDER',campusId='weijinlu',channel='test',generation=1))
  active=0;peak=0
  class Provider:
   async def list_capabilities(self,context):return [Capability(toolName=n,status='available',inputSchema={'type':'object'}) for n in ('knowledge_search','official_search')]
   async def execute_tool(self,request):
    nonlocal active,peak
    active+=1;peak=max(peak,active)
    try:
     await asyncio.sleep(.02)
     if request.toolName=='official_search':raise RuntimeError('TEST_PROVIDER failure')
     return ToolResult(toolCallId=request.toolCallId,status='completed',data={'text':'TEST_PROVIDER surviving evidence'},evidence=[Evidence(type='TEST_PROVIDER',observed='fixture')])
    finally:active-=1
   async def cancel_tool(self,*args):pass
  def call(cid,name):return {'id':cid,'type':'function','function':{'name':name,'arguments':json.dumps({'query':'test'})}}
  async def round(run,*args):
   run.model_calls+=1
   return {'role':'assistant','content':None,'tool_calls':[call('a','knowledge_search'),call('b','official_search')]} if run.model_calls==1 else {'role':'assistant','content':None,'tool_calls':[call('forbidden-third','official_search')]}
  with patch('backend.model.harness.provider',return_value=Provider()),patch('backend.model.harness.model_round',round):await drive(h,r,'查询官网')
  assert peak==2 and r.tool_calls==2 and r.model_calls==2
  assert r.results['a'].status=='completed' and r.results['b'].status=='failed'
  assert 'forbidden-third' not in r.commands
 asyncio.run(check())
def test_provider_invalid_arguments_zero_start():
 async def check():
  h=Harness();r=h.begin(ToolContext(sessionId='TEST_PROVIDER',campusId='weijinlu',channel='test',generation=1))
  caps={c.toolName:c for c in await h.capabilities(r.context)}
  result=await h.execute(r,'document_read',{'uploadId':'../../.env'},'bad',caps)
  assert result.status=='failed' and r.tool_calls==0
 asyncio.run(check())
