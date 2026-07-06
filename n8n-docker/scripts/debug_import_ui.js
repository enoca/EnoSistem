const { chromium } = require('playwright');

const EMAIL = 'admin@enoca.com';
const PASSWORD = 'EnocaAdmin2026!';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  await page.goto('http://localhost:5678/signin');
  await page.waitForTimeout(2000);
  await page.fill('input[name="emailOrLdapLoginId"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button:has-text("Sign in")');
  await page.waitForTimeout(5000);
  const getStarted = await page.locator('button:has-text("Get started")').first();
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
    await page.waitForTimeout(2000);
  }

  // workflows listesine git
  await page.goto('http://localhost:5678/workflows');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/debug_workflows_list.png', fullPage: false });

  // Butonları listele
  const buttons = await page.locator('button').evaluateAll(els =>
    els.map(e => ({ text: e.textContent.trim(), ariaLabel: e.getAttribute('aria-label'), title: e.getAttribute('title') }))
  );
  console.log(JSON.stringify(buttons.filter(b => b.text || b.ariaLabel), null, 2));

  await browser.close();
})();
