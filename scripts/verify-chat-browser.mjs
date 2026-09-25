import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root='docs/interaction/20260918-chat';await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),results=[],errors=[];
const p=await browser.newPage({viewport:{width:1366,height:768}});p.on('pageerror',e=>errors.push(e.message));
async function send(text){if(!await p.locator('.tour-panel.open').count())await p.locator('.open-guide').click();await p.getByRole('textbox',{name:'对导游说',exact:true}).fill(text);await p.getByRole('button',{name:'发送',exact:true}).click();}
async function scenario(name,fn){try{results.push({name,pass:true,...await fn()});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:String(e)});console.log('FAIL '+name+': '+e.message);}}
try{
 await p.goto('http://127.0.0.1:8000');await p.locator('.open-guide').click();
 await scenario('roaming avatar cannot intercept composer clicks',async()=>{
  const input=p.getByRole('textbox',{name:'对导游说',exact:true}),r=await input.boundingBox();
  const style=await p.addStyleTag({content:`[data-avatar-roam]{position:fixed!important;left:${r.x+r.width/2-95}px!important;top:${r.y+r.height/2-150}px!important;bottom:auto!important;transform:none!important;z-index:9999!important}`});
  await input.click({timeout:3000});await p.keyboard.type('Hello campus guide');assert.equal(await input.inputValue(),'Hello campus guide');
  const hit=await input.evaluate(e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;});assert.ok(hit);await style.evaluate(e=>e.remove());return {layer:'real hit testing; avatar position forced to cross input'};
 });
 await scenario('broad introduction answers in chat without selecting any place',async()=>{
  assert.equal(await p.locator('.poi-card').count(),0);await send('介绍一下天津大学');
  await p.locator('.tour-chat-history .task-card.complete').last().waitFor({timeout:50000});
  const answer=await p.locator('.tour-chat-history .task-card').last().locator('.task-body').innerText();assert.ok(answer.length>20);assert.ok(!answer.includes('先选择'));assert.equal(await p.locator('.guide-presentation').count(),0);
  await p.screenshot({path:root+'/general-conversation.png',animations:'disabled'});return {layer:'real model stream',answer:answer.slice(0,600)};
 });
 await scenario('ordinary point question establishes context; follow-up introduces with matching image carousel',async()=>{
  await send('郑东图书馆是什么？');await p.locator('.tour-chat-history .task-card').last().waitFor();
  await p.waitForFunction(()=>document.querySelector('.context-chip')?.textContent.includes('郑东图书馆'));
  assert.equal(await p.locator('.guide-presentation').count(),0);
  await send('请进一步介绍');await p.waitForFunction(()=>document.querySelector('.narration-visual img')&&document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing',null,{timeout:45000});
  assert.equal(await p.locator('.poi-card').getAttribute('data-poi-id'),'beiyangyuan-zhengdong-library');
  assert.ok((await p.locator('.tour-chat-history').innerText()).includes('请进一步介绍'));assert.ok((await p.locator('.tour-chat-history').innerText()).includes('北洋园校区图书馆'));
  await p.locator('.open-guide').click();await p.locator('.guide-presentation').screenshot({path:root+'/context-carousel.png'});await p.locator('.open-guide').click();
  return {layer:'real context and real TTS/local point image carousel'};
 });
 await scenario('typing and IME stay usable during narration; controls and next draft survive',async()=>{
  const input=p.getByRole('textbox',{name:'对导游说',exact:true});await input.fill('我还想了解它的建筑');await p.waitForTimeout(900);assert.equal(await input.inputValue(),'我还想了解它的建筑');
  const count=await p.locator('.tour-chat-history .task-card').count();
  await input.fill('停止讲解');await input.dispatchEvent('compositionstart',{data:'解'});await input.press('Enter');assert.equal((await input.inputValue()).trim(),'停止讲解');assert.equal(await p.locator('.tour-chat-history .task-card').count(),count);
  await input.dispatchEvent('compositionend',{data:'解'});await input.press('Enter');await p.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='stopped');
  await input.fill('下一条问题还没发送');await p.waitForTimeout(300);assert.equal(await input.inputValue(),'下一条问题还没发送');return {layer:'real input; composition events simulated, not a human IME session'};
 });
 await scenario('a broad topic clears the old selected-point context for further explanation',async()=>{
  const request=p.waitForRequest(r=>r.url().endsWith('/api/chat/stream'));await send('介绍天津大学的文化');assert.equal((await request).postDataJSON().selected_poi_id,null);
  const follow=p.waitForRequest(r=>r.url().endsWith('/api/chat/stream'));await send('请进一步介绍');assert.equal((await follow).postDataJSON().selected_poi_id,null);assert.equal(await p.locator('.guide-presentation').count(),0);
  await send('停止讲解');return {layer:'real request identity, no old library carousel'};
 });
 await scenario('hung answer and cancel endpoints cannot lock a replacement question',async()=>{
  let release,streamCount=0,cancelCount=0;const gate=new Promise(r=>release=r);
  await p.route('**/api/chat/stream',async r=>{streamCount++;await gate;await r.abort().catch(()=>{});});
  await p.route('**/api/requests/*/cancel',async r=>{cancelCount++;await gate;await r.abort().catch(()=>{});});
  try{await send('我想问一个普通问题');await p.locator('.composer-cancel').waitFor();const at=Date.now();await send('我还想了解学校的历史');
   while(streamCount<2&&Date.now()-at<1500)await p.waitForTimeout(20);assert.equal(streamCount,2);const replacementMs=Date.now()-at;
   await send('停止讲解');await p.locator('.composer-cancel').waitFor({state:'hidden',timeout:1500});await p.waitForFunction(()=>[...document.querySelectorAll('.tour-chat-history .task-card')].at(-1)?.textContent.includes('已停止讲解。'));
   assert.ok(Date.now()-at<1800);assert.ok(cancelCount>0);assert.ok(await p.getByRole('textbox',{name:'对导游说',exact:true}).isEnabled());return {replacementMs,responseMs:Date.now()-at,streamCount,cancelCount,layer:'injected hung HTTP endpoints'};
  }finally{release();await p.unrouteAll({behavior:'wait'});}
 });
 await scenario('40-message history remains bounded and all controls fit at five viewport sizes',async()=>{
  for(let i=0;i<43;i++)await send('停止讲解');assert.equal(await p.locator('.tour-chat-history .task-card').count(),40);
  const sizes=[];for(const size of [{width:1440,height:900},{width:1366,height:768},{width:390,height:844},{width:390,height:500},{width:320,height:568}]){
   await p.setViewportSize(size);const input=p.getByRole('textbox',{name:'对导游说',exact:true});await input.fill('可以继续输入新的问题');
   const d=await input.evaluate(e=>{const r=e.getBoundingClientRect(),panel=e.closest('.tour-panel').getBoundingClientRect();return {top:r.top,bottom:r.bottom,panelBottom:panel.bottom,viewport:innerHeight,body:document.documentElement.scrollWidth,width:innerWidth,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e};});
   assert.ok(d.top>=0&&d.bottom<=d.panelBottom&&d.bottom<=d.viewport&&d.hit);assert.ok(d.body<=d.width);
   const controls=await p.locator('.tour-composer-input,.tour-composer-actions button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),panel=e.closest('.tour-panel').getBoundingClientRect();return {name:e.getAttribute('aria-label'),left:r.left,right:r.right,bottom:r.bottom,inside:r.left>=panel.left&&r.right<=panel.right&&r.bottom<=panel.bottom,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e||e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};}));
   assert.ok(controls.every(c=>c.inside&&c.hit),JSON.stringify(controls));sizes.push({...d,controls});
   await p.screenshot({path:`${root}/dialog-${size.width}-${size.height}.png`,animations:'disabled'});
  }return {sizes,count:await p.locator('.tour-chat-history .task-card').count()};
 });
}finally{await fs.writeFile(root+'/browser-report.json',JSON.stringify({browser:await browser.version(),results,errors},null,2));await browser.close();}
if(results.some(x=>!x.pass)||errors.length)process.exitCode=1;
