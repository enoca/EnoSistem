### Task 8: Connector ve KEP HTML'lerindeki "otomatik olarak oluşturulmuştur" notunu kaldır

**Files:**
- Modify: `Connector_Proje Dokümanı/enoca_connector_sunum.html`
- Modify: `KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html`

- [ ] **Step 1: Locate the generated-by notes**

```bash
grep -n "otomatik olarak oluşturulmuştur" Connector_Proje_Dokumanı/enoca_connector_sunum.html KEP_Proje_Dokumanı/ENOCA-KEP-Proje-Ozeti.html
```

- [ ] **Step 2: Remove or replace the note**

Replace with:

```html
<p><small>Doküman enoca™ Analiz ve AR-GE Ekibi tarafından hazırlanmıştır.</small></p>
```

- [ ] **Step 3: Verify**

```bash
grep -c "otomatik olarak oluşturulmuştur" Connector_Proje_Dokumanı/enoca_connector_sunum.html KEP_Proje_Dokumanı/ENOCA-KEP-Proje-Ozeti.html
```

Expected: `0` for both.

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: remove auto-generated notes from Connector and KEP summaries"
```

---
