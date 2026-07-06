### Task 2: `n8n-docker/.env` dosyasını Git geçmişinden çıkar

**Files:**
- Modify: `.gitignore` (already covered in Task 1.1)
- Delete from index: `n8n-docker/.env`

> **Warning:** This removes the file only from future commits. Historical commits may still contain secrets; full history scrubbing (BFG / `git filter-repo`) is out of scope for this plan and should be handled separately if the repo has been public.

- [ ] **Step 1: Remove from index but keep local copy**

```bash
git rm --cached n8n-docker/.env
```

- [ ] **Step 2: Verify it is untracked and ignored**

```bash
git status --short n8n-docker/.env
```

Expected: no output (file is ignored and not staged).

- [ ] **Step 3: Commit**

```bash
git commit -m "security: remove n8n-docker/.env from Git index"
```

---

