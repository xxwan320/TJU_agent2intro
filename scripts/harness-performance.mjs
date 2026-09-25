import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={build:'final harness build',device:'Windows Chrome '+await browser.version(),cacheDefinition:'cold = new browser context; warm = same page after first point; backend cache not cleared',samples:[],cancel:null};
for(let sample=0;sample<3;sample++){
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 const select=page.getByRole('combobox',{name:'当前介绍地点'});await select.waitFor();await page.waitForFunction(()=>document.querySelector('[aria-label="当前介绍地点"]')?.options.length>2);
 const ids=await select.locator('option').evaluateAll(xs=>xs.map(x=>x.value).filter(Boolean));
 for(const cache of ['cold','warm']){
  if(cache==='warm')await select.selectOption(ids[1]);
  const start=Date.now();await select.selectOption(ids[0]);await page.locator(`[data-poi-id="${ids[0]}"]`).waitFor();const domMs=Date.now()-start;
  await page.locator('.poi-card').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.poi-card img')].some(i=>i.complete&&i.naturalWidth>0));
  report.samples.push({sample,cache,poiId:ids[0],domMs,imageMs:Date.now()-start});
 }
 if(sample===2){
  await page.locator('.open-guide').click();await page.getByRole('textbox',{name:'对导游说',exact:true}).fill('导航到北洋广场');await page.getByRole('button',{name:'发送',exact:true}).click();
  const stop=page.getByRole('button',{name:'停止工具任务',exact:true});await stop.waitFor();const at=Date.now();await stop.click();await stop.waitFor({state:'hidden'});
  const routeBefore=await page.locator('.explorer').getAttribute('data-route-id');await page.waitForTimeout(1000);assert.equal(await page.locator('.explorer').getAttribute('data-route-id'),routeBefore);
  report.cancel={status:'PASS_REAL',scope:'cancel receipt wait while precise origin absent; no GLM or walking request',uiMs:Date.now()-at-1000,routeAfter:routeBefore};
  await page.screenshot({path:'docs/diagnostics/harness-b/cancel.png',fullPage:true});
 }
 await context.close();
}
report.medians=Object.fromEntries(['cold','warm'].map(cache=>[cache,Object.fromEntries(['domMs','imageMs'].map(metric=>[metric,report.samples.filter(s=>s.cache===cache).map(s=>s[metric]).sort((a,b)=>a-b)[1]]))]));
await fs.writeFile('docs/diagnostics/harness-b/performance-final.json',JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));
