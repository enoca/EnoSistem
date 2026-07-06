### Task 30: Link ve yapısal doğrulama çalıştır

**Files:**
- Create: `scripts/validate_docs.py`

- [ ] **Step 1: Create a validation script**

The script should:
- Verify every HTML file has `<title>`, `<meta name="description">`, `<html lang="tr">` and `<meta charset="UTF-8">`.
- Verify every workflow JSON is valid and has required keys (`name`, `nodes`, `connections`).
- Verify `ENOCA_AI_Otomasyon_Dokumantasyonu.md` has no `(internal)` placeholders.
- Print a summary report.

- [ ] **Step 2: Run the script**

```bash
python3 scripts/validate_docs.py
```

Expected: all checks pass with `OK` status.

- [ ] **Step 3: Commit**

```bash
git add scripts/validate_docs.py && git commit -m "chore: add documentation validation script"
```

---
