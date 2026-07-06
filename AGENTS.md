# enoca™ AI Otomasyon Sistemi — AGENTS.md

> Bu dosya, bu projeyi ilk kez gören AI kodlama ajanları için hazırlanmıştır. Proje, geleneksel bir uygulama kod tabanı değil; **kurumsal dokümantasyon, n8n workflow şablonları ve destekleyici otomasyon araçlarından** oluşan bir çalışma alanıdır.

---

## 1. Proje Genel Bakış

Bu repo, **enoca™ e-ticaret ekosistemi**nin AI destekli otomasyon senaryolarını ve proje dokümantasyonlarını bir arada tutar. Ekosistem beş temel üründen oluşur:

| Proje | Kısa Açıklama | AI Otomasyon Sayısı (Hedef) |
|-------|---------------|----------------------------|
| **KEP** | Kurumsal E-Ticaret Platformu (merkezi) | 8 |
| **Connector** | Pazaryeri entegrasyon katmanı | 6 |
| **EnoPrice** | AI destekli dinamik fiyatlandırma | 7 |
| **EnoRep** | Ürün öneri ve kişiselleştirme motoru | 6 |
| **EnoCart** | Fiziksel mağaza akıllı alışveriş arabası/IoT | 5 |

**Platform:** n8n (workflow otomasyonu) + Google Gemini (LLM/AI Agent)  
**Dokümantasyon dili:** Türkçe  
**Versiyon:** 1.0 (25 Haziran 2026)

Repo'nun iki ana işlevi vardır:
1. **Dokümantasyon barındırmak:** Markdown, HTML ve DOCX olarak hazırlanmış proje özetleri, kullanım kılavuzları ve AI otomasyon rehberi.
2. **n8n workflow şablonlarını saklamak:** Her ürün için AI Agent tabanlı workflow JSON'ları.

---

## 2. Repository Yapısı

```
Enoca Projects/
├── AGENTS.md                              ← Bu dosya
├── index.html                             → GitHub Pages için giriş/portal sayfası
├── convert_to_docx.py                     → Markdown → DOCX dönüştürücü
├── ENOCA_AI_Otomasyon_Dokumantasyonu.md   → Ana AI otomasyon dokümantasyonu
├── ENOCA_AI_Otomasyon_Dokumantasyonu.docx → Ana dokümanın DOCX hali
├── DOKUMANTASYON_IYILESTIRME_NOTLARI.md   → Dokümantasyon kalite raporu
│
├── n8n-docker/                            → n8n altyapısı ve workflow'lar
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── .env                               → DİKKAT: repo'da saklanıyor
│   ├── workflows/
│   │   ├── kep/                           → KEP workflow'ları
│   │   ├── connector/                     → Connector workflow'ları
│   │   ├── enoprice/                      → EnoPrice workflow'ları
│   │   ├── enorep/                        → EnoRep workflow'ları
│   │   ├── enocart/                       → EnoCart workflow'ları
│   │   └── cross-project/                 → Şu anda boş
│   ├── custom_nodes/                      → Şu anda boş
│   └── prometheus/                        → Şu anda boş (prometheus.yml eksik)
│
├── Connector_Proje Dokümanı/              → DOCX + HTML proje dokümanları
├── Enocart_Proje Dokümanı/
├── Enoprice_Proje Dokümanı/
├── EnoRep_Proje Dokümanı/
└── KEP_Proje Dokümanı/
```

### Önemli dosyalar

