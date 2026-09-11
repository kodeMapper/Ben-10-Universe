const { chromium } = require('C:/Users/Sarang Gade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page = await browser.newPage();
 const errors=[];
 page.on('pageerror', e=>errors.push(e.message));
 const files=['index.html', ...fs.readdirSync('HTML').filter(x=>x.endsWith('.html')).map(x=>'HTML/'+x)];
 const failures=[];
 for(const width of [320,375,390,768,1440]) {
  await page.setViewportSize({width,height:900});
  for(const file of files) {
   await page.goto('http://127.0.0.1:4173/'+file,{waitUntil:'domcontentloaded'});
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1, bad:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.right>innerWidth+1||r.left< -1)}).slice(0,8).map(e=>e.tagName+'.'+e.className)}));
   if(result.overflow) failures.push({file,width,...result});
  }
 }
 for(const file of ['index.html','HTML/canTransform.html','HTML/villans.html']) {
  await page.goto('http://127.0.0.1:4173/'+file);
  const track=page.locator('.carousel-ready');
  const count=await track.locator(':scope > *').count();
  const visible=()=>track.locator(':scope > :not([hidden])');
  await track.focus(); await page.keyboard.press('ArrowLeft');
  if(await visible().getAttribute('aria-label')!==`${count} of ${count}`) failures.push('previous wrap '+file);
  await track.focus(); await page.keyboard.press('ArrowRight');
  if(await visible().getAttribute('aria-label')!==`1 of ${count}`) failures.push('next wrap '+file);
  for(let i=1;i<count;i++) { await track.focus(); await page.keyboard.press('ArrowRight'); }
  await track.focus(); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
  if(await visible().getAttribute('aria-label')!==`2 of ${count}`) failures.push('keyboard '+file);
  await track.dispatchEvent('pointerdown',{pointerType:'touch',clientX:250,clientY:100});
  await track.dispatchEvent('pointerup',{pointerType:'touch',clientX:100,clientY:105});
  if(await visible().getAttribute('aria-label')!==`3 of ${count}`) failures.push('swipe '+file);
 }
 await page.goto('http://127.0.0.1:4173/index.html');
 await page.getByRole('button',{name:'Show slide 5',exact:true}).click();
 if(await page.locator('.slider > :not([hidden])').getAttribute('aria-label')!=='5 of 5') failures.push('numbered buttons');
 await page.getByRole('button',{name:'Next menu item'}).click();
 await page.locator('#menu-item').click();
 if(!page.url().endsWith('#slider-section')) failures.push('dial Explore');
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:4173/index.html');
 await page.screenshot({path:'tests/home-mobile.png',fullPage:true});
 await page.goto('http://127.0.0.1:4173/HTML/canTransform.html');
 await page.screenshot({path:'tests/aliens-mobile.png',fullPage:true});
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:320,height:800}});
 await nojs.goto('http://127.0.0.1:4173/HTML/canTransform.html');
 if(await nojs.locator('.alien-card:visible').count()<2) failures.push('no JS fallback');
 console.log(JSON.stringify({failures,errors,pages:files.length,widths:5},null,2));
 await browser.close();
 if(failures.length||errors.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
