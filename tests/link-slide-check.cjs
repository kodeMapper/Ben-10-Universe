const { chromium } = require('C:/Users/Sarang Gade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:320,height:700}}); const failures=[];
for(const file of ['index.html',...fs.readdirSync('HTML').filter(f=>f.endsWith('.html')).map(f=>'HTML/'+f)]) {
 await p.goto('http://127.0.0.1:4173/'+file);
 const links=await p.locator('a[href]').evaluateAll(as=>as.map(a=>a.href).filter(h=>h.startsWith(location.origin)));
 for(const link of links){const r=await p.request.get(link); if(!r.ok())failures.push({link,status:r.status()});}
 const count=await p.locator('.carousel-ready > *').count();
 for(let i=0;i<Math.max(count,1);i++) {
  const issues=await p.evaluate(()=>[...document.querySelectorAll('section, img, video, iframe, .carousel-ready > :not([hidden])')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)}).map(e=>e.outerHTML.slice(0,100)));
  if(issues.length)failures.push({file,i,issues});
  if(count) { await p.locator('.carousel-ready').focus(); await p.keyboard.press('ArrowRight'); }
 }
 const broken=await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.src.startsWith(location.origin)&&(!i.complete||!i.naturalWidth)).map(i=>i.src));
 if(broken.length)failures.push({file,broken});
}
await p.setViewportSize({width:1440,height:900});await p.goto('http://127.0.0.1:4173/index.html');await p.screenshot({path:'tests/home-desktop.png',fullPage:true});
console.log(JSON.stringify({failures},null,2));await b.close(); if(failures.length)process.exitCode=1;
})();