| Dosya | Amaç |
|-------|------|
| `ENOCA_AI_Otomasyon_Dokumantasyonu.md` | 2.877 satırlık ana doküman; mimari, 32 otomasyon, API entegrasyonları, güvenlik, KPI'lar ve yol haritasını içerir. |
| `index.html` | GitHub Pages (`enoca.github.io/EnoSistem`) için tasarlanmış portal sayfası; her projenin HTML özetine bağlantı verir. |
| `convert_to_docx.py` | Ana Markdown dosyasını Microsoft Word (.docx) formatına dönüştüren Python betiği. |
| `DOKUMANTASYON_IYILESTIRME_NOTLARI.md` | Mevcut dokümanların kalite, tutarlılık ve SEO açısından incelendiği rapor. |
| `n8n-docker/docker-compose.yml` | n8n, PostgreSQL, Redis, isteğe bağlı worker, Prometheus ve Grafana servislerini tanımlar. |
| `n8n-docker/.env.example` | Çevre değişkenleri şablonu (API anahtarları, DB bilgileri, MQTT vb.). |

---

## 3. Teknoloji Yığını

### 3.1 Çalışma Zamanı / Altyapı

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| Workflow Orchestration | **n8n** (`n8nio/n8n:latest`) | AI Agent'ları, trigger'lar, HTTP/MQTT/DB node'ları |
| Veritabanı | **PostgreSQL 16** (Alpine) | n8n metadata + iş verileri |
| Kuyruk / Önbellek | **Redis 7** (Alpine) | Worker kuyruğu ve scaling |
| LLM | **Google Gemini** (`gemini-2.0-flash`) | Tüm AI Agent node'larında kullanılır |
| IoT Mesajlaşma | **MQTT** | EnoCart sensör verisi için |
| Monitoring | Prometheus + Grafana (isteğe bağlı `monitoring` profili) | Henüz tam yapılandırılmamış |
| Konteynerizasyon | **Docker Compose** (`version: '3.8'`) | Tüm servisleri tek komutla ayağa kaldırır |

### 3.2 Yardımcı Araçlar

| Araç | Dosya | Bağımlılık |
|------|-------|------------|
| Markdown → DOCX | `convert_to_docx.py` | `python-docx` (`pip install python-docx`) |
| GitHub Pages portal | `index.html` | CDN: Google Fonts, Font Awesome 6.5.1 |

### 3.3 Proje dosyalarındaki diller

- **Türkçe** ana dokümantasyon ve yorum dili.
- JavaScript kod blokları n8n `Code` node'ları için örnekler içerir.
- Workflow JSON'ları n8n node türlerini (`n8n-nodes-base.webhook`, `@n8n/n8n-nodes-langchain.agent`, vb.) kullanır.

---

## 4. Build ve Çalıştırma Komutları

### 4.1 n8n Ortamını Ayağa Kaldırma

```bash
cd n8n-docker

# 1. Ortam değişkenlerini hazırla (ilk kurulum)
cp .env.example .env
# .env dosyasını düzenleyerek gerçek API anahtarlarını gir

# 2. Servisleri başlat
docker-compose up -d

# 3. n8n UI'ına eriş
open http://localhost:5678
```

> `.env.example` varsayılan olarak `localhost`, geçici şifreler ve placeholder API anahtarları içerir. Üretim kullanımı için değiştirilmelidir.

### 4.2 İsteğe Bağlı Profiller

```bash
# Monitoring stack ile birlikte çalıştır
docker-compose --profile monitoring up -d

# Worker'ları aktif et (n8n_worker servisi replicas=0 ile tanımlı; 
# N8N_WORKER_ENABLED=true gerektirir)
```

### 4.3 DOCX Dokümanı Oluşturma

```bash
# Gerekli bağımlılığı kur
pip install python-docx

# Ana Markdown dosyasını DOCX'e dönüştür
python convert_to_docx.py
```

Bu komut `ENOCA_AI_Otomasyon_Dokumantasyonu.md`'yi okur ve `ENOCA_AI_Otomasyon_Dokumantasyonu.docx` dosyasını üretir. Betikte çıktı yolları sabit kodlanmıştır (`/Users/osmancagrigenc/Downloads/Enoca Projects/...`).

### 4.4 Workflow'ları n8n'e Yükleme

