import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
const report={scope:'real ordinary chat, one explicit greeting request, speech off',requests:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')report.requests.push(new URL(r.url()).pathname);});
try{
 await page.goto('http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});await page.locator('.open-guide').click();
 const at=Date.now();await page.getByRole('textbox',{name:'对导游说',exact:true}).fill('你好，请用一句话打个招呼。');await page.getByRole('button',{name:'发送',exact:true}).click();
 await page.locator('.task-card.complete .task-body').waitFor({timeout:46000});
 report.answer=await page.locator('.task-card.complete .task-body').last().innerText();assert.ok(report.answer.trim().length>2);report.elapsedMs=Date.now()-at;report.status='PASS_REAL';
 await page.screenshot({path:'docs/diagnostics/ab-closeout/20260925-closeout/chat.png',fullPage:true});
}catch(e){report.status='FAIL';report.error=String(e);report.visible=await page.locator('.task-card').allTextContents();process.exitCode=1;}
finally{await fs.writeFile('docs/diagnostics/ab-closeout/20260925-closeout/chat.json',JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
