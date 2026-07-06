### Task 9: Ana dokümanda terminoloji tutarlılığı sağla

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Standardize term usage with global replacements**

Rules:
- `enoca` (first mention) → `enoca™`
- Subsequent `enoca` → `enoca`
- `n8n platformu` / `n8n AI Agent` → use `n8n platformu` only when describing the platform, otherwise `n8n`.
- `AI Agent` (singular) and `AI Agents` (plural) preferred over bare `Agent`.
- `Webhook` when used as a noun at start of phrase; `webhook` otherwise acceptable.
- `ROI` or `Yatırım Getirisi`; do not mix currency and percentage in same table without labels.

- [ ] **Step 2: Verify key terms**

```bash
grep -ci "enoca™" ENOCA_AI_Otomasyon_Dokumantasyonu.md
```

Expected: at least 10.

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: standardize enoca/n8n/AI Agent terminology in main doc"
```

---
