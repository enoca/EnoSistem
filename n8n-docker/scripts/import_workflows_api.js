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
  const getStarted = await page.locator('button:has-text("Get started")').first();
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
    await page.waitForTimeout(2000);
  }
}

async function importAndScreenshot(page, filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const workflow = JSON.parse(raw);

  // API'ye uygun hale getir
  const payload = {
    name: workflow.name,
    nodes: workflow.nodes || [],
    connections: workflow.connections || {},
    settings: workflow.settings || {},
    staticData: workflow.staticData || null,
    tags: workflow.tags || []
  };

  const response = await page.evaluate(async ({ url, body }) => {
    const res = await fetch(`${url}/rest/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return { status: res.status, body: await res.json() };
  }, { url: BASE_URL, body: payload });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`API error ${response.status}: ${JSON.stringify(response.body)}`);
  }

  const workflowId = response.body.id || response.body.data?.id;
  if (!workflowId) {
    throw new Error('No workflow id returned');
  }

  await page.goto(`${BASE_URL}/workflow/${workflowId}`);
  await page.waitForTimeout(4000);

  const baseName = path.basename(filePath, '.json');
  const outputName = `wf_${baseName}.png`;
  await page.screenshot({ path: path.join(OUTPUT_DIR, outputName), fullPage: false });
  console.log(`Saved ${outputName}`);
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
    try {
      await importAndScreenshot(page, file);
    } catch (err) {
      console.error(`Failed ${path.basename(file)}:`, err.message);
    }
  }

  await browser.close();
  console.log('Done');
})();
