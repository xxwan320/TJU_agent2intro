import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
const root='docs/diagnostics/ab-closeout/20260925-closeout';
const source=await fs.readFile('frontend/src/ui/tour-photos.ts','utf8');
const {tourPhotoFor}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const report={scope:'real DOM/images; map network intentionally blocked for zero-cost selection tests; session response deliberately delayed',cases:[],errors:[],samples:[],network:[]};
page.on('pageerror',e=>report.errors.push(e.message));
await page.route('**/api/maps/amap/**',r=>r.abort());
await page.route('**/api/speech/tts',r=>r.abort());
await page.addInitScript(()=>localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'})));
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 const select=page.getByRole('combobox',{name:'当前介绍地点'});await select.waitFor();
 for(let round=0;round<3;round++){
  for(const [id,name] of [['beiyangyuan-zhengdong-library','郑东图书馆'],['beiyangyuan-datong-center','大通学生中心'],['beiyangyuan-zhengdong-library','郑东图书馆']]){
   const expected=tourPhotoFor(id,name);assert.equal(Boolean(expected.placeholder),false);
   const at=Date.now();await select.selectOption(id);const card=page.locator(`.poi-card[data-poi-id="${id}"]`);await card.waitFor();assert.match(await card.innerText(),new RegExp(name));const domMs=Date.now()-at;
   await card.scrollIntoViewIfNeeded();await page.waitForFunction(({id,src})=>{const card=document.querySelector(`.poi-card[data-poi-id="${id}"]`);return [...(card?.querySelectorAll('img')??[])].some(img=>new URL(img.currentSrc).pathname===src&&img.complete&&img.naturalWidth>0&&img.getBoundingClientRect().width>0);},{id,src:expected.src});
   report.samples.push({round,id,expectedSrc:expected.src,domMs,imageMs:Date.now()-at,cache:round===0?'first pass':'warm'});
   if(round===0)await card.screenshot({path:root+'/'+id+'.png'});
  }
 }
 report.cases.push({id:'C01',status:'PASS_REAL',scope:'exact current card text and original mapped decoded image; map marker not asserted in this offline-map scenario'});
 let release,held;const waiting=new Promise(r=>held=r),gate=new Promise(r=>release=r);let runs=0;
 page.on('request',r=>{if(new URL(r.url()).pathname==='/api/harness/runs')runs++;});
 await page.route('**/api/harness/sessions',async route=>{const response=await route.fetch();held();await gate;await route.fulfill({response});});
 await page.locator('.open-guide').click();await page.getByRole('button',{name:'选择文档（TXT/MD）',exact:true}).click();await waiting;
 await page.getByRole('button',{name:'停止工具任务',exact:true}).click();release();await page.waitForTimeout(500);
 assert.equal(runs,0);assert.equal(await page.getByRole('button',{name:'停止工具任务',exact:true}).count(),0);
 report.cases.push({id:'C12',status:'PASS_REAL',scope:'real browser stop during delayed real session response; zero run submissions',runs});
 await page.screenshot({path:root+'/cancel-before-session.png',fullPage:true});
}catch(e){report.failure=String(e);process.exitCode=1;}
finally{await fs.writeFile(root+'/local-browser.json',JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