Workflow'lar `n8n-docker/workflows/` altında düz JSON dosyalarıdır. Bunlar şu anda **doğrudan otomatik yüklenmez**. n8n UI'ından "Import workflow" ile ilgili `.json` dosyasını içe aktarın veya n8n API'sini kullanın.

---

## 5. Kod ve Workflow Organizasyonu

### 5.1 Workflow Klasör Yapısı

Workflow'lar proje bazında gruplandırılmıştır. Her workflow'da şu ortak öğeler bulunur:

- `id`: node kimlikleri
- `name`: Türkçe görünen ad
- `type`: n8n node tipi
- `parameters`: node konfigürasyonu (çoğunlukla Türkçe yorumlarla)
- `connections`: node bağlantıları
- `tags`: proje ve fonksiyon etiketleri
- `meta.templateId`: şablon kimliği

### 5.2 Mevcut Workflow'lar

| Dosya | Proje | Tetikleyici | Amaç |
|-------|-------|-------------|------|
| `kep/KEP-AI-001_Siparis_Isleme.json` | KEP | Webhook (`kep/siparis/yeni`) | Yeni sipariş risk analizi ve otomatik/manuel/red yönlendirmesi |
| `kep/KEP-AI-002_Musteri_Segmentasyonu.json` | KEP | Cron (günlük 02:00) | RFM + CLV hesaplayarak müşteri segmentini güncelleme |
| `kep/KEP-AI-003_Stok_Uyari_Restok.json` | KEP | Cron/IoT | Stok kritik seviye uyarı ve otomatik sipariş önerisi |
| `kep/KEP-AI-004_RBAC_Audit.json` | KEP | Schedule/Log | RBAC erişim log anomali tespiti |
| `connector/CONN-AI-001_Urun_Eslestirme.json` | Connector | Webhook (`connector/product/new`) | Barkod/AI ile ürün eşleştirme |
| `connector/CONN-AI-002_Stok_Senkronizasyonu.json` | Connector | Cron (15 dk) | KEP ↔ Trendyol/Hepsiburada stok senkronizasyonu |
| `enoprice/ENOPRICE-AI-001_Rakip_Fiyat_Izleme.json` | EnoPrice | Cron (saatlik) | Trendyol/Hepsiburada/Amazon fiyat kazıma ve analiz |
| `enorep/ENOREP-AI-001_Kisisellestirilmis_Email.json` | EnoRep | Cron (günde 4 kez) | Sepet terk edenlere kişiselleştirilmiş email gönderimi |
| `enorep/ENOREP-AI-002_CLV_Tahmini_Churn.json` | EnoRep | Cron | CLV tahmini ve churn önleme aksiyonları |
| `enocart/ENOCART-AI-001_Hirsizlik_Tespiti.json` | EnoCart | MQTT (`enocart/session/+/sensors`) | IoT sensör verisiyle sahtekarlık/anomali tespiti |

### 5.2 Agent Tasarım Deseni

Dokümantasyonda ve workflow'larda **Supervisor Agent** deseni kullanılır:

```
Supervisor Agent (n8n AI Agent)
    ├── KEP Agent
    ├── EnoPrice Agent
    ├── EnoRep Agent
    ├── Connector Agent
    └── EnoCart Agent
```

Her workflow genellikle şu adımları izler:
1. **Trigger** (Webhook / Cron / MQTT)
2. **Veri çekme/doğrulama** (Postgres, HTTP Request, Code node)
3. **AI analiz** (`@n8n/n8n-nodes-langchain.agent` + Gemini)
4. **Karşın yönlendirme** (`Switch` node)
5. **Aksiyon** (HTTP güncelleme, Slack bildirim, Email, MQTT control)
6. **Loglama** (Postgres/Code node)

---

## 6. Geliştirme Konvansiyonları

### 6.1 Dosya ve İsimlendirme

