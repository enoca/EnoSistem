const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5678/setup');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'screenshots/debug_setup.png', fullPage: false });
  const buttons = await page.locator('button').evaluateAll(els =>
    els.map(e => ({
      type: e.type,
      text: e.textContent.trim(),
      class: e.className
    }))
  );
  console.log(JSON.stringify(buttons, null, 2));
  await browser.close();
})();
