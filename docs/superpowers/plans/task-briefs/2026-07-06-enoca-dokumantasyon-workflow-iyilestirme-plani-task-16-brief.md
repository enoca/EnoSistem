### Task 16: Modül numaralandırmasını standartlaştır

**Files:**
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`
- Modify: `KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html`

- [ ] **Step 1: Audit current module numbering**

```bash
grep -n "Modül [0-9]" KEP_Proje_Dokumanı/ENOCA-KEP-Proje-Ozeti.html Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html
```

- [ ] **Step 2: Ensure sequential numbering starting at 1 with no gaps**

For EnoRep, if keeping 11 modules, update heading text from "12 Modül" to "11 Modül".

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: standardize module numbering across project summaries"
```

---