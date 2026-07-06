const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5678/setup');
  await page.waitForTimeout(4000);
  const inputs = await page.locator('input').evaluateAll(els =>
    els.map(e => ({
      type: e.type,
      name: e.name,
      placeholder: e.placeholder,
      id: e.id,
      autocomplete: e.autocomplete
    }))
  );
  console.log(JSON.stringify(inputs, null, 2));
  await browser.close();
})();
