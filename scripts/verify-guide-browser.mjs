import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root='docs/interaction/20260918-ui-sync';await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={browser:await browser.version(),mode:'real Chrome, real backend, real TTS, local point image carousel',scenarios:[],errors:[]};
async function makePage(viewport={width:1440,height:900}){
 const page=await browser.newPage({viewport});page.on('pageerror',e=>report.errors.push(e.message));
 await page.addInitScript(()=>{window.__mediaEvents=[];const play=HTMLMediaElement.prototype.play,seen=new WeakSet();HTMLMediaElement.prototype.play=function(){if(!seen.has(this)){seen.add(this);for(const event of ['playing','pause','ended','loadedmetadata','error'])this.addEventListener(event,()=>window.__mediaEvents.push({event,tag:this.tagName,at:performance.now(),time:this.currentTime,src:this.currentSrc,muted:this.muted}));}return play.call(this);};});
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});await page.locator('.poi-list button').first().waitFor();return page;
}
async function send(page,text){
 if(!await page.locator('.tour-panel.open').count())await page.locator('.open-guide').click();
 await page.getByRole('textbox',{name:'对导游说',exact:true}).fill(text);await page.getByRole('button',{name:'发送',exact:true}).click();
}
async function dimensions(page){return page.evaluate(()=>{
 const card=document.querySelector('.poi-card'),r=card.getBoundingClientRect();
 return {viewport:innerWidth,body:document.documentElement.scrollWidth,card:{width:r.width,height:r.height,client:card.clientHeight,scroll:card.scrollHeight},children:[...card.querySelectorAll('.poi-profile,.poi-actions')].map(e=>({name:e.className,...e.getBoundingClientRect().toJSON()})),images:[...card.querySelectorAll('.narration-visual img')].map(img=>({src:img.getAttribute('src'),alt:img.getAttribute('alt')}))};
});}
async function scenario(name,fn){try{const data=await fn();report.scenarios.push({name,pass:true,...data});console.log('PASS '+name);}catch(e){report.scenarios.push({name,pass:false,error:String(e)});console.log('FAIL '+name+': '+e.message);}}
let page;
try{
 page=await makePage();
 await scenario('named introduction switches to correct campus and rotates matching point images',async()=>{
  await send(page,'介绍一下郑东图书馆');
  await page.locator('[data-poi-id="beiyangyuan-zhengdong-library"]').waitFor({timeout:12000});
  await page.locator('.narration-visual img').waitFor({timeout:12000});
  await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing',null,{timeout:40000});
  const first=await page.locator('.narration-visual img').getAttribute('src');await page.waitForFunction(src=>document.querySelector('.narration-visual img')?.getAttribute('src')!==src,first,{timeout:7000});
  if(await page.locator('.tour-panel.open').count())await page.locator('.open-guide').click();
  assert.equal(await page.locator('.narration-visual video').count(),0);assert.equal(await page.locator('.narration-visual img').count(),1);
  const trace=await page.evaluate(()=>window.__guideTrace),speech=trace.find(e=>e.event==='speech.speaking');assert.ok(speech);
  await page.locator('.guide-presentation').screenshot({path:root+'/holding-detail.png'});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:root+'/desktop-playing-1440.png',fullPage:true});
  return {first,second:await page.locator('.narration-visual img').getAttribute('src'),origin:'point-specific local images rotate during real narration',dimensions:await dimensions(page)};
 });
 await scenario('pause freezes the carousel and resume continues it',async()=>{
  await page.locator('.poi-actions button').first().click();await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='paused');
  const before=await page.locator('.narration-visual img').getAttribute('src');await page.waitForTimeout(5000);assert.equal(await page.locator('.narration-visual img').getAttribute('src'),before);
  await page.locator('.poi-actions button').first().click();await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing');
  await page.waitForFunction(src=>document.querySelector('.narration-visual img')?.getAttribute('src')!==src,before,{timeout:7000});
  return {pausedImage:before,resumedImage:await page.locator('.narration-visual img').getAttribute('src')};
 });
 await scenario('audio segment changes retain one point carousel',async()=>{
  await page.waitForFunction(()=>new Set(window.__guideTrace.filter(e=>e.event==='speech.speaking').map(e=>e.utterance)).size>=2,null,{timeout:35000});
  assert.equal(await page.locator('.narration-visual img').count(),1);assert.match(await page.locator('.media-caption').innerText(),/图片轮播/);
  return {image:await page.locator('.narration-visual img').getAttribute('src')};
 });
 await scenario('stop freezes the carousel on a stable image',async()=>{
  await page.locator('.narration-controls').getByRole('button',{name:'停止讲解',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='stopped');
  const image=await page.locator('.narration-visual img').getAttribute('src');await page.waitForTimeout(5000);assert.equal(await page.locator('.narration-visual img').getAttribute('src'),image);return {image};
 });
 await scenario('here introduction uses current selection and local point images',async()=>{
  await send(page,'介绍一下这里');await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing',null,{timeout:40000});
  await page.locator('.narration-visual img').waitFor();
  await send(page,'暂停');await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='paused');
  await send(page,'继续');await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing');
  await send(page,'停止讲解');await page.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='stopped');
  return {image:await page.locator('.narration-visual img').getAttribute('src')};
 });
 await scenario('selecting and navigating do not start narration',async()=>{
  await page.getByRole('combobox',{name:'当前介绍地点'}).selectOption('beiyangyuan-datong-center');
  assert.equal(await page.locator('.guide-presentation').count(),0);
  const count=await page.evaluate(()=>window.__guideTrace.filter(e=>e.event==='introduction.request').length);
  await send(page,'导航到郑东图书馆');await page.waitForTimeout(800);
  assert.equal(await page.evaluate(()=>window.__guideTrace.filter(e=>e.event==='introduction.request').length),count);
  return {narrations:count};
 });
 await fs.writeFile(root+'/real-media-events.json',JSON.stringify(await page.evaluate(()=>({trace:window.__guideTrace,media:window.__mediaEvents})),null,2));
 for(const size of [{width:1440,height:900},{width:1366,height:768},{width:390,height:844}])await scenario(`layout ${size.width}x${size.height}`,async()=>{
  const p=await makePage(size);await p.getByRole('combobox',{name:'浏览校区'}).selectOption('beiyangyuan');
  await p.getByRole('combobox',{name:'当前介绍地点'}).selectOption('beiyangyuan-zhengdong-library');
  await p.locator('.poi-profile img').evaluate(img=>img.decode());
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${root}/card-${size.width}.png`,fullPage:true});
  const d=await dimensions(p);assert.ok(d.card.height>250);assert.ok(d.card.scroll<=d.card.client+2);assert.ok(d.body<=size.width+1);
  assert.ok(!/资料查询：|已取得依据|未取得依据|核查通过|资料待核验/.test(await p.locator('body').innerText()));
  await p.locator('.poi-actions button').first().click();await p.waitForFunction(()=>document.querySelector('.narration-visual img')&&document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing',null,{timeout:40000});
  await p.locator('.guide-presentation').scrollIntoViewIfNeeded();
  const boxes=await p.evaluate(()=>{const a=document.querySelector('.narration-visual').getBoundingClientRect(),b=document.querySelector('.guide-presentation>header').getBoundingClientRect();return {mediaTop:a.top,headerBottom:b.bottom};});assert.ok(boxes.mediaTop>=boxes.headerBottom);
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${root}/playing-${size.width}.png`,fullPage:true});
  const playing=await dimensions(p);assert.ok(playing.body<=size.width+1);await p.close();return {dimensions:d,playing};
 });
}finally{await fs.writeFile(root+'/browser-report.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report.scenarios.map(({name,pass,error,...data})=>({name,pass,error,startupDeltaMs:data.startupDeltaMs,cachedStartupDeltaMs:data.cachedStartupDeltaMs,pauseResponseMs:data.pauseResponseMs,stopResponseMs:data.stopResponseMs})),null,2));
if(report.scenarios.some(s=>!s.pass)||report.errors.length)process.exitCode=1;
