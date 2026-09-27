// Run with PLAYWRIGHT_MODULE pointing to an installed playwright package.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({headless:true, args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(process.env.APP_URL || 'http://127.0.0.1:5173');
    await page.getByRole('button',{name:'Fuel injector'}).click();
    await page.getByRole('heading',{name:'Fuel injector',exact:true}).waitFor();
    await page.locator('canvas').waitFor();
    await page.getByRole('button',{name:'Exploded view',exact:true}).click();
    if(await page.getByRole('button',{name:'Exploded view',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Explode did not toggle');
    await page.getByRole('button',{name:'Isolate',exact:true}).click();
    await page.getByRole('button',{name:'Hide component',exact:true}).click();
    await page.getByRole('button',{name:'Reset all'}).click();
    await page.getByRole('heading',{name:'Explore the engine'}).waitFor();
    const health=await page.request.get(new URL('/api/v1/health',page.url()).href);
    if(!health.ok())throw Error('Health check failed');
    await page.waitForTimeout(1500);
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:'/tmp/engine-training-desktop.png',fullPage:true});
    await page.setViewportSize({width:390,height:844});
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile horizontal overflow');
    if(errors.length)throw Error(errors.join('\n'));
    console.log('PASS: catalogue, selection, explode, isolate, hide/reset, API health, mobile width, no page errors');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
