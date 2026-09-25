"""At most two real glm-5.1 calls; one local read-only echo. No retries."""
import asyncio,json,sys,os,time
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
os.environ['AI4TJU_ENV_FILE']=str(Path(__file__).resolve().parents[1]/'.env')
from backend.model.harness import Run,ToolContext,model_round
from backend.common.config import get_settings
async def main():
    settings=get_settings();r=Run('probe-echo',ToolContext(sessionId='probe-only',campusId='weijinlu',channel='probe',generation=0),'unused')
    report={'model':settings.llm_model,'sdkRetries':0,'gatewayRetries':'unknown','imageInput':'unknown','audioInput':'unknown','nativeMcp':'unknown','parallelTools':'unknown','status':'NOT_RUN'}
    if not settings.llm_api_key.get_secret_value():report['status']='BLOCKED_CONFIGURATION'
    else:
      try:
        messages=[{'role':'system','content':'Call echo exactly once with text harness-echo-51. After tool result reply that exact returned text. Do not do anything else.'},{'role':'user','content':'Please call echo now.'}]
        tools=[{'type':'function','function':{'name':'echo','description':'Read-only local echo','parameters':{'type':'object','properties':{'text':{'type':'string','enum':['harness-echo-51']}},'required':['text'],'additionalProperties':False}}}]
        first=await model_round(r,messages,tools);calls=first.get('tool_calls',[])
        assert len(calls)==1 and calls[0]['function']['name']=='echo'
        args=json.loads(calls[0]['function']['arguments']);assert args=={'text':'harness-echo-51'}
        messages.extend([first,{'role':'tool','tool_call_id':calls[0]['id'],'content':json.dumps(args)}])
        final=await model_round(r,messages,[])
        assert not final.get('tool_calls') and 'harness-echo-51' in final.get('content','')
        report.update(status='PASS_REAL',scope='streamed tool arguments assembled, validated, echo executed, tool_call_id returned, final answer',nativeTools='available',answer=final['content'])
      except Exception as e:report.update(status='FAIL',error=type(e).__name__,nativeTools='unknown')
    report.update(modelRequests=r.model_calls,toolExecutions=1 if 'calls' in locals() and len(calls)==1 and 'args' in locals() and args=={'text':'harness-echo-51'} else 0,elapsedMs=(time.monotonic()-r.started)*1000,ledger=r.ledger)
    target=Path('docs/diagnostics/harness-b/glm-probe.json');target.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
asyncio.run(main())
