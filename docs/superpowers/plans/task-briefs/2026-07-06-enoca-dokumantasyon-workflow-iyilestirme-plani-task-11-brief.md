### Task 11: Tarih formatını standartlaştır

**Files:**
- Modify: all HTML summary files
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Choose and document the standard**

Use `25 Haziran 2026` for Turkish prose and `2026-06-25` for machine-readable metadata.

- [ ] **Step 2: Add `<meta name="date" content="2026-06-25">` to each HTML `<head>`**

Files:
- `KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html`
- `Connector_Proje Dokümanı/enoca_connector_sunum.html`
- `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`

- [ ] **Step 3: Update any visible date strings to the chosen format**

- [ ] **Step 4: Verify**

```bash
grep -L '<meta name="date"' KEP_Proje_Dokumanı/ENOCA-KEP-Proje-Ozeti.html Connector_Proje_Dokumanı/enoca_connector_sunum.html Enoprice_Proje_Dokumanı/EnoPrice_Ozet.html EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html
```

Expected: empty list.

- [ ] **Step 5: Commit**

```bash
git commit -am "docs: standardize date metadata across HTML summaries"
```

---