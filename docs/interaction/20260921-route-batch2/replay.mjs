import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const dir='docs/interaction/20260921-route-batch2';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const report={errors:[],rounds:[]};page.on('pageerror',e=>report.errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:8000');await page.getByLabel('常用起点').waitFor();
 await page.locator('.tour-input summary').click();
 await page.getByLabel('从哪里出发').selectOption('weijinlu-09-teaching');
 await page.getByLabel('最后到哪里').selectOption('weijinlu-history-museum');
 await page.getByLabel('必去地点 1',{exact:true}).selectOption('weijinlu-09-teaching');
 await page.getByLabel('避开参观点 1',{exact:true}).selectOption('weijinlu-gym');
 await page.getByLabel('步行上限（分钟，选填）').fill('30');
 for(let round=0;round<3;round++){
  const created=page.waitForResponse(r=>r.url().endsWith('/api/tours')&&r.request().method()==='POST');
  const begun=Date.now();
  if(round===0)await page.getByRole('button',{name:'安排我的行程',exact:true}).click();
  else {await page.getByRole('button',{name:'换一批站点',exact:true}).click();await page.getByRole('button',{name:'确认换一批（先取消当前行程）',exact:true}).click();}
  const response=await created;const data=await response.json();assert.equal(response.status(),200);
  const ids=data.session.plan.stops.map(s=>s.poi_id);assert.equal(ids[0],'weijinlu-09-teaching');assert.equal(ids.at(-1),'weijinlu-history-museum');assert.ok(!ids.includes('weijinlu-gym'));
  if(round)assert.notDeepEqual(ids,report.rounds.at(-1).ids);
  await page.getByRole('button',{name:'确认草稿并同步路线',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.explorer')?.dataset.routeStatus==='ready'||!!document.querySelector('.route-error'),null,{timeout:60000});
  const routeError=await page.locator('.route-error').allTextContents();
  report.rounds.push({ids,elapsedMs:Date.now()-begun,routeError,route:await page.locator('.route-result').innerText().catch(()=>null)});
  assert.equal(routeError.length,0);assert.ok(report.rounds.at(-1).route?.includes('行程路线已显示'));
 }
 report.background=await page.locator('.r2-shell').evaluate(el=>({image:getComputedStyle(el,'::before').backgroundImage,filter:getComputedStyle(el,'::before').filter}));
 report.originCount=await page.getByLabel('常用起点').locator('option').count();
 await page.locator('.tour-input summary').click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:dir+'/desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:dir+'/mobile.png',fullPage:true});
 report.mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
}catch(e){report.failure=e.message;await page.screenshot({path:dir+'/failure.png',fullPage:true});throw e;}
finally{await fs.writeFile(dir+'/live.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();}
