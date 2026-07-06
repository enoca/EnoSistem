const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5678';
const WORKFLOWS_DIR = path.join(__dirname, '..', 'workflows');
const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
const PASSWORD = 'EnocaAdmin2026!';
const EMAIL = 'admin@enoca.com';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function login(page) {
  await page.goto(`${BASE_URL}/signin`);
  await page.waitForTimeout(2000);
  await page.fill('input[name="emailOrLdapLoginId"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button:has-text("Sign in")');
  await page.waitForTimeout(5000);
  // Onboarding modalını kapat
  const getStarted = await page.locator('button:has-text("Get started")').first();
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
    await page.waitForTimeout(2000);
  }
}

async function importWorkflow(page, filePath, outputName) {
  await page.goto(`${BASE_URL}/workflow/new`);
  await page.waitForTimeout(3000);

  // Options menüsünden Import from File seç
  const optionsBtn = await page.locator('[data-test-id="workflow-menu"]').first();
  if (await optionsBtn.isVisible().catch(() => false)) {
    await optionsBtn.click();
    await page.waitForTimeout(500);
    const importBtn = await page.locator('text=Import from File').first();
    if (await importBtn.isVisible().catch(() => false)) {
      await importBtn.click();
    }
  } else {
    // Alternatif: doğrudan menüde arama
    const moreBtn = await page.locator('button[aria-label="Workflow menu"]').first();
    if (await moreBtn.isVisible().catch(() => false)) {
      await moreBtn.click();
      await page.waitForTimeout(500);
      await page.locator('text=Import from File').first().click().catch(() => {});
    }
  }

  await page.waitForTimeout(1000);

  // File picker
  const fileInput = await page.locator('input[type="file"]').first();
  if (await fileInput.isVisible().catch(() => false)) {
    await fileInput.setInputFiles(filePath);
  }

  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, outputName), fullPage: false });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();

  await login(page);

  const workflowFiles = [];
  function findWorkflows(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findWorkflows(fullPath);
      } else if (entry.name.endsWith('.json')) {
        workflowFiles.push(fullPath);
      }
    }
  }
  findWorkflows(WORKFLOWS_DIR);

  for (const file of workflowFiles) {
    const baseName = path.basename(file, '.json');
    const outputName = `wf_${baseName}.png`;
    console.log(`Importing ${baseName}...`);
    try {
      await importWorkflow(page, file, outputName);
    } catch (err) {
      console.error(`Failed ${baseName}:`, err.message);
    }
  }

  await browser.close();
  console.log('Done');
})();
