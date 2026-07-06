# enoca™ Dokümantasyon & Workflow İyileştirme Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut dokümantasyon ve n8n workflow kataloğundaki tutarsızlıkları, eksikleri ve güvenlik/altyapı sorunlarını gidermek; 32 otomasyon senaryosunu doküman ve JSON workflow olarak tamamlamak.

**Architecture:** Dört fazlı ilerleme: (1) kritik düzeltmeler ve güvenlik, (2) standartlaştırma, (3) görsel/erişilebilirlik parlatma, (4) eksik workflow'ların dokümana ve JSON'a dökülmesi. Her faz bağımsız review edilebilir; her değişiklik sonrası DOCX çıktıları yeniden üretilir.

**Tech Stack:** Markdown, HTML5/CSS, Python 3 (`python-docx`), n8n workflow JSON, Docker Compose, Git.

---

## Mevcut Durum Özeti

| Alan | Hedef | Mevcut | Eksik |
|------|-------|--------|-------|
| Ana AI otomasyon dokümanı | v1.0 tam ve tutarlı | v1.0, 2.877 satır | Versiyon geçmişi, internal linkler, terminoloji |
| Proje özet dokümanları | 5 proje, tutarlı format | 5 HTML + DOCX | Tarih/versiyon, ekip, link, TOC, meta eksiklikleri |
| KEP workflow'ları | 8 | 4 | AI-005..AI-008 |
| Connector workflow'ları | 6 | 2 | CONN-AI-003..CONN-AI-006 |
| EnoPrice workflow'ları | 7 | 1 | ENOPRICE-AI-002..AI-007 |
| EnoRep workflow'ları | 6 | 2 | ENOREP-AI-003..AI-006 |
| EnoCart workflow'ları | 5 | 1 | ENOCART-AI-002..AI-005 |
| Cross-project workflow'ları | N/A | 0 | En az 1 orchestration workflow |
| Altyapı/güvenlik | Üretime hazır | .env repoda, .gitignore yok, prometheus.yml yok | Hemen düzeltilmeli |

---

## Faz 1: Kritik Düzeltmeler ve Güvenlik (1–2 gün)

### Task 1: Repo köküne `.gitignore` ekle

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Write `.gitignore` content**

```gitignore
# OS
.DS_Store
Thumbs.db

# Environment & secrets
.env
*.env
.env.*
!n8n-docker/.env.example

# Office temp files
~$*.docx
~$*.xlsx
~$*.pptx
*.tmp

# Python
__pycache__/
*.py[cod]
*.egg-info/
.pytest_cache/

# Logs
*.log
logs/

# n8n runtime
n8n-docker/.n8n/
n8n-docker/postgres_data/
n8n-docker/redis_data/
```

- [ ] **Step 2: Stage and verify**

```bash
git add .gitignore
git check-ignore -v n8n-docker/.env
```

Expected output: a rule line referencing `.gitignore`.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: add .gitignore for env, OS and Python artifacts"
```

---

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

### Task 3: Monitoring altyapısını düzelt veya kaldır

**Files:**
- Create (option A): `n8n-docker/prometheus/prometheus.yml`
- Modify (option B): `n8n-docker/docker-compose.yml`

**Decision:** Option A is recommended; a minimal Prometheus config keeps the monitoring profile useful.

- [ ] **Step 1: Create `prometheus.yml`**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'n8n'
    static_configs:
      - targets: ['n8n:5678']
    metrics_path: /metrics
```

- [ ] **Step 2: Verify Compose syntax**

```bash
cd n8n-docker && docker-compose --profile monitoring config > /dev/null
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add n8n-docker/prometheus/prometheus.yml
git commit -m "infra: add minimal prometheus.yml for monitoring profile"
```

---

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

### Task 6: EnoRep modül sayısı ve devre dışı linkleri düzelt

**Files:**
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`

- [ ] **Step 1: Locate disabled links**

```bash
grep -n "disabled" EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html
```

- [ ] **Step 2: Replace `class="doc-link disabled"` with active classes and correct relative paths**

For each disabled link, set `href` to the correct file path and remove `disabled` class. Example transformation:

```html
<!-- Before -->
<a href="#" class="doc-link disabled">KEP Entegrasyon Kılavuzu</a>