- Workflow dosyaları: `{PROJE}-AI-{NNN}_{Kisa_Turkce_Aciklama}.json`
- Workflow adları: `{PROJE}-AI-{NNN}: {Türkçe Açıklama}`
- Node adları: Türkçe, boşluklu (örn. "AI Risk Analizi", "Segment Güncelle")
- Tag'ler: küçük harf, Türkçe karakterler dahil (örn. `"sepet-terk"`, `"kişiselleştirme"`)

### 6.2 Kod Stili (n8n Code Node'ları)

- JavaScript kullanılır.
- Değişken ve yorumlar Türkçe'dir.
- `$input.first().json` ve `$input.all()` kalıpları standarttır.
- API anahtarları `$env.VARIABLE_NAME` ile çevre değişkeninden okunur.
- Tarihler ISO 8601 formatında (`new Date().toISOString()`).

### 6.3 Dokümantasyon Stili

- Ana doküman Markdown; başlık hiyerarşisi `#` → `####` kullanılır.
- Tablolar, ASCII diyagramlar ve kod blokları yaygındır.
- Her otomasyon için standart bir yapı vardır: Genel Bakış, Akış, Prompt, Beklenen Sonuçlar.
- Proje özetleri hem `.html` hem `.docx` olarak bulunur.

### 6.4 Versiyonlama

- `ENOCA_AI_Otomasyon_Dokumantasyonu.md` içinde "14.4 Versiyon Geçmişi" bölümü vardır.
- Mevcut versiyon: **1.0 — 25.06.2026**.
- `DOKUMANTASYON_IYILESTIRME_NOTLARI.md` versiyonlama tutarlılığı konusunda eleştiri içerir.

---

## 7. Test Stratejisi

> **Mevcut durumda otomatik test altyapısı bulunmamaktadır.**

- Unit test, integration test veya CI/CD pipeline dosyası yoktur.
- Workflow'lar manuel olarak n8n UI'ında test edilmelidir.
- Doğrulama önerisi:
  - Her workflow'un trigger'ını manuel tetikleyin.
  - AI Agent çıktılarını `Code` node ile loglayın.
  - Slack/Email node'ları için test kanalları kullanın.
  - Üretim API'lerine gitmeden önce mock/staging endpoint'leriyle çalışın.

---

## 8. Deployment Süreci

### 8.1 GitHub Pages (Dokümantasyon)

- `index.html` repo kökünde olduğu için GitHub Pages üzerinden yayınlanabilir.
- Mevcut bağlantılar `https://enoca.github.io/EnoSistem/...` formatındadır.
- Son commit mesajlarında linklerin GitHub Pages URL'lerine güncellendiği belirtilmiştir.

### 8.2 n8n Altyapısı

- Docker Compose ile deployment yapılır.
- `n8n_worker` servisi `replicas: 0` ve `N8N_WORKER_ENABLED=false` ile pasiftir.
- `EXECUTIONS_MODE=regular` (tek instance) olarak ayarlıdır.
- Monitoring profili (`prometheus`, `grafana`) opsiyoneldir.

### 8.3 Bilinen Eksikler / Yarım Yapılar

| Eksik | Konum | Etki |
|-------|-------|------|
| `prometheus.yml` | `n8n-docker/prometheus/` | Monitoring profili çalışmaz; Prometheus config dosyası yok. |
| `custom_nodes/` | `n8n-docker/custom_nodes/` | Boş; özel node geliştirilmemiş. |
| `workflows/cross-project/` | `n8n-docker/workflows/cross-project/` | Boş; cross-proje orchestration workflow'ları yok. |
| `.gitignore` | Repo kökü | Yok; `.env`, `.DS_Store`, geçici Word dosyaları (`~$...`) takipte. |

---

## 9. Güvenlik Hususları

> **Kritik:** Bu repo'da hassas bilgiler açıkça saklanmaktadır. Aşağıdaki maddeleri dikkate alın.

### 9.1 Çevre Değişkenleri

