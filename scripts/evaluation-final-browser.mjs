// Final React DOM / player regression. Synthesized tone fixture is NOT TTS evidence.
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const root='docs/interaction/20260917-functional';
const wav=Buffer.alloc(44+16000*2*4);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);for(let i=0;i<64000;i++)wav.writeInt16LE(Math.round(Math.sin(i/16000*440*Math.PI*2)*3000),44+i*2);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),result={evidence:'browser + synthetic audio fixture; no external TTS/model/map calls'},tts=[];
await page.route('**/api/speech/tts',async route=>{const b=route.request().postDataJSON();tts.push({text:b.text,voice:b.voice_id,requestId:b.request_id});await route.fulfill({json:{request_id:b.request_id,utterance_id:b.utterance_id,audio_url:'/api/speech/audio/fixture',mime_type:'audio/wav',timestamps:'none'}});});
await page.route('**/api/speech/audio/fixture',r=>r.fulfill({contentType:'audio/wav',body:wav}));
await page.route('**/api/speech/voices',r=>r.fulfill({json:{status:'ready',voices:[{id:'edge:zh-CN-XiaoxiaoNeural',name:'普通话',locale:'zh-CN',provider:'edge'}]}}));
await page.addInitScript(()=>{localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'}));window.__events=[];window.__deny=false;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__player=this;for(const event of ['playing','pause','timeupdate'])this.addEventListener(event,()=>window.__events.push({event,time:this.currentTime,at:performance.now()}),{once:true});if(window.__deny&&this.src.startsWith('blob:')){window.__deny=false;return Promise.reject(new DOMException('fixture permission denial','NotAllowedError'));}return play.call(this);};});
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 result.build=await page.locator('script[type=module]').getAttribute('src');
 const disk=await fs.readFile('dist'+result.build),served=await(await page.request.get('http://127.0.0.1:8000'+result.build)).body();result.servedMatchesDist=Buffer.compare(disk,served)===0;result.sha256=crypto.createHash('sha256').update(served).digest('hex');
 result.images=[];for(const name of ['大通学生中心','郑东图书馆','大通学生中心']){await page.locator('.poi-list button').filter({hasText:name}).click();await page.locator('.tour-carousel img').evaluateAll(xs=>Promise.all(xs.map(x=>x.decode().catch(()=>{}))));result.images.push({name,poiId:await page.locator('[data-poi-id]').first().getAttribute('data-poi-id'),images:await page.locator('.tour-carousel img').evaluateAll(xs=>xs.map(x=>({src:x.getAttribute('src'),width:x.naturalWidth})))});}
 const start=()=>page.getByRole('button',{name:'开始讲解',exact:true}).click();
 await start();await page.waitForFunction(()=>window.__player?.currentTime>0);await page.locator('.poi-list button').filter({hasText:'郑东图书馆'}).click();await page.waitForTimeout(250);result.switchStopped=await page.evaluate(()=>window.__player.paused);
 await start();await page.waitForFunction(()=>window.__player?.currentTime>0);await page.getByRole('button',{name:'停止讲解',exact:true}).click();await page.waitForTimeout(250);result.stopPaused=await page.evaluate(()=>window.__player.paused);
 await page.locator('.poi-list button').filter({hasText:'尚贤石'}).click();await page.evaluate(()=>window.__deny=true);await start();await page.getByRole('button',{name:'再次播放声音',exact:true}).waitFor();result.permissionRecoveryVisible=true;await page.getByRole('button',{name:'再次播放声音',exact:true}).click();await page.waitForFunction(()=>window.__player?.currentTime>0);result.recovered=true;
 await page.getByRole('button',{name:'停止讲解',exact:true}).click();result.events=await page.evaluate(()=>window.__events);result.tts=tts;
 await page.screenshot({path:`${root}/final-browser.png`,fullPage:true});
}catch(e){result.error=e.message;result.body=await page.locator('body').innerText();}finally{await fs.writeFile(`${root}/final-browser.json`,JSON.stringify(result,null,2));await browser.close();}