<!-- After -->
<a href="../KEP_Proje%20Dokümanı/ENOCA-KEP-Proje-Ozeti.html" class="doc-link">KEP Entegrasyon Kılavuzu</a>
```

- [ ] **Step 3: Fix module count mismatch**

The document states 12 modules but lists 11. Either:

- Add a 12th module section, or
- Change the heading text to "11 Modül".

- [ ] **Step 4: Verify no `disabled` class remains and module count is consistent**

```bash
grep -c "disabled" EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html
```

Expected: `0`.

- [ ] **Step 5: Commit**

```bash
git commit -am "docs: fix EnoRep disabled links and module count"
```

---

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

## Faz 2: Standartlaştırma (3–5 gün)

### Task 10: Ortak terminoloji sözlüğü ekle

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Insert a "Terminoloji ve Kısaltmalar" subsection under section 1**

```markdown
### 1.4 Terminoloji ve Kısaltmalar

| Terim | Açıklama |
|-------|----------|
| enoca™ | enoca e-ticaret ekosistemi markası |
| n8n | Açık kaynak workflow otomasyon platformu |
| AI Agent | LLM tabanlı karar veya eylem agent'ı |
| Webhook | HTTP tabanlı gerçek zamanlı olay bildirimi |
| ROI | Return on Investment / Yatırım Getirisi |
| CLV | Customer Lifetime Value / Müşteri Yaşam Boyu Değeri |
| RFM | Recency, Frequency, Monetary |
```

- [ ] **Step 2: Commit**

```bash
git commit -am "docs: add terminology glossary to main document"
```

---

### Task 11: Tarih formatını standartlaştır

**Files:**
- Modify: all HTML summary files
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Choose and document the standard**

Use `25 Haziran 2026` for Turkish prose and `2026-06-25` for machine-readable metadata.

- [ ] **Step 2: Add `<meta name="date" content="2026-06-25">` to each HTML `<head>`**

Files:
- `KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html`
- `Connector_Proje Dokümanı/enoca_connector_sunum.html`
- `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`

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

### Task 12: Ekip bilgisi formatını standartlaştır

**Files:**
- Modify: all HTML summary files
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Define the standard footer format**

```markdown
## Ekip

| İsim | Rol | Sorumluluk Alanı |
|------|-----|------------------|
| ... | ... | ... |
```

- [ ] **Step 2: Add or replace team sections in each HTML with the same table structure**

For HTML, render the table as `<table class="team">` with the same columns.

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: standardize team/contributor section format"
```

---

### Task 13: İletişim bilgisi eklenmemiş dokümanlara ekle

**Files:**
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- Modify: `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`

- [ ] **Step 1: Add contact footer**

```html
<footer>
  <p>İletişim: <a href="mailto:contact@enoca.com">contact@enoca.com</a></p>
</footer>
```

- [ ] **Step 2: Verify**

```bash
grep -L "contact@enoca.com" EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html Enoprice_Proje_Dokumanı/EnoPrice_Ozet.html Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html
```

Expected: empty list.

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: add contact info to EnoRep, EnoPrice and EnoCart summaries"
```

---

### Task 14: HTML dokümanlarına içindekiler (TOC) ekle

**Files:**
- Modify: `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`

- [ ] **Step 1: For each HTML, identify `<h2>` elements and generate an ordered TOC**

- [ ] **Step 2: Insert the TOC near the top of `<body>` inside a `<nav>` element**

Example snippet:

```html
<nav aria-label="İçindekiler">
  <h2>İçindekiler</h2>
  <ol>
    <li><a href="#genel-bakis">Genel Bakış</a></li>
    ...
  </ol>
</nav>
```

Ensure every `<h2>` has a matching `id`.

- [ ] **Step 3: Verify anchor coverage**

```bash
python3 - <<'PY'
import re, pathlib
for p in ['Enoprice_Proje_Dokumanı/EnoPrice_Ozet.html','Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html','EnoRep_Proje_Dokumanı/EnoRep_Proje_Raporu.html']:
    html = pathlib.Path(p).read_text(encoding='utf-8')
    h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.S)
    ids = set(re.findall(r'id="([^"]+)"', html))
    missing = [h for h in h2s if re.sub(r'[^\w\s-]','',h).strip().lower().replace(' ','-') not in ids]
    print(p, len(h2s), 'missing ids:', len(missing))
PY
```

Expected: `missing ids: 0` for all files.

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: add table of contents to HTML summaries"
```

---

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

### Task 16: Modül numaralandırmasını standartlaştır