- `n8n-docker/.env` dosyası **repo'ya commit edilmiştir**.
- `.env.example` sadece şablondur; `.env` içinde gerçek veya varsayılan şifreler bulunabilir.
- Yeni çalışma yapmadan önce `.env`'yi `.gitignore`'a ekleyin ve geçmişten çıkarın (`git filter-repo` veya BFG Repo-Cleaner).

### 9.2 Git Remote URL

- Git remote URL'sinde `ghp_...` ile başlayan bir GitHub Personal Access Token görünmektedir.
- Bu token derhal iptal edilmeli ve remote URL'si `git remote set-url origin https://github.com/enoca/EnoSistem.git` şeklinde güncellenmelidir.

### 9.3 API Anahtarları ve Credential'lar

- Workflow'lar `$env.KEP_API_KEY`, `$env.TRENDYOL_API_KEY`, `$env.ENOREP_API_KEY`, vb. çevre değişkenlerini okur.
- `.env.example`'daki tüm API anahtarları `your_*_here` placeholder'larıdır; gerçek değerler `.env`'ye yazılmalıdır.
- n8n'de credential'lar n8n'in kendi şifreli deposunda saklanmalıdır, workflow JSON'larına sabit yazılmamalıdır.

### 9.4 SQL Enjeksiyon Riski

- Bazı workflow'larda (örn. `KEP-AI-002_Musteri_Segmentasyonu.json`) Postgres node'larında string interpolasyon kullanılır. Gerçek kullanımda parametreli sorgular veya n8n'in parametre mekanizmaları tercih edilmelidir.

### 9.5 Önerilen Hemen Yapılacaklar

1. `.gitignore` oluşturun; `.env`, `*.env`, `.DS_Store`, `~$*.docx`, `__pycache__/`, `.pytest_cache/` ekleyin.
2. `.env` dosyasını geçmişten tamamen kaldırın.
3. Git remote URL'sindeki token'ı iptal edin ve remote'u temizleyin.
4. `n8n-docker/prometheus/prometheus.yml` dosyasını oluşturun veya monitoring profilini kaldırın.
5. Üretim deployment'ından önce tüm `your_*_here` değerlerini gerçek credential'larla değiştirin.

---

## 10. AI Ajanları İçin Pratik Notlar

- **Değişiklik yapmadan önce** `DOKUMANTASYON_IYILESTIRME_NOTLARI.md`'yi okuyun; orada tutarlılık, terminoloji ve link sorunları listelenmiştir.
- **Türkçe dokümantasyon** hakim dildir; yeni başlıklar, yorumlar ve açıklamalar Türkçe yazılmalıdır.
- **Workflow JSON'ları** doğrudan düzenlenebilir; ancak n8n UI'ından içe/dışa aktarmak daha güvenlidir.
- **Yeni workflow eklerken** mevcut `{PROJE}-AI-{NNN}` numaralandırma şemasına uygun devam edin.
- **DOCX oluşturma** gerektiğinde `convert_to_docx.py`'yi çalıştırın; betikte yollar sabit kodlanmıştır, farklı bir ortamda çalıştıracaksanız yolları güncelleyin.
- **Test yoktur**; her değişiklik sonrası manuel doğrulama veya n8n'de test çalıştırması yapılması gerekir.

---

## 11. Referanslar

- `ENOCA_AI_Otomasyon_Dokumantasyonu.md` — Ana mimari ve otomasyon kataloğu
- `n8n-docker/docker-compose.yml` — Altyapı tanımları
- `n8n-docker/.env.example` — Çevre değişkeni şablonu
- `DOKUMANTASYON_IYILESTIRME_NOTLARI.md` — Dokümantasyon kalite notları
- n8n Docs: https://docs.n8n.io/
- Google Gemini API: https://ai.google.dev/

---

*Son güncelleme: 26 Haziran 2026 — Bu AGENTS.md, mevcut proje içeriğine göre oluşturulmuştur.*
