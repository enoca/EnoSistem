const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5678';
const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
const PASSWORD = 'EnocaAdmin2026!';
const EMAIL = 'admin@enoca.com';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function dismissOnboarding(page) {
  const getStarted = await page.locator('button:has-text("Get started")').first();
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
    await page.waitForTimeout(2000);
  }
  // Eğer hala modal varsa Escape ile kapat
  const modal = await page.locator('text=Customize n8n to you').first();
  if (await modal.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();

  // 1. Login
  await page.goto(`${BASE_URL}/signin`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_login_page.png'), fullPage: false });

  await page.fill('input[name="emailOrLdapLoginId"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button:has-text("Sign in")');
  await page.waitForTimeout(5000);
  await dismissOnboarding(page);

  // 2. Dashboard
  await page.goto(`${BASE_URL}/home`);
  await page.waitForTimeout(3000);
  await dismissOnboarding(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_dashboard.png'), fullPage: false });

  // 3. Workflows listesi
  await page.goto(`${BASE_URL}/workflows`);
  await page.waitForTimeout(3000);
  await dismissOnboarding(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_workflows_list.png'), fullPage: false });

  // 4. Yeni workflow editorü
  await page.goto(`${BASE_URL}/workflow/new`);
  await page.waitForTimeout(4000);
  await dismissOnboarding(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_workflow_editor_empty.png'), fullPage: false });

  // 5. Add first trigger node gösterimi
  const addNodeBtn = await page.locator('button:has-text("Add first step")').first();
  if (await addNodeBtn.isVisible().catch(() => false)) {
    await addNodeBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_node_panel.png'), fullPage: false });
  }

  // 6. Executions
  await page.goto(`${BASE_URL}/executions`);
  await page.waitForTimeout(3000);
  await dismissOnboarding(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_executions.png'), fullPage: false });

  // 7. Settings
  await page.goto(`${BASE_URL}/settings`);
  await page.waitForTimeout(3000);
  await dismissOnboarding(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_settings.png'), fullPage: false });

  await browser.close();
  console.log('Screenshots saved to', OUTPUT_DIR);
})();