**Files:**
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`
- Modify: `KEP_Proje Dokümanı/ENOCA-KEP-Proje-Ozeti.html`

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

## Faz 3: Görsel Parlatma (1 hafta)

### Task 17: Paylaşılan tasarım tokenleri ve CSS dosyası oluştur

**Files:**
- Create: `docs/assets/enoca-docs.css`

- [ ] **Step 1: Create shared CSS with variables**

```css
:root{
  --enoca-primary:#1a56db;
  --enoca-secondary:#0891b2;
  --enoca-accent:#4f8cff;
  --enoca-success:#059669;
  --enoca-warning:#d97706;
  --enoca-danger:#dc2626;
  --enoca-bg:#0f172a;
  --enoca-ink:#f8fafc;
  --enoca-muted:#94a3b8;
  --enoca-line:#334155;
  --enoca-radius:12px;
  --enoca-shadow:0 10px 30px rgba(0,0,0,.25);
}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:var(--enoca-ink);background:var(--enoca-bg);}
.container{max-width:1200px;margin:0 auto;padding:2rem;}
... /* additional shared utilities */
```

- [ ] **Step 2: Commit**

```bash
git add docs/assets/enoca-docs.css && git commit -m "style: add shared enoca documentation CSS tokens"
```

---

### Task 18: HTML dokümanlarında renk paletini standartlaştır

**Files:**
- Modify: all 5 HTML summary files

- [ ] **Step 1: Replace local `:root` color variables with the shared palette**

Keep structural rules, but align primary/accent/success/warning/danger colors to the shared CSS tokens.

- [ ] **Step 2: Commit**

```bash
git commit -am "style: align HTML summary color palettes with shared tokens"
```

---

### Task 19: EnoCart'taki emojileri SVG ikonlarla değiştir

**Files:**
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`

- [ ] **Step 1: Find emoji characters**

```bash
grep -oP '[\x{1F300}-\x{1F9FF}]' Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html | sort -u
```

- [ ] **Step 2: Replace each emoji with a semantic `<svg>` icon or Font Awesome icon**

Example:

```html
<!-- Before -->
<h2>🛒 Sepet Deneyimi</h2>

<!-- After -->
<h2><i class="fas fa-shopping-cart" aria-hidden="true"></i> Sepet Deneyimi</h2>
```

- [ ] **Step 3: Verify no emoji remains**

```bash
python3 - <<'PY'
import re, pathlib
html = pathlib.Path('Enocart_Proje_Dokumanı/EnoCart_Dokumantasyon.html').read_text(encoding='utf-8')
emojis = re.findall(r'[\U0001F300-\U0001F9FF]', html)
print('remaining emojis:', len(emojis))
PY
```

Expected: `0`.

- [ ] **Step 4: Commit**

```bash
git commit -am "style: replace emojis with accessible icons in EnoCart docs"
```

---

### Task 20: Responsive breakpoint'leri standartlaştır

**Files:**
- Modify: all 5 HTML summary files

- [ ] **Step 1: Use `@media (max-width: 960px)` as the standard mobile breakpoint**

Replace any 1024px or 768px breakpoints with 960px unless a component specifically needs another value.

- [ ] **Step 2: Commit**

```bash
git commit -am "style: standardize responsive breakpoints to 960px"
```

---

### Task 21: Mimari diyagramları SVG olarak ekle

**Files:**
- Create: `docs/assets/diagrams/enoprice-architecture.svg`
- Modify: `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Create a minimal SVG architecture diagram for EnoPrice**

The SVG should show: data sources → n8n → Gemini → price decision → KEP/API.

- [ ] **Step 2: Embed or link the SVG in EnoPrice HTML**

```html
<img src="../../docs/assets/diagrams/enoprice-architecture.svg" alt="EnoPrice mimari diyagramı" loading="lazy">
```

- [ ] **Step 3: Commit**

```bash
git add docs/assets/diagrams/enoprice-architecture.svg Enoprice_Proje_Dokumanı/EnoPrice_Ozet.html && git commit -m "docs: add SVG architecture diagram to EnoPrice summary"
```

---

## Faz 4: Workflow Katalogu Tamamlama (2–4 hafta)

### Task 22: Eksik KEP workflow'larını dokümante et ve JSON olarak oluştur

**Files:**
- Create: `n8n-docker/workflows/kep/KEP-AI-005_...json`
- Create: `n8n-docker/workflows/kep/KEP-AI-006_...json`
- Create: `n8n-docker/workflows/kep/KEP-AI-007_...json`
- Create: `n8n-docker/workflows/kep/KEP-AI-008_...json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 4)

