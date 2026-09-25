import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
const root='docs/interaction/20260917-functional';
const suffix=process.argv.includes('--final')?'-final':'';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const events=[],requests=[],result={};
page.on('console',msg=>{if(msg.type()==='error')events.push(msg.text().replace(/key=[^&\s]+/g,'key=REDACTED'));});
page.on('pageerror',e=>events.push(e.message));
page.on('requestfailed',r=>events.push(new URL(r.url()).pathname+':'+r.failure()?.errorText));
page.on('request',r=>requests.push({path:new URL(r.url()).pathname,at:performance.now()}));
await page.addInitScript(()=>localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'})));
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 const must=page.getByLabel('必去地点（最多5处）'),avoid=page.getByLabel('避开参观点（不安排停留）');
 await must.selectOption(['beiyangyuan-datong-center','beiyangyuan-zhengdong-library']);
 await avoid.selectOption('beiyangyuan-datong-center');
 result.conflict={disabled:await page.getByRole('button',{name:'安排我的行程',exact:true}).isDisabled(),text:await page.getByRole('alert').allTextContents()};
 await avoid.selectOption([]);
 try{
  await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='在地图选择起点')?.disabled,{},{timeout:35000});
  result.mapReady=true;
  await page.getByRole('button',{name:'在地图选择起点',exact:true}).click();
  await page.locator('.online-map-host').click({position:{x:350,y:210}});
  result.origin=await page.locator('.location-panel').innerText();
 }catch{result.mapReady=false;}
 const start=performance.now();await page.getByRole('button',{name:'安排我的行程',exact:true}).click();
 await page.getByRole('region',{name:'结构化行程卡'}).waitFor({timeout:15000}).catch(()=>{});
 result.draftMs=performance.now()-start;
 if(result.mapReady){try{await page.getByText('行程路线已显示；各站使用实际步行路径，入口通行仍需现场确认。',{exact:true}).waitFor({timeout:35000});result.mapAppliedMs=performance.now()-start;}catch{result.mapAppliedMs=null;}}
 result.body=await page.locator('body').innerText();
 result.canvasCount=await page.locator('.online-map-host canvas').count();
 await page.screenshot({path:`${root}/route-browser${suffix}.png`,fullPage:true});
 if(suffix&&result.mapAppliedMs){
  result.routeId=await page.locator('.explorer').getAttribute('data-route-id');
  await page.locator('.poi-list button').filter({hasText:'大通学生中心'}).click();
  await page.locator('.poi-list button').filter({hasText:'郑东图书馆'}).click();
  result.selectionKeepsRoute=result.routeId===await page.locator('.explorer').getAttribute('data-route-id');
  result.hotRouteMs=[];
  for(let i=0;i<3;i++){
   const prior=await page.locator('.explorer').getAttribute('data-route-id'),at=performance.now();
   await page.getByRole('button',{name:'重新规划行程路线',exact:true}).click();
   await page.waitForFunction(old=>{const el=document.querySelector('.explorer');return el?.getAttribute('data-route-status')==='ready'&&el?.getAttribute('data-route-id')!==old;},prior);
   result.hotRouteMs.push(performance.now()-at);
  }
  await page.getByRole('button',{name:'清空路线',exact:true}).click();await page.waitForTimeout(500);
  result.cleared=!(await page.locator('.explorer').getAttribute('data-route-id'));
 }
 await fs.writeFile(`${root}/route-browser${suffix}.json`,JSON.stringify({result,events,requests},null,2));
}finally{await browser.close();}
