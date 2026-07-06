### Task 31: Workflow JSON'larını n8n şemasına göre doğrula

**Files:**
- All `n8n-docker/workflows/**/*.json`

- [ ] **Step 1: Validate JSON with jq**

```bash
find n8n-docker/workflows -name '*.json' -exec jq empty {} \;
```

Expected: no output (success).

- [ ] **Step 2: Spot-check one workflow in n8n UI**

Import `n8n-docker/workflows/kep/KEP-AI-001_Siparis_Isleme.json` into a local n8n instance and ensure it loads without schema errors.

---