Candidate workflows (to be refined against existing doc sections):
- KEP-AI-005: İade ve İptal Karar Desteği
- KEP-AI-006: Dinamik Kargo ve Teslimat Optimizasyonu
- KEP-AI-007: Fraud/Şüpheli İşlem Tespiti
- KEP-AI-008: Satıcı Performans ve Uyarı Sistemi

Each workflow file must follow the existing naming convention and contain a complete n8n JSON with trigger, AI agent, switch, action and logging nodes.

- [ ] **Step 1: Draft each workflow definition in the main doc**

- [ ] **Step 2: Create the corresponding JSON file using existing KEP workflows as templates**

- [ ] **Step 3: Validate JSON syntax**

```bash
for f in n8n-docker/workflows/kep/*.json; do jq empty "$f" && echo "OK $f"; done
```

Expected: all files print `OK`.

- [ ] **Step 4: Commit per workflow**

```bash
git add n8n-docker/workflows/kep/KEP-AI-005_*.json ... && git commit -m "feat(workflows): add KEP-AI-005..008 workflows"
```

---

### Task 23: Eksik Connector workflow'larını dokümante et ve JSON olarak oluştur

**Files:**
- Create: `n8n-docker/workflows/connector/CONN-AI-003_...json`
- Create: `n8n-docker/workflows/connector/CONN-AI-004_...json`
- Create: `n8n-docker/workflows/connector/CONN-AI-005_...json`
- Create: `n8n-docker/workflows/connector/CONN-AI-006_...json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 5)

Candidate workflows:
- CONN-AI-003: Sipariş Durumu Senkronizasyonu
- CONN-AI-004: İade/İptal Senkronizasyonu
- CONN-AI-005: Kategori ve Nitelik Eşleştirme
- CONN-AI-006: Pazaryeri Komisyon ve Maliyet Analizi

- [ ] **Step 1-4:** Same pattern as Task 4.1.

---

### Task 24: Eksik EnoPrice workflow'larını dokümante et ve JSON olarak oluştur

**Files:**
- Create: `n8n-docker/workflows/enoprice/ENOPRICE-AI-002_...json` through `ENOPRICE-AI-007_...json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 6)

Candidate workflows:
- ENOPRICE-AI-002: Dinamik Fiyat Optimizasyonu
- ENOPRICE-AI-003: Promosyon ve Kampanya Önerisi
- ENOPRICE-AI-004: Fiyat Anomali Tespiti
- ENOPRICE-AI-005: Maliyet-Marj Analizi
- ENOPRICE-AI-006: Ürün Kategori Bazlı Fiyatlandırma
- ENOPRICE-AI-007: Fiyat Onay ve Rollback Süreci

- [ ] **Step 1-4:** Same pattern as Task 4.1.

---

### Task 25: Eksik EnoRep workflow'larını dokümante et ve JSON olarak oluştur

**Files:**
- Create: `n8n-docker/workflows/enorep/ENOREP-AI-003_...json` through `ENOREP-AI-006_...json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 7)

Candidate workflows:
- ENOREP-AI-003: Anasayfa Kişiselleştirme
- ENOREP-AI-004: Arama Sonucu Sıralama Optimizasyonu
- ENOREP-AI-005: Benzer Ürün Önerileri
- ENOREP-AI-006: Sadakat Programı Öneri Motoru

- [ ] **Step 1-4:** Same pattern as Task 4.1.

---

### Task 26: Eksik EnoCart workflow'larını dokümante et ve JSON olarak oluştur

**Files:**
- Create: `n8n-docker/workflows/enocart/ENOCART-AI-002_...json` through `ENOCART-AI-005_...json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 8)

Candidate workflows:
- ENOCART-AI-002: Sepet Optimizasyonu ve Ürün Önerisi
- ENOCART-AI-003: Stok/Mağaza Yönlendirme
- ENOCART-AI-004: Müşteri Anomali ve Güvenlik Uyarısı
- ENOCART-AI-005: Teslimat ve Rota Optimizasyonu

- [ ] **Step 1-4:** Same pattern as Task 4.1.

---

### Task 27: Cross-project orchestration workflow'ları oluştur

