### Task 4: Ana dokümana versiyon geçmişi ve tutarlı başlık ekle

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Insert version history block directly under the existing header lines**

Existing header:

```markdown
# enoca™ AI Otomasyon Sistemi Dokümantasyonu

**Versiyon:** 1.0  
**Tarih:** 25 Haziran 2026  
**Platform:** n8n + AI Agents  
**Hazırlayan:** enoca™ Analiz ve AR-GE Ekibi
```

Append immediately after:

```markdown

**Versiyon Geçmişi**

| Versiyon | Tarih | Değişiklikler | Yazar |
|----------|-------|---------------|-------|
| 1.0 | 2026-06-25 | İlk sürüm: 32 AI otomasyon senaryosu, mimari ve entegrasyon dokümantasyonu | enoca™ Analiz ve AR-GE Ekibi |
| 1.1 | 2026-07-06 | Tutarlılık düzeltmeleri, güvenlik/altyapı iyileştirmeleri, workflow kataloğu güncellemeleri | enoca™ Dokümantasyon Ekibi |
```

- [ ] **Step 2: Grep to verify**

```bash
grep -n "Versiyon Geçmişi" ENOCA_AI_Otomasyon_Dokumantasyonu.md
```

Expected: line number printed.

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: add version history to main automation document"
```

---
