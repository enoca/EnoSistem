### Task 5: Ana dokümandaki internal link yer tutucularını düzelt

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 14.2 / around lines 2847–2851)

- [ ] **Step 1: Find current placeholders**

```bash
grep -n "(internal)" ENOCA_AI_Otomasyon_Dokumantasyonu.md
```

- [ ] **Step 2: Replace with relative file paths**

Replace any `(internal)` references in section 14.2 with the corresponding relative paths:

- KEP Proje Özeti → `KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html`
- Connector Proje Dokümanı → `Connector_Proje Dokümanı/enoca_connector_sunum.html`
- EnoPrice Proje Özeti → `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- EnoRep Proje Raporu → `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- EnoCart Dokümantasyonu → `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`
- n8n Kullanıcı Dokümantasyonu → `ENOCA_n8n_Detayli_Kullanici_Dokumantasyonu.md`

- [ ] **Step 3: Verify no `(internal)` remains**

```bash
grep -c "(internal)" ENOCA_AI_Otomasyon_Dokumantasyonu.md
```

Expected: `0`.

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: replace internal link placeholders with relative paths"
```

---
