import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
const phase=process.argv[2]??'before';
const root='docs/interaction/20260917-functional';
await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const calls=[];
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>errors.push(r.url().split('?')[0]+':'+r.failure()?.errorText));
page.on('request',r=>{if(/\/api\/(speech\/tts|chat|maps)/.test(r.url()))calls.push({url:r.url().split('?')[0],method:r.method()});});
await page.addInitScript(()=>{localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'}));window.__audio=[];const original=HTMLMediaElement.prototype.play;const seen=new WeakSet();HTMLMediaElement.prototype.play=function(){if(!seen.has(this)){seen.add(this);for(const kind of ['playing','pause','ended','error','timeupdate'])this.addEventListener(kind,()=>window.__audio.push({kind,time:this.currentTime,muted:this.muted,volume:this.volume,at:performance.now()}));}return original.call(this);};});
try {
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(2000);
 await fs.writeFile(`${root}/${phase}-dom.txt`,await page.locator('body').innerText());
 await page.screenshot({path:`${root}/${phase}-page.png`,fullPage:true});
 const samples=[];
 for(const name of ['大通学生中心','郑东图书馆','尚贤石']){
  const buttons=page.locator('.poi-list button').filter({hasText:name});
  if(!await buttons.count()){samples.push({name,status:'NOT_FOUND'});continue;}
  const times=[];
  for(let i=0;i<3;i++){
   const start=performance.now();await buttons.first().click();
   await page.locator('[data-poi-id]').filter({hasText:name}).first().waitFor({timeout:10000});
   times.push(performance.now()-start);
  }
  await page.locator('.tour-carousel img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode().catch(()=>{}))));
  samples.push({name,times,details:await page.locator('[data-poi-id]').allTextContents(),images:await page.locator('.tour-carousel img').evaluateAll(nodes=>nodes.map(n=>({src:n.getAttribute('src'),width:n.naturalWidth})))});
 }
 const play=page.getByRole('button',{name:'开始讲解',exact:true});
 const playback=[];
 if(await play.count()){
  if(phase==='before'){await play.first().click();await page.waitForTimeout(1200);}
  else for(let i=0;i<3;i++){
   await page.evaluate(()=>{window.__audio=[];window.__playClick=performance.now();});await play.first().click();
   try{await page.waitForFunction(()=>window.__audio.some(e=>e.kind==='timeupdate'&&e.time>0),{},{timeout:35000});playback.push(await page.evaluate(()=>({status:'PASS',firstPlayingMs:window.__audio.find(e=>e.kind==='playing')?.at-window.__playClick,events:window.__audio})));}
   catch{playback.push({status:'FAIL',text:await page.locator('.poi-speech-status').innerText()});}
   await page.getByRole('button',{name:'停止讲解',exact:true}).click();await page.waitForTimeout(400);
  }
 }
 await fs.writeFile(`${root}/${phase}-result.json`,JSON.stringify({phase,samples,calls,errors,playback,audio:await page.evaluate(()=>window.__audio),body:await page.locator('body').innerText()},null,2));
 await page.screenshot({path:`${root}/${phase}-selected.png`,fullPage:true});
}finally{await browser.close();}
