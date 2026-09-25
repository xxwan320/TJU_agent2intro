import asyncio,json,unittest
from datetime import timedelta
from types import SimpleNamespace as NS
from backend.model.harness import Harness,ToolContext,ToolResult,Evidence,ToolStream,resolve_refs,now
from backend.harness_contracts import ToolRequest
class RuntimeTests(unittest.IsolatedAsyncioTestCase):
 def context(self,g=1):return ToolContext(sessionId='s',campusId='weijinlu',channel='test',generation=g)
 async def test_invalid_and_unknown_zero_execution(self):
  h=Harness();r=h.begin(self.context());caps={c.toolName:c for c in await h.capabilities(r.context)}
  for name,args in [('shell',{}),('poi_select',{'poiId':'not-real'}),('narration_control',{'action':'delete'})]:
   result=await h.execute(r,name,args,name,caps);self.assertEqual(result.status,'failed')
  self.assertEqual(r.tool_calls,0)
 async def test_receipt_binding_cancellation_and_no_replay(self):
  h=Harness();r=h.begin(self.context());caps={c.toolName:c for c in await h.capabilities(r.context)}
  task=asyncio.create_task(h.execute(r,'narration_control',{'action':'stop'},'c1',caps));await asyncio.sleep(.02)
  result=ToolResult(toolCallId='c1',status='completed',data={'status':'stopped'},evidence=[Evidence(type='TEST_PROVIDER',observed='synthetic stopped')])
  with self.assertRaises(ValueError):h.acknowledge(r,self.context(0),'c1',result)
  h.acknowledge(r,r.context,'c1',result);self.assertEqual((await task).status,'completed')
  await h.execute(r,'narration_control',{'action':'stop'},'c1',caps);self.assertEqual(r.tool_calls,1)
  h.cancel(r)
  with self.assertRaises(ValueError):h.acknowledge(r,r.context,'c1',result)
 async def test_timeout_is_not_success(self):
  h=Harness();r=h.begin(self.context());r.deadline=now()+timedelta(seconds=.04)
  caps={c.toolName:c for c in await h.capabilities(r.context)}
  result=await h.execute(r,'narration_control',{'action':'stop'},'c',caps)
  self.assertEqual(result.status,'failed');self.assertEqual(result.error.code,'TIMEOUT')
 async def test_generation_and_token(self):
  h=Harness();r=h.begin(self.context())
  with self.assertRaises(ValueError):h.get(r.id,'wrong')
  with self.assertRaises(ValueError):h.begin(self.context())
  h.begin(self.context(2));self.assertTrue(r.cancelled)
 def test_stream_only_assembled_json(self):
  p=ToolStream()
  def choice(fragment,finish=None):return NS(delta=NS(content=None,tool_calls=[NS(index=0,id='call1' if fragment=='{"' else None,function=NS(name='echo' if fragment=='{"' else None,arguments=fragment))]),finish_reason=finish)
  p.feed(choice('{"'))
  with self.assertRaises(ValueError):p.message()
  p.feed(choice('text":"ok"}', 'tool_calls'))
  self.assertEqual(json.loads(p.message()['tool_calls'][0]['function']['arguments']),{'text':'ok'})
 def test_typed_reference_no_expression(self):
  results={'a':ToolResult(toolCallId='a',status='completed',data={'id':'safe'},evidence=[Evidence(type='TEST_PROVIDER',observed='fixture')])}
  self.assertEqual(resolve_refs({'x':{'$result':'a','path':['id']}},results),{'x':'safe'})
  with self.assertRaises(ValueError):resolve_refs({'$result':'a','path':'__class__'},results)
 def test_completed_requires_evidence(self):
  with self.assertRaises(ValueError):ToolResult(toolCallId='x',status='completed')
if __name__=='__main__':unittest.main()
