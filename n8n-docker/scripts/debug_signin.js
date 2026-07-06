const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5678/signin');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'screenshots/debug_signin.png', fullPage: false });
  const inputs = await page.locator('input').evaluateAll(els =>
    els.map(e => ({ type: e.type, name: e.name, placeholder: e.placeholder, id: e.id }))
  );
  const buttons = await page.locator('button').evaluateAll(els =>
    els.map(e => ({ type: e.type, text: e.textContent.trim() }))
  );
  console.log('INPUTS:', JSON.stringify(inputs, null, 2));
  console.log('BUTTONS:', JSON.stringify(buttons, null, 2));
  await browser.close();
})();
