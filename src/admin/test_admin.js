const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));
  
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  // assume localStorage admin_auth
  await page.evaluate(() => localStorage.setItem('admin_auth', 'true'));
  await page.goto('http://localhost:3000/admin#/orders', { waitUntil: 'networkidle2' });
  
  // wait for datagrid
  await new Promise(r => setTimeout(r, 2000));
  console.log("Datagrid loaded");
  
  // click first row show button
  const buttons = await page.$$('a[aria-label="Show"]');
  if (buttons.length > 0) {
      await buttons[0].click();
      await new Promise(r => setTimeout(r, 2000));
      console.log("Clicked show");
  } else {
      console.log("No show buttons found");
  }
  
  await browser.close();
})();
