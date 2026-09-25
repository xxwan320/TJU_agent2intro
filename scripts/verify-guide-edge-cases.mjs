// Real Chrome/backend/TTS. Explicit fault injection only in named media cases.
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root='docs/interaction/20260918-ui-sync',results=[];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-audio-capture='+path.resolve('.runtime/intro-synthetic.wav')]});
async function page(){const p=await browser.newPage({viewport:{width:1366,height:768}});await p.addInitScript(()=>localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan'})));await p.goto('http://127.0.0.1:8000');await p.getByRole('combobox',{name:'当前介绍地点'}).selectOption('beiyangyuan-zhengdong-library');return p;}
async function start(p){await p.locator('.poi-actions button').first().click();await p.waitForFunction(()=>document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing',null,{timeout:40000});}
async function check(name,fn){try{results.push({name,pass:true,...await fn()});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:String(e)});console.log('FAIL '+name+' '+e.message);}}
try{
 await check('point introduction uses its complete local image set while real TTS plays',async()=>{
  const p=await page();try{await p.getByRole('combobox',{name:'当前介绍地点'}).selectOption('beiyangyuan-datong-center');await start(p);assert.equal(await p.locator('.narration-visual video').count(),0);assert.equal(await p.locator('.narration-visual img').count(),1);assert.equal(await p.locator('.media-dots button').count(),2);await p.locator('.guide-presentation').screenshot({path:root+'/point-image-carousel.png'});return {layer:'two local point images with real TTS'};}finally{await p.close();}
 });
 await check('rapid switch replaces the carousel with the second place image set',async()=>{
  const p=await page();try{
   await p.locator('.poi-actions button').first().click();await p.locator('.guide-presentation').waitFor();
   await p.getByRole('combobox',{name:'当前介绍地点'}).selectOption('beiyangyuan-datong-center');await start(p);
   assert.equal(await p.locator('.poi-card').getAttribute('data-poi-id'),'beiyangyuan-datong-center');assert.match(await p.locator('.narration-visual img').getAttribute('alt'),/大通学生中心/);
   const traces=await p.evaluate(()=>window.__guideTrace);return {layer:'local image identity and actual new TTS',traces};
  }finally{await p.close();}
 });
 await check('collapsing freezes the carousel and expanding resumes it',async()=>{
  const p=await page();try{await start(p);const before=await p.locator('.narration-visual img').getAttribute('src');await p.getByRole('button',{name:'收起画面',exact:true}).click();await p.waitForTimeout(5000);await p.getByRole('button',{name:'展开画面',exact:true}).click();assert.equal(await p.locator('.narration-visual img').getAttribute('src'),before);await p.waitForFunction(src=>document.querySelector('.narration-visual img')?.getAttribute('src')!==src,before,{timeout:7000});return {before,after:await p.locator('.narration-visual img').getAttribute('src')};}finally{await p.close();}
 });
 await check('synthetic Mandarin travels through Chrome recorder, real ASR, confirmation and same introduction session',async()=>{
  const p=await page();try{
   await p.locator('.open-guide').click();await p.getByRole('button',{name:'语音输入',exact:true}).click();await p.getByRole('button',{name:'停止录音并识别',exact:true}).waitFor();await p.waitForTimeout(4800);await p.getByRole('button',{name:'停止录音并识别',exact:true}).click();
   const input=p.getByRole('textbox',{name:'对导游说',exact:true});await p.waitForFunction(()=>document.querySelector('textarea[aria-label="对导游说"]')?.value.includes('介绍'),null,{timeout:70000});const recognized=await input.inputValue();assert.match(recognized,/介绍.*这里/);
   await p.getByRole('button',{name:'发送',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.narration-visual img')&&document.querySelector('.guide-presentation')?.dataset.narrationStatus==='playing',null,{timeout:40000});
   await p.screenshot({path:root+'/synthetic-voice-flow.png',fullPage:true});return {recognized,layer:'Chrome fake capture of TTS WAV → MediaRecorder → real faster-whisper CPU → confirmed UI send → real TTS/image carousel. No human microphone or speaker-acoustic claim.'};
  }finally{await p.close();}
 });
}finally{await fs.writeFile(root+'/edge-case-report.json',JSON.stringify({browser:await browser.version(),results},null,2));await browser.close();}
if(results.some(r=>!r.pass))process.exitCode=1;
