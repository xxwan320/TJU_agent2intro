import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
const label=process.argv[2]??'after',root='docs/interaction/20260918-chat';await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),p=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>{window.__perf={long:[],inputs:[],latencies:[]};new PerformanceObserver(l=>window.__perf.long.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});document.addEventListener('input',e=>{if(e.target.matches('textarea')){window.__perf.inputs.push(performance.now());requestAnimationFrame(()=>window.__perf.latencies.push(performance.now()-e.timeStamp));}});});
try{
 await p.goto('http://127.0.0.1:8000');await p.locator('.open-guide').click();await p.waitForTimeout(1500);
 const bounds=await p.evaluate(()=>Object.fromEntries(['.tour-panel','.tour-panel-body','.tour-voice','.tour-chat-history','.tour-composer','textarea[aria-label="对导游说"]'].map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return [s,{...r.toJSON(),hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.outerHTML.slice(0,160)}];})));
 await p.getByRole('textbox',{name:'对导游说',exact:true}).click();await p.keyboard.type('Hello campus guide, can you introduce Tianjin University?',{delay:15});
 const input=await p.getByRole('textbox',{name:'对导游说',exact:true}).inputValue();await p.getByRole('textbox',{name:'对导游说',exact:true}).fill('介绍一下天津大学');await p.getByRole('button',{name:'发送',exact:true}).click();await p.waitForTimeout(1000);
 await p.screenshot({path:root+'/'+label+'-dialog.png',animations:'disabled'});
 const report={label,browser:await browser.version(),input,bounds,visibleText:await p.locator('.tour-panel').innerText(),perf:await p.evaluate(()=>window.__perf),errors};await fs.writeFile(root+'/'+label+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify({bounds,visibleText:report.visibleText,errors,input,latencies:report.perf.latencies},null,2));
}finally{await browser.close();}
