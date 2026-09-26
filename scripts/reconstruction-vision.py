"""Observe image pixels for the reconstruction planner. This is not a geometry quality certificate."""
from pathlib import Path
import sys,json,time,os
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'.vision/packages'))
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
def review(path):
 import torch
 from PIL import Image,ImageOps
 from transformers import AutoModelForVision2Seq,AutoProcessor
 started=time.monotonic();weights=json.loads((root/'.vision/weights.json').read_text())
 image=ImageOps.exif_transpose(Image.open(path)).convert('RGB');image.thumbnail((640,640))
 model=AutoModelForVision2Seq.from_pretrained(weights['path'],local_files_only=True,dtype=torch.bfloat16,attn_implementation='sdpa').to('cuda').eval()
 processor=AutoProcessor.from_pretrained(weights['path'],local_files_only=True)
 messages=[{'role':'user','content':[{'type':'image','image':image},{'type':'text','text':'Describe the main visible subject and its geometric shape, flat or curved surfaces, visible colors, and the background. State whether the subject is cut off by an image edge or partly obscured. State if this is an interior or exterior view when clear. Be concise. Do not invent hidden details, location identity or dimensions.'}]}]
 prompt=processor.apply_chat_template(messages,add_generation_prompt=True)
 inputs=processor(text=prompt,images=[image],return_tensors='pt').to('cuda')
 with torch.inference_mode():ids=model.generate(**inputs,max_new_tokens=100,do_sample=False)
 text=processor.batch_decode(ids[:,inputs['input_ids'].shape[1]:],skip_special_tokens=True)[0]
 return {'status':'reviewed','model':weights['repo'],'revision':weights['revision'],'input':'actual image pixels','usedFor':'visible input observation for reconstruction planning','promptEnglish':text,'seconds':time.monotonic()-started,'peakCudaBytes':torch.cuda.max_memory_allocated()}
if __name__=='__main__':
 output=Path(sys.argv[2])
 try:result=review(sys.argv[1])
 except Exception as exc:
  import traceback;traceback.print_exc();result={'status':'unavailable','errorType':type(exc).__name__}
 output.write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
 print(json.dumps(result,ensure_ascii=False),flush=True)
