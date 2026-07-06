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

  await page.goto('http://localhost:5678/workflows');
  await page.waitForTimeout(3000);

  await page.locator('[aria-label="Add new item"]').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/debug_add_menu.png', fullPage: false });

  // Menü öğelerini listele
  const items = await page.locator('[role="menuitem"]').evaluateAll(els =>
    els.map(e => e.textContent.trim())
  );
  console.log(JSON.stringify(items, null, 2));

  await browser.close();
})();
