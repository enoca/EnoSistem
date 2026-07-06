const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5678/setup');
  await page.waitForTimeout(3000);
  const html = await page.content();
  console.log(html.substring(0, 8000));
  await browser.close();
})();
