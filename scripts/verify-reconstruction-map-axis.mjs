import {fileURLToPath} from 'node:url';import * as nodePath from 'node:path';
const projectRoot=fileURLToPath(new URL('..',import.meta.url));
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(nodePath.join(projectRoot,'package.json'));
const {chromium}=require('playwright-core');
const out=nodePath.join(projectRoot,'docs/diagnostics/3d-agent-completion/20260926-strict/ui');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-backgrounding-occluded-windows']});
const page=await browser.newPage({viewport:{width:1500,height:1000},locale:'zh-CN'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'})));
const result={scope:'real AMap customCoords axis/metre/camera probe; no building quality acceptance',errors};
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2500);
 const buttons=await page.getByRole('button').allTextContents();console.log(JSON.stringify({mapButtons:buttons.filter(x=>/地图|在线|建模/.test(x))}));
 const online=page.getByRole('button',{name:'在线地图',exact:true});if(await online.count())await online.click();
 await page.waitForFunction(()=>!!window.AMap?.Map,{timeout:30000});
 result.probe=await page.evaluate(async()=>{const center=[117.3138,38.9978],host=document.createElement('div');host.id='axis-probe';Object.assign(host.style,{position:'fixed',inset:'30px',zIndex:'9999',background:'white'});document.body.append(host);const m=new window.AMap.Map(host,{viewMode:'3D',center,zoom:18,pitch:45,rotation:0});await new Promise(resolve=>{m.on('complete',resolve);setTimeout(resolve,8000);});const c=m.customCoords;const east=[center[0]+10/(111319.490793*Math.cos(center[1]*Math.PI/180)),center[1]],north=[center[0],center[1]+10/111319.490793];c.setCenter(center);const positions=c.lngLatsToCoords([center,east,north]);const report={origin:center,positions,eastDelta:positions[1].map((v,i)=>v-positions[0][i]),northDelta:positions[2].map((v,i)=>v-positions[0][i]),camera:c.getCameraParams(),zoom:m.getZoom(),pitch:m.getPitch(),rotation:m.getRotation()};window.__axisProbe={map:m,host};return report;});
 await page.screenshot({path:out+'/map-axis-probe.png'});
}catch(e){result.failure=String(e);process.exitCode=1;}finally{await fs.writeFile(out+'/map-axis-probe.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
