### Task 7: EnoPrice ve EnoCart HTML'lerine versiyon/tarih bilgisi ekle

**Files:**
- Modify: `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`

- [ ] **Step 1: Add version/date pill to EnoPrice header**

Insert after line 55 (the badge line):

```html
<div style="margin-top:1rem;color:#94a3b8;font-size:.9rem;">Versiyon 1.0 · 25 Haziran 2026</div>
```

- [ ] **Step 2: Add version/date element to EnoCart header**

Insert after the header subtitle a small version line:

```html
<p style="margin-top:1rem;opacity:.8;font-size:.9rem;">Versiyon 1.0 · 25 Haziran 2026</p>
```

- [ ] **Step 3: Grep verify**

```bash
grep -n "Versiyon 1.0" Enoprice_Proje_Dokumanı/EnoPrice_Ozet.html Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html
```

Expected: two line numbers.

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: add version and date to EnoPrice and EnoCart HTML summaries"
```

---