**Files:**
- Create: `n8n-docker/workflows/cross-project/CROSS-AI-001_Supervisor_Agent.json`
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md` (section 9)

- [ ] **Step 1: Define Supervisor Agent orchestration flow**

The workflow receives a request, classifies the intent, and dispatches to the correct project-specific sub-workflow via HTTP Request nodes.

- [ ] **Step 2: Create JSON file**

- [ ] **Step 3: Validate JSON**

```bash
jq empty n8n-docker/workflows/cross-project/CROSS-AI-001_Supervisor_Agent.json && echo OK
```

- [ ] **Step 4: Commit**

```bash
git add n8n-docker/workflows/cross-project/ ENOCA_AI_Otomasyon_Dokumantasyonu.md && git commit -m "feat(workflows): add cross-project supervisor orchestration workflow"
```

---

### Task 28: Ana dokümandaki otomasyon sayılarını ve durumunu güncelle

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Update the summary table in section 1.4**

Ensure counts match implemented workflows: KEP 8, Connector 6, EnoPrice 7, EnoRep 6, EnoCart 5, plus cross-project.

- [ ] **Step 2: Mark workflows with implementation status**

Add a status column or note:

```markdown
| Proje | Otomasyon Sayısı | JSON Durumu |
|-------|-----------------|-------------|
| KEP | 8 | Tamamlandı |
...
```

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: update automation counts and implementation status"
```

---

### Task 29: DOCX çıktılarını yeniden üret

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.docx` (generated)
- Modify: `ENOCA_n8n_Detayli_Kullanici_Dokumantasyonu.docx` (generated)

- [ ] **Step 1: Install dependency and run converters**

```bash
pip install python-docx
python3 convert_to_docx.py
python3 convert_detailed_to_docx.py
```

- [ ] **Step 2: Verify DOCX files exist and are non-empty**

```bash
ls -lh ENOCA_AI_Otomasyon_Dokumantasyonu.docx ENOCA_n8n_Detayli_Kullanici_Dokumantasyonu.docx
```

Expected: file sizes > 50KB.

- [ ] **Step 3: Commit generated DOCX files**

```bash
git add *.docx && git commit -m "chore: regenerate DOCX outputs from updated Markdown"
```

---

## Faz 5: Doğrulama ve Kapanış (1–2 gün)

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

### Task 31: Workflow JSON'larını n8n şemasına göre doğrula

**Files:**
- All `n8n-docker/workflows/**/*.json`

- [ ] **Step 1: Validate JSON with jq**

```bash
find n8n-docker/workflows -name '*.json' -exec jq empty {} \;
```

Expected: no output (success).

- [ ] **Step 2: Spot-check one workflow in n8n UI**

Import `n8n-docker/workflows/kep/KEP-AI-001_Siparis_Isleme.json` into a local n8n instance and ensure it loads without schema errors.

---

### Task 32: HTML sayfalarının görünümünü manuel olarak gözden geçir

- [ ] Open each HTML file in a browser.
- [ ] Check mobile layout at 375px and desktop at 1440px.
- [ ] Verify TOC links scroll to correct sections.
- [ ] Verify no broken images or icons.

---

### Task 33: Versiyon etiketi ve son commit

**Files:**
- Modify: `ENOCA_AI_Otomasyon_Dokumantasyonu.md`

- [ ] **Step 1: Bump version to 1.1 and update date**

Change header:

```markdown
**Versiyon:** 1.1  
**Tarih:** 6 Temmuz 2026
```

Add row to version history table.

- [ ] **Step 2: Commit and tag**

```bash
git commit -am "docs: release documentation v1.1"
git tag -a docs-v1.1 -m "Documentation and workflow catalog v1.1"
```

---

## Ek Notlar

- **Güvenlik:** `.env` dosyasının geçmişten tamamen temizlenmesi gerekiyorsa `git filter-repo` veya BFG Repo-Cleaner kullanılmalıdır; bu plan sadece index'ten çıkarmayı kapsar.
- **Workflow isimlendirme:** Yeni workflow dosyaları `{PROJE}-AI-{NNN}_{Kisa_Turkce_Aciklama}.json` formatında ve Türkçe node adlarıyla oluşturulmalıdır.
- **Türkçe:** Tüm yeni başlıklar, yorumlar ve açıklamalar Türkçe yazılmalıdır.
- **Test:** Otomatik test altyapısı olmadığı için her workflow manuel n8n UI testi ile doğrulanmalıdır.
