### Task 27: Cross-project orchestration workflow'ları oluştur

**Files:**
- Create: `n8n-docker/workflows/cross-project/CROSS-AI-001_Supervisor_Agent.json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 9)

- [ ] **Step 1: Define Supervisor Agent orchestration flow**

The workflow receives a request, classifies the intent, and dispatches to the correct project-specific sub-workflow via HTTP Request nodes.

- [ ] **Step 2: Create JSON file**

- [ ] **Step 3: Validate JSON**

```bash
jq empty n8n-docker/workflows/cross-project/CROSS-AI-001_Supervisor_Agent.json && echo OK
```

- [ ] **Step 4: Commit**

```bash
git add n8n-docker/workflows/cross-project/ ENOCA_AI_Otomasyon_Dokumantasyonu.md && git commit -m "feat(workflows): add cross-project supervisor orchestration workflow"
```

---
