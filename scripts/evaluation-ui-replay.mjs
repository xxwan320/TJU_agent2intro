import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
const root='docs/interaction/20260917-functional',results=[],requests=[];
let asrMode='success';
await page.route('**/api/speech/asr',async route=>{
 const body=route.request().postDataJSON();requests.push({encoding:body.audio.encoding,mime:body.audio.mime_type,sampleRate:body.audio.sample_rate_hz,channels:body.audio.channels,bytes:Buffer.from(body.audio.audio_base64,'base64').length});
 if(asrMode==='unconfigured'){await route.continue();return;}
 if(asrMode==='late')await new Promise(r=>setTimeout(r,700));
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({request_id:body.request_id,text:'我想去郑东图书馆，请帮我规划路线。',is_final:true})});
});
await page.addInitScript(()=>localStorage.setItem('ai4tju.r2.preferences',JSON.stringify({campus:'beiyangyuan',speechMode:'off'})));
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
 await page.locator('[data-avatar-hit]').first().click();
 // The page's existing avatar hit-area toggles the same composer panel.
 await page.getByRole('button',{name:'语音输入',exact:true}).waitFor({state:'visible'});
 await page.getByRole('button',{name:'语音输入',exact:true}).click();
 await page.getByText('正在录音，停止后识别（最多30秒）',{exact:false}).waitFor();await page.waitForTimeout(600);
 const stoppedAt=performance.now();await page.getByRole('button',{name:'停止录音并识别',exact:true}).click();
 await page.getByText('识别完成，可编辑文字后发送。',{exact:false}).waitFor();
 results.push({id:'U08-fixture',stopToEditableMs:performance.now()-stoppedAt,text:await page.getByLabel('对导游说',{exact:true}).inputValue(),evidence:'browser + mock ASR; fake microphone'});
 await page.getByLabel('对导游说',{exact:true}).fill('北洋园校区何时投入使用？');
 await page.getByRole('button',{name:'发送',exact:true}).click();
 await page.locator('.task-body').filter({hasText:'2015年9月'}).waitFor();
 results.push({id:'edited-send',answer:await page.locator('.task-body').last().innerText(),evidence:'browser + local answer; no model call'});
 asrMode='late';await page.getByRole('button',{name:'语音输入',exact:true}).click();await page.waitForTimeout(600);await page.getByRole('button',{name:'停止录音并识别',exact:true}).click();
 await page.getByLabel('对导游说',{exact:true}).fill('取消后保留的新输入');await page.waitForTimeout(1000);
 results.push({id:'cancel-late',retained:await page.getByLabel('对导游说',{exact:true}).inputValue()});
 asrMode='unconfigured';await page.getByRole('button',{name:'语音输入',exact:true}).click();await page.waitForTimeout(600);await page.getByRole('button',{name:'停止录音并识别',exact:true}).click();
 await page.getByText('真实ASR尚未配置：',{exact:false}).waitFor();
 results.push({id:'real-asr-config',status:'BLOCKED',message:await page.getByText('真实ASR尚未配置：',{exact:false}).innerText(),evidence:'live_http; fake microphone'});
 await page.screenshot({path:`${root}/asr-browser.png`,fullPage:true});
}catch(e){results.push({error:e.message,body:await page.locator('body').innerText()});await page.screenshot({path:`${root}/asr-browser-failure.png`,fullPage:true});}
finally{await fs.writeFile(`${root}/asr-browser-final.json`,JSON.stringify({results,requests},null,2));await browser.close();}
