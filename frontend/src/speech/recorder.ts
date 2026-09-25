/** Explicit short recording; shared speech controller still owns all playback. */
export class MandarinRecorder {
 private stream:MediaStream|null=null;
 private recorder:MediaRecorder|null=null;
 private chunks:Blob[]=[];
 private abort:AbortController|null=null;
 private epoch=0;
 private timer:ReturnType<typeof setTimeout>|null=null;
 state:'idle'|'recording'|'transcribing'='idle';
 constructor(private update:(state:string)=>void,private text:(value:string)=>void){}
 async start(sessionId:string){
  this.cancel();const epoch=this.epoch;
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined')throw Error('当前浏览器不支持录音，请使用新版 Chrome 或 Edge。');
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});
   if(epoch!==this.epoch){stream.getTracks().forEach(t=>t.stop());return;}
   this.stream=stream;
   const mime=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
   const recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);this.recorder=recorder;this.chunks=[];
   recorder.ondataavailable=e=>{if(epoch===this.epoch&&e.data.size){this.chunks.push(e.data);if(this.chunks.reduce((n,b)=>n+b.size,0)>4*1024*1024){this.cancel();this.update('录音过大，请缩短到30秒以内。');}}};
   recorder.onstop=()=>{this.release();if(epoch===this.epoch)void this.transcribe(sessionId,epoch,recorder.mimeType);};
   recorder.onerror=()=>{this.cancel();this.update('录音失败，请检查麦克风后重试。');};
   recorder.start(250);this.state='recording';this.update('正在录音，停止后识别（最多30秒）');
   this.timer=setTimeout(()=>this.finish(),29000);
  }catch(e){if(epoch!==this.epoch)return;this.cancel();throw Error(e instanceof DOMException&&e.name==='NotAllowedError'?'麦克风权限被拒绝，请在地址栏允许麦克风后重试。':'无法打开麦克风，请检查设备连接。');}
 }
 finish(){if(this.recorder?.state==='recording')this.recorder.stop();this.release();}
 cancel(){this.epoch++;this.abort?.abort();this.abort=null;if(this.recorder?.state==='recording')this.recorder.stop();this.recorder=null;this.release();this.chunks=[];this.state='idle';}
 private release(){if(this.timer)clearTimeout(this.timer);this.timer=null;this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;}
 private async transcribe(sessionId:string,epoch:number,mime:string){
  this.state='transcribing';this.update('正在识别普通话，可取消…');const abort=new AbortController();this.abort=abort;
  const timer=setTimeout(()=>abort.abort(),65000);let context:AudioContext|null=null;
  try{
   const blob=new Blob(this.chunks,{type:mime});this.chunks=[];if(blob.size<100)throw Error('录音为空，请重试。');
   context=new AudioContext();const decoded=await context.decodeAudioData(await blob.arrayBuffer());
   if(decoded.duration<=0||decoded.duration>30.5)throw Error('录音需在30秒以内。');
   const offline=new OfflineAudioContext(1,Math.ceil(decoded.duration*16000),16000);const source=offline.createBufferSource();source.buffer=decoded;source.connect(offline.destination);source.start();
   const pcm=(await offline.startRendering()).getChannelData(0);const wav=pcm16Wav(pcm);let raw='';for(const value of new Uint8Array(wav))raw+=String.fromCharCode(value);
   if(epoch!==this.epoch||abort.signal.aborted)return;
   const response=await fetch('/api/speech/asr',{method:'POST',headers:{'content-type':'application/json'},signal:abort.signal,body:JSON.stringify({request_id:crypto.randomUUID(),session_id:sessionId,audio:{encoding:'base64',mime_type:'audio/wav',sample_rate_hz:16000,channels:1,audio_base64:btoa(raw)}})});
   const body=await response.json();if(!response.ok)throw Error(body.error?.code==='asr_not_configured'?'真实ASR尚未配置：请在后端设置 CAMPUS_ASR_URL、CAMPUS_ASR_MODEL 和 CAMPUS_ASR_API_KEY。':body.error?.message??'语音识别失败，请重试。');
   if(epoch!==this.epoch)return;if(!body.text?.trim())throw Error('未识别到文字，请靠近麦克风重试。');this.text(body.text);this.update('识别完成，可编辑文字后发送。');
  }catch(e){if(epoch===this.epoch)this.update(abort.signal.aborted?'识别超时，请重试。':e instanceof Error?e.message:'语音识别失败。');}
  finally{clearTimeout(timer);await context?.close();if(epoch===this.epoch){this.state='idle';this.abort=null;}}
 }
}
export function pcm16Wav(pcm:Float32Array):ArrayBuffer{
 const buffer=new ArrayBuffer(44+pcm.length*2),view=new DataView(buffer);const str=(at:number,s:string)=>{for(let i=0;i<s.length;i++)view.setUint8(at+i,s.charCodeAt(i));};
 str(0,'RIFF');view.setUint32(4,36+pcm.length*2,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,16000,true);view.setUint32(28,32000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,pcm.length*2,true);
 pcm.forEach((v,i)=>view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,v))*(v<0?32768:32767)),true));return buffer;
}
