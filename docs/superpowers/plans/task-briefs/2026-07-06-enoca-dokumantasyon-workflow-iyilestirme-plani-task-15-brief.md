### Task 15: HTML dokümanlarına meta description ekle

**Files:**
- Modify: all 5 HTML summary files

- [ ] **Step 1: Insert `<meta name="description" ...>` in `<head>` for each file**

Descriptions:
- KEP: `enoca™ KEP Kurumsal E-Ticaret Platformu proje özeti, modüller ve AI otomasyonları.`
- Connector: `enoca™ Connector pazaryeri entegrasyon katmanı dokümantasyonu.`
- EnoPrice: `enoca™ EnoPrice AI destekli dinamik fiyatlandırma ve rekabet analizi sistemi.`
- EnoRep: `enoca™ EnoRep ürün öneri ve kişiselleştirme motoru dokümantasyonu.`
- EnoCart: `enoca™ EnoCart akıllı market arabası ve otomatik teslim sistemi dokümantasyonu.`

- [ ] **Step 2: Verify**

```bash
grep -L '<meta name="description"' KEP_Proje_Dokumanı/ENOCA-KEP-Proje-Ozeti.html Connector_Proje_Dokumanı/enoca_connector_sunum.html Enoprice_Proje_Dokumanı/EnoPrice_Ozet.html EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html
```

Expected: empty list.

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: add meta descriptions to all HTML summaries"
```

---