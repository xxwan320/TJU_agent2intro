import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root='docs/diagnostics/ab-closeout/20260925-closeout',browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}});
const report={status:'NOT_RUN',mapCalls:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{const path=new URL(r.url()).pathname;if(/maps|walking|place/.test(path))report.mapCalls.push({path,at:Date.now()});});

const budgetFile='docs/diagnostics/ab-closeout/20260925-closeout/browser-calls.json';
let callBudget;try{callBudget=JSON.parse(await fs.readFile(budgetFile,'utf8'));}catch{callBudget={tts:0,walking:0,poi:0,modelTasks:0,requests:[],blocked:[]};}
await page.route('**/*',async route=>{
 const req=route.request(),u=new URL(req.url());let kind=null;
 if(u.pathname==='/api/speech/tts')kind='tts';
 if(u.pathname.includes('/direction/walking'))kind='walking';
 if(u.pathname.includes('/place/text'))kind='poi';
 if(u.pathname==='/api/harness/runs'&&!req.postDataJSON()?.direct)kind='modelTasks';
 if(kind){const limit={tts:2,walking:2,poi:4,modelTasks:4}[kind];
  if(callBudget[kind]>=limit){callBudget.blocked.push({kind,path:u.pathname});await fs.writeFile(budgetFile,JSON.stringify(callBudget,null,2));return route.abort();}
  callBudget[kind]++;callBudget.requests.push({kind,path:u.pathname,at:new Date().toISOString()});await fs.writeFile(budgetFile,JSON.stringify(callBudget,null,2));
 }
 return route.continue();
});
await page.addInitScript(()=>localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'})));
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='在地图选择起点')?.disabled,null,{timeout:35000});
 await page.getByRole('button',{name:'在地图选择起点',exact:true}).click();await page.locator('.online-map-host').click({position:{x:350,y:210}});
 await page.locator('.open-guide').click();const start=Date.now();
 await page.getByRole('textbox',{name:'对导游说',exact:true}).fill('导航到郑东图书馆');await page.getByRole('button',{name:'发送',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.explorer')?.getAttribute('data-route-status')==='ready',null,{timeout:35000});
 await page.getByRole('button',{name:'停止工具任务',exact:true}).waitFor({state:'hidden',timeout:12000});
 report.elapsedMs=Date.now()-start;report.answer=await page.locator('.task-card[role="status"]').innerText();assert.match(report.answer,/已完成/);
 report.routeId=await page.locator('.explorer').getAttribute('data-route-id');assert.ok(report.routeId);
 await page.locator('.open-guide').click();await page.getByRole('combobox',{name:'当前介绍地点'}).selectOption('beiyangyuan-datong-center');assert.equal(await page.locator('.explorer').getAttribute('data-route-id'),report.routeId);
 report.selectionPreservesRoute=true;report.canvasCount=await page.locator('.online-map-host canvas').count();report.status='PASS_REAL';
}catch(e){report.status='FAIL';report.error=String(e);report.visibleErrors=await page.locator('.route-error,.map-empty.overlay').allTextContents();}
await page.screenshot({path:root+'/route.png',fullPage:true});await fs.writeFile(root+'/route-browser.json',JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));
