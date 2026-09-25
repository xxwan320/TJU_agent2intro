import {forwardRef,useEffect,useImperativeHandle,useRef,useState,type MutableRefObject} from 'react';

export interface ChatComposerHandle {setText(text:string):void;focus():void}
/** Draft keystrokes stay local; streaming answers and the map cannot reset IME. */
export const ChatComposer=forwardRef<ChatComposerHandle,{
  recording:boolean;transcribing:boolean;busy:boolean;
  draft:MutableRefObject<string>;
  onSubmit(text:string):void;onRecord():void;onCancel():void;onEdit():void;
}>(function ChatComposer({draft,recording,transcribing,busy,onSubmit,onRecord,onCancel,onEdit},ref){
  const [text,updateText]=useState(()=>draft.current),input=useRef<HTMLTextAreaElement>(null),composing=useRef(false);
  const setText=(value:string)=>{draft.current=value;updateText(value);};
  useEffect(()=>{if(draft.current)input.current?.focus();},[]);
  useImperativeHandle(ref,()=>({setText(value){setText(value);input.current?.focus();},focus(){input.current?.focus();}}),[]);
  const send=()=>{if(!text.trim()||composing.current)return;const value=text;setText('');onSubmit(value);};
  return <div className="tour-composer" onClick={event=>{if(!(event.target as HTMLElement).closest('button'))input.current?.focus();}}>
    <textarea ref={input} id="tour-composer-input" className="tour-composer-input" rows={2} maxLength={8000} value={text}
      placeholder="直接问我，不用先选地点" aria-label="对导游说" onChange={event=>{setText(event.target.value);onEdit();}}
      onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={()=>{composing.current=false;}}
      onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing&&event.keyCode!==229&&!composing.current){event.preventDefault();send();}}}/>
    <div className="tour-composer-actions"><button type="button" className={'composer-icon mic'+(recording?' recording':'')} aria-label={recording?'停止录音并识别':'语音输入'} disabled={transcribing} onClick={onRecord}><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{recording?<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>:<><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>}</svg></button>
      <span className="composer-key-hint">Enter 发送 · Shift+Enter 换行</span>
      {busy&&<button type="button" className="composer-cancel" aria-label="取消本次回答" onClick={onCancel}>停止</button>}
      <button type="button" className="composer-icon send" aria-label="发送" title={busy?'发送新问题并停止旧回答':'发送'} disabled={!text.trim()} onClick={send}>↑</button>
    </div>
  </div>;
});
