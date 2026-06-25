# enoca™ AI Otomasyon Sistemi Dokümantasyonu

**Versiyon:** 1.0  
**Tarih:** 25 Haziran 2026  
**Platform:** n8n + AI Agents  
**Hazırlayan:** enoca™ Analiz ve AR-GE Ekibi

---

## İçindekiler

1. [Yönetici Özeti](#1-yönetici-özeti)
2. [Ekosistem Mimari Genel Görünüm](#2-ekosistem-mimari-genel-görünüm)
3. [n8n AI Agent Mimarisi](#3-n8n-ai-agent-mimarisi)
4. [KEP - AI Otomasyonları](#4-kep---ai-otomasyonları)
5. [Connector - AI Otomasyonları](#5-connector---ai-otomasyonları)
6. [EnoPrice - AI Otomasyonları](#6-enoprice---ai-otomasyonları)
7. [EnoRep - AI Otomasyonları](#7-enorep---ai-otomasyonları)
8. [EnoCart - AI Otomasyonları](#8-enocart---ai-otomasyonları)
9. [Cross-Proje AI Workflow'ları](#9-cross-proje-ai-workflowları)
10. [Entegrasyon API Spesifikasyonları](#10-entegrasyon-api-spesifikasyonları)
11. [Uygulama Yol Haritası](#11-uygulama-yol-haritası)
12. [Güvenlik ve İzleme](#12-güvenlik-ve-izleme)
13. [Metrikler ve KPI'lar](#13-metrikler-ve-kpilar)
14. [Ekler](#14-ekler)

---

## 1. Yönetici Özeti

### 1.1 Dokümantasyon Amacı

Bu dokümantasyon, enoca™ e-ticaret ekosisteminin beş temel projesi (KEP, Connector, EnoPrice, EnoRep, EnoCart) için n8n platformu kullanılarak gerçekleştirilebilecek AI destekli otomasyon senaryolarını detaylı olarak açıklamaktadır.

### 1.2 Hedef Kitle

- **Teknik Ekipler:** n8n workflow geliştiricileri, backend mühendisleri
- **Ürün Yöneticileri:** Otomasyon fırsatlarını değerlendiren ürün sahipleri
- **IT Yöneticileri:** Altyapı ve güvenlik kararları verenler
- **Yönetim:** ROI hesaplamaları ve stratejik planlama yapanlar

### 1.3 Temel Avantajlar

| Avantaj | Açıklama | Beklenen Etki |
|---------|----------|---------------|
| **Maliyet Tasarrufu** | Manuel süreçlerin otomasyonu | %30-50 emek tasarrufu |
| **Hız** | Gerçek zamanlı işleme | %70 daha hızlı işlem |
| **Doğruluk** | İnsan hatasının eliminasyonu | %99.5 doğruluk |
| **Ölçeklenebilirlik** | Artan işlem hacmi | Sınırsız ölçek |
| **Kişiselleştirme** | AI-driven deneyim | %25-35 conversion artışı |

### 1.4 Özet Tablo: Otomasyon Fırsatları

| Proje | Otomasyon Sayısı | Öncelik | Tahmini ROI |
|-------|-----------------|---------|-------------|
| KEP | 8 | Yüksek | %20-30 |
| Connector | 6 | Yüksek | %15-25 |
| EnoPrice | 7 | Yüksek | %25-40 |
| EnoRep | 6 | Orta-Yüksek | %30-45 |
| EnoCart | 5 | Orta | %15-25 |
| **Toplam** | **32** | - | - |

---

## 2. Ekosistem Mimari Genel Görünüm

### 2.1 Projeler Arası İlişkiler Haritası

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         enoca™ E-TİCARET EKOSİSTEMİ                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│     ┌─────────────────────────────────────────────────────────────┐      │
│     │                      KEP (Merkezi Platform)                  │      │
│     │                    14 Modül • Admin/Seller/Client           │      │
│     └──────────────────────────┬──────────────────────────────────┘      │
│                                │                                          │
│         ┌──────────────────────┼──────────────────────┐                  │
│         │                      │                      │                  │
│         ▼                      ▼                      ▼                  │
│  ┌────────────┐        ┌────────────┐        ┌────────────┐           │
│  │  Connector │        │  EnoPrice  │        │   EnoRep   │           │
│  │  (Entegr.) │◄──────│  (AI Fiyat)│◄──────│ (Öneri)    │           │
│  └─────┬──────┘        └─────┬──────┘        └─────┬──────┘           │
│        │                     │                      │                   │
│        │    ┌────────────────┴──────────────────────┘                   │
│        │    │                                                          │
│        ▼    ▼                                                          │
│  ┌────────────┐                                                        │
│  │  EnoCart   │                                                        │
│  │  (IoT/AI)  │                                                        │
│  └────────────┘                                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Veri Akışı Genel Görünüm

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VERİ AKİŞİ MİMARİSİ                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│  │ Web/Mobil│───▶│    n8n   │───▶│  AI LLM  │───▶│  KEP API  │        │
│  │  Client  │    │ Orchestr.│    │  (Gemini)│    │   Core    │        │
│  └──────────┘    └─────┬─────┘    └──────────┘    └─────┬─────┘        │
│                        │                                   │            │
│                        ▼                                   ▼            │
│              ┌──────────────────┐              ┌──────────────────┐    │
│              │   AI AGENTS       │              │  VERİTABANLARI   │    │
│              │ ┌──────────────┐  │              │ ┌──────────────┐  │    │
│              │ │ Supervisor   │  │              │ │ PostgreSQL   │  │    │
│              │ │ Agent        │  │              │ │ Elasticsearch│  │    │
│              │ └──────────────┘  │              │ │ Redis       │  │    │
│              │ ┌──────────────┐  │              │ └──────────────┘  │    │
│              │ │ Specialist   │  │              └──────────────────┘    │
│              │ │ Price Agent  │  │                                         │
│              │ └──────────────┘  │              ┌──────────────────┐    │
│              │ ┌──────────────┐  │              │  DIŞ SİSTEMLER   │    │
│              │ │ Specialist   │  │              │ ┌──────────────┐  │    │
│              │ │ Recommend    │  │              │ │ Trendyol API │  │    │
│              │ │ Agent        │  │              │ │ Hepsiburada  │  │    │
│              │ └──────────────┘  │              │ │ Amazon       │  │    │
│              └──────────────────────┘              │ │ Gemini API   │  │    │
│                                                     └──────────────┘  │    │
│                                                     └──────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 n8n'ın Rolü

n8n, enoca™ ekosisteminde **AI Orchestration Layer** olarak görev yapacak:

| Katman | Sorumluluk | Teknoloji |
|--------|------------|-----------|
| **Trigger Layer** | Event detection, scheduling | n8n Cron, Webhook, IoT |
| **AI Agent Layer** | LLM orchestration, decision making | n8n AI Agent, Sub-agents |
| **Integration Layer** | API connections, data transformation | n8n HTTP, Database nodes |
| **Action Layer** | Business logic execution | n8n Code, Webhook |

---

## 3. n8n AI Agent Mimarisi

### 3.1 Agent Tasarım Prensipleri

#### 3.1.1 Supervisor Pattern Uygulaması

```
┌─────────────────────────────────────────────────────────────┐
│                  SUPERVISOR AGENT                            │
│  (Ana Koordinatör - n8n AI Agent)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Görevler:                                                    │
│  • Kullanıcı niyetini analiz et                              │
│  • Alt agent'lara görev dağıt                                 │
│  • Sonuçları synthesize et                                    │
│  • Hata yönetimi ve retry                                    │
│                                                              │
│  Araçlar:                                                     │
│  • /tools/workflow_trigger - İş akışı tetikle                 │
│  • /tools/api_call - Dış API çağrıları                        │
│  • /tools/data_transform - Veri dönüştürme                    │
│  • /tools/notify - Bildirim gönder                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  PRICE AGENT    │ │  RECOMMEND AG.  │ │  ANALYTICS AG.  │
│  (EnoPrice)     │ │    (EnoRep)     │ │    (KEP)        │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ • Fiyat analizi │ │ • Öneri motoru  │ │ • Metrik analiz │
│ • Rakip tarama  │ │ • Segmentation  │ │ • Anomali tespit│
│ • Kampanya yönet│ │ • CLV hesaplama│ │ • Trend analizi │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

#### 3.1.2 Agent State Management

```javascript
// Agent State Schema
const agentState = {
  sessionId: "uuid",
  context: {
    currentProject: "KEP" | "Connector" | "EnoPrice" | "EnoRep" | "EnoCart",
    userIntent: "string",
    entities: ["product_123", "order_456"],
    history: [
      { role: "agent", content: "..." },
      { role: "user", content: "..." }
    ]
  },
  memory: {
    shortTerm: { ... },  // Current conversation
    longTerm: { ... }    // Persistent across sessions
  },
  tools: {
    available: ["..."],
    permitted: ["..."]
  }
}
```

### 3.2 n8n Workflow Yapılandırması

#### 3.2.1 Global n8n Yapılandırması

```yaml
# n8n Configuration
version: 1.0

environment:
  base_url: "https://n8n.enoca.com"
  api_endpoint: "/api/v1"
  
ai:
  provider: "gemini"
  model: "gemini-2.0-flash"
  temperature: 0.7
  max_tokens: 2048
  
memory:
  type: "redis"
  ttl: 86400  # 24 hours
  
rate_limits:
  api_calls_per_minute: 60
  concurrent_workflows: 10
```

#### 3.2.2 Credentials Yapılandırması

| Credential | Alan | Açıklama |
|-----------|------|----------|
| `enoca_kep_api` | API Key, Base URL | KEP REST API erişimi |
| `enoca_connector_api` | API Key, Webhook Secret | Connector entegrasyonu |
| `enoca_enoprice_api` | API Key, OAuth2 Token | EnoPrice veri erişimi |
| `enoca_enorep_api` | API Key, ML Endpoint | EnoRep model erişimi |
| `enoca_enocart_mqtt` | Broker URL, Client ID | EnoCart IoT verisi |
| `google_gemini` | API Key | Gemini LLM erişimi |
| `trendyol_api` | API Key, Supplier ID | Trendyol entegrasyonu |
| `hepsiburada_api` | API Key, Merchant ID | Hepsiburada entegrasyonu |

### 3.3 Error Handling Stratejisi

```javascript
// n8n Error Handling Workflow Template
const errorStrategy = {
  retry: {
    maxAttempts: 3,
    backoff: {
      type: "exponential",
      initialDelay: 1000,  // 1 second
      multiplier: 2
    }
  },
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 60000,  // 1 minute
    halfOpenRequests: 3
  },
  fallback: {
    enabled: true,
    actions: [
      "notify_admin",
      "log_incident",
      "queue_for_retry"
    ]
  }
}
```

---

## 4. KEP - AI Otomasyonları

### 4.1 KEP AI Otomasyon Haritası

```
┌────────────────────────────────────────────────────────────────┐
│                    KEP AI OTOMASYONLARI                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Sipariş    │  │   Müşteri   │  │    Stok      │        │
│  │  İşleme     │  │ Segmentasyon│  │   Yönetimi   │        │
│  │  Agent      │  │  Agent      │  │   Agent      │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                    │
│                            ▼                                    │
│                   ┌─────────────────┐                           │
│                   │   Supervisor   │                           │
│                   │     Agent      │                           │
│                   └────────┬────────┘                           │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         │                  │                  │                │
│         ▼                  ▼                  ▼                │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐        │
│  │  Raporlama │    │  Bildirim  │    │   Audit    │        │
│  │   Agent    │    │   Agent    │    │   Agent    │        │
│  └────────────┘    └────────────┘    └────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 OTOMASYON-01: Akıllı Sipariş İşleme

#### 4.2.1 Genel Bakış

| Alan | Değer |
|------|-------|
| **Otomasyon ID** | KEP-AI-001 |
| **Ad** | Akıllı Sipariş İşleme |
| **Tip** | AI Agent + Workflow |
| **Öncelik** | Kritik |
| **SLA** | < 5 saniye |

#### 4.2.2 Akış Diyagramı

```
┌─────────────────────────────────────────────────────────────────┐
│                  OTOMASYON-01: SİPARİŞ İŞLEME                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Webhook: Yeni Sipariş]                                         │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 1. VERİ DOĞRULAMA │───▶ Hatalı? ──▶ Bildirim + Reddet        │
│  └────────┬─────────┘                                            │
│           │ Geçerli                                               │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 2. AI ANALİZ    │                                            │
│  │ • Miktar kontrol │                                           │
│  │ • Fiyat doğrulama│                                           │
│  │ • Stok kontrolü  │                                           │
│  │ • Risk analizi   │                                           │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 3. KARAR        │                                            │
│  │ ┌─────────────┐ │     ┌─────────────┐                       │
│  │ │ Düşük Risk  │ │────▶│ Otomatik    │                       │
│  │ │ (Skor < 30) │ │     │ Onay        │                       │
│  │ └─────────────┘ │     └─────────────┘                       │
│  │ ┌─────────────┐ │     ┌─────────────┐                       │
│  │ │ Orta Risk   │ │────▶│ Manuel      │                       │
│  │ │ (Skor 30-70)│ │     │ İnceleme    │                       │
│  │ └─────────────┘ │     └─────────────┘                       │
│  │ ┌─────────────┐ │     ┌─────────────┐                       │
│  │ │ Yüksek Risk│ │────▶│ İptal +     │                       │
│  │ │ (Skor > 70) │ │     │ Bildirim    │                       │
│  │ └─────────────┘ │     └─────────────┘                       │
│  └─────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.2.3 n8n Workflow JSON

```json
{
  "name": "KEP-AI-001: Akıllı Sipariş İşleme",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "kep/siparis/yeni"
      }
    },
    {
      "name": "Veri Doğrulama",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Sipariş validation\nconst siparis = $input.first().json;\n\nconst validation = {\n  gecerli: !!siparis.musteriId && !!siparis.urunler,\n  urunSayisi: siparis.urunler?.length || 0,\n  toplamTutar: siparis.toplamTutar || 0\n};\n\nreturn [{ json: { siparis, validation } }];"
      }
    },
    {
      "name": "AI Risk Analizi",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "modelType": "gemini",
        "systemMessage": "Sen bir e-ticaret sipariş risk analizi uzmanısın. Her siparişi analiz edip risk skorları ver.",
        "prompt": "Şu siparişi analiz et: {{ $json.siparis }}. Risk faktörlerini değerlendir: miktar anomalisi, fiyat tutarsızlığı, stok durumu."
      }
    },
    {
      "name": "Risk Skoru Değerlendirme",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "dataType": "number",
        "valueComparison": ">",
        "threshold": 70,
        "fallbackOutput": "default"
      }
    }
  ]
}
```

#### 4.2.4 AI Prompt Template

```markdown
## Sistem Prompt

Sen enoca™ KEP platformu için bir e-ticaret sipariş risk analiz uzmanısın. Görevin her yeni siparişi analiz ederek potansiyel riskleri tespit etmek.

## Analiz Kriterleri

1. **Miktar Anomalisi**
   - Normal sipariş miktarı: 1-10 adet
   - Şüpheli: > 50 adet aynı ürün
   - Kritik: > 100 adet

2. **Fiyat Tutarsızlığı**
   - Piyasa fiyatının %50 altı veya %30 üstü
   - Geçmiş siparişlere göre sapma

3. **Stok Durumu**
   - Yetersiz stok: Sipariş edilen > Mevcut × 2
   - Tedarik süresi: > 7 gün

4. **Müşteri Geçmişi**
   - Yeni müşteri + yüksek tutarlı sipariş
   - Daha önce iade/iptal öyküsü
   - Şüpheli adres bilgileri

## Çıktı Formatı

```json
{
  "riskScore": 0-100,
  "riskLevel": "DÜŞÜK" | "ORTA" | "YÜKSEK",
  "riskFactors": [
    {
      "factor": "Miktar Anomalisi",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "description": "...",
      "recommendation": "..."
    }
  ],
  "action": "AUTO_APPROVE" | "MANUAL_REVIEW" | "REJECT"
}
```

## Örnek Analiz

Sipariş:
- Müşteri: Yeni müşteri (ilk sipariş)
- Ürün: Elektronik item (5 adet)
- Toplam tutar: ₺45,000
- Teslimat adresi: Farklı şehir

Bu sipariş için risk analizi yap ve çıktı formatında sonuç ver.
```

#### 4.2.5 Beklenen Sonuçlar

| Metrik | Öncesi | Sonrası |
|--------|--------|---------|
| Manuel inceleme oranı | %35 | %8 |
| Sahte sipariş tespiti | %60 | %95 |
| Ortalama işlem süresi | 4.2 dk | 8 sn |
| Müşteri memnuniyeti | %82 | %91 |

---

### 4.3 OTOMASYON-02: Müşteri Segmentasyonu

#### 4.3.1 Genel Bakış

| Alan | Değer |
|------|-------|
| **Otomasyon ID** | KEP-AI-002 |
| **Ad** | Dinamik Müşteri Segmentasyonu |
| **Tip** | Scheduled AI Workflow |
| **Öncelik** | Yüksek |
| **Periyot** | Günlük |

#### 4.3.2 Segment Tanımları

| Segment | Kriterler | AI Action |
|---------|-----------|-----------|
| **Champions** | CLV > ₺50,000, freq > 10, recency < 7 | Özel indirimler, early access |
| **Loyal** | CLV > ₺20,000, freq > 5 | Sadakat programı |
| **Potential** | Yeni müşteri, 1-2 sipariş | Onboarding kampanyası |
| **At Risk** | Son sipariş > 60 gün, freq > 3 | Re-engagement email |
| **Churned** | Son sipariş > 120 gün | Win-back kampanyası |
| **Discount Seeker** | Order < avg order, high promo usage | Farklı strateji |

#### 4.3.3 n8n Workflow

```json
{
  "name": "KEP-AI-002: Müşteri Segmentasyonu",
  "trigger": {
    "type": "cron",
    "expression": "0 2 * * *"
  },
  "steps": [
    {
      "id": 1,
      "name": "Veri Çekme",
      "node": "PostgreSQL",
      "query": "SELECT * FROM customers WHERE last_order_date >= NOW() - INTERVAL '180 days'"
    },
    {
      "id": 2,
      "name": "CLV Hesaplama",
      "node": "Code",
      "function": "calculateCLV"
    },
    {
      "id": 3,
      "name": "RFM Analizi",
      "node": "AI Agent",
      "prompt": "Müşterileri RFM (Recency, Frequency, Monetary) analizine göre segmentlere ayır."
    },
    {
      "id": 4,
      "name": "Segmentasyon Güncelleme",
      "node": "PostgreSQL",
      "operation": "UPDATE customers SET segment = ? WHERE id = ?"
    },
    {
      "id": 5,
      "name": "Kampanya Tetikleme",
      "node": "Sub-Workflow",
      "workflow": "segment-specific-campaigns"
    }
  ]
}
```

---

### 4.4 OTOMASYON-03: Stok Uyarı ve Restok

#### 4.4.1 Akış

```
[IoT Sensor / Manuel Giriş]
         │
         ▼
[Stok Seviyesi Kontrol]
         │
    ┌────┴────┐
    │         │
  Normal    Kritik (< %20)
    │         │
    ▼         ▼
[Log Kaydet] [AI Agent Analiz]
                   │
                   ├──▶ Tedarikçi Belirleme
                   ├──▶ Sipariş Miktar Hesaplama
                   ├──▶ Maliyet/Zaman Optimizasyonu
                   │
                   ▼
            [Onay Bildirimi (Slack/Email)]
                   │
                   ▼
            [Otomatik Satın Alma Talebi]
```

#### 4.4.2 AI Karar Matrisi

| Stok % | Durum | Aksiyon | SLP |
|--------|-------|---------|-----|
| > %50 | Sağlıklı | Log | - |
| %20-50 | Uyarı | Monitoring | 48h |
| %10-20 | Kritik | Otomatik sipariş | 24h |
| < %10 | Acil | Acil sipariş + bildirim | 4h |

---

### 4.5 OTOMASYON-04: RBAC Audit

#### 4.5.1 İzleme Kriterleri

| Olay | Eşik | Aksiyon |
|------|------|---------|
| Başarısız login | > 5 / 1 saat | Hesap kilitleme + bildirim |
| Yetkisiz erişim denemesi | > 3 / gün | Güvenlik ekibi bildirimi |
| Hassas veri erişimi | Standart dışı saat | Audit log + bildirim |
| Toplu veri export | > 1000 kayıt | Manager onayı |

#### 4.5.2 AI Anomali Tespiti

```markdown
## RBAC Audit AI Prompt

Kullanıcı erişim loglarını analiz et:

1. **Zaman Anomalisi**: Normal çalışma saatleri dışında erişim
2. **Lokasyon Anomalisi**: Farklı IP/şehirden erişim
3. **Davranış Anomalisi**: Normalden farklı işlem kalıbı
4. **Hesap Risk Skoru**: 0-100 arası

Şüpheli aktiviteleri tespit et ve bildirim gönder.
```

---

### 4.6 OTOMASYON-05: Sistem Sağlık İzleme

```javascript
// Sistem Sağlık Kontrol Parametreleri
const healthChecks = {
  api: {
    latency: { threshold: 500, unit: "ms" },
    errorRate: { threshold: 1, unit: "%" },
    availability: { threshold: 99.9, unit: "%" }
  },
  database: {
    connectionPool: { max: 80, unit: "%" },
    queryTime: { threshold: 1000, unit: "ms" },
    deadlocks: { threshold: 0, unit: "count" }
  },
  cache: {
    hitRate: { min: 85, unit: "%" },
    memoryUsage: { max: 70, unit: "%" }
  }
}
```

---

### 4.7 OTOMASYON-06: Otomatik Raporlama

| Rapor | Frekans | Alıcılar | Format |
|-------|---------|----------|--------|
| Günlük Satış Özeti | Her gün 08:00 | Sales Team | Email + Dashboard |
| Haftalık KPI | Pazartesi 09:00 | Management | PDF |
| Aylık Analiz | Ayın 1'i | Executive | Presentation |
| Stok Durumu | Her gün 18:00 | Operations | Email |
| Müşteri Segmentasyonu | Haftalık | Marketing | Dashboard |

---

### 4.8 OTOMASYON-07: Bildirim Yönetimi

```javascript
// Bildirim Öncelik Matrix
const notificationMatrix = {
  CRITICAL: {
    channels: ["SMS", "Phone", "Slack"],
    timeout: "immediate",
    examples: ["Ödeme başarısızlığı", "Sistem düşüşü"]
  },
  HIGH: {
    channels: ["Slack", "Email"],
    timeout: "15 min",
    examples: ["Stok kritik seviye", "Güvenlik uyarısı"]
  },
  MEDIUM: {
    channels: ["Email"],
    timeout: "1 hour",
    examples: ["Rapor hazır", "Kampanya bitimi"]
  },
  LOW: {
    channels: ["Dashboard"],
    timeout: "daily digest",
    examples: ["Günlük özet", "İstatistikler"]
  }
}
```

---

### 4.9 OTOMASYON-08: Ürün Veri Zenginleştirme

```markdown
## Ürün Veri Zenginleştirme AI Agent

Görev: Eksik ürün bilgilerini AI ile tamamla

Input: Ürün ID, Mevcut Alanlar
Output: Zenginleştirilmiş Ürün Verisi

AI Yapılacaklar:
1. Ürün açıklamasını optimize et (SEO için)
2. Kategori uygunluğunu kontrol et
3. Benzer ürün önerileri oluştur
4. Fiyat aralığı öner (piyasa analizi)
5. Meta tag'ler oluştur
6. Görsel alternatifleri araştır

Kaynaklar:
- Gemini Vision (görsel analiz)
- Piyasa verileri (fiyat karşılaştırma)
- Rakip siteler (açıklama örnekleri)
```

---

## 5. Connector - AI Otomasyonları

### 5.1 Connector AI Otomasyon Haritası

```
┌────────────────────────────────────────────────────────────────┐
│                  CONNECTOR AI OTOMASYONLARI                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Ürün      │  │   Stok       │  │   Fiyat      │        │
│  │   Eşleştirme │  │  Senkron     │  │   Haritası   │        │
│  │   Agent      │  │   Agent      │  │   Agent      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Hata      │  │   Yeni      │  │   Bildirim   │        │
│  │   Yönetimi  │  │ Platform     │  │   Yönetimi   │        │
│  │   Agent      │  │ Entegr.     │  │   Agent      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 5.2 OTOMASYON-C01: Otomatik Ürün Eşleştirme

#### 5.2.1 Genel Bakış

| Alan | Değer |
|------|-------|
| **Otomasyon ID** | CONN-AI-001 |
| **Ad** | Cross-Platform Ürün Eşleştirme |
| **Tip** | AI Agent + Computer Vision |
| **Öncelik** | Kritik |

#### 5.2.2 Eşleştirme Stratejisi

```javascript
const matchingStrategy = {
  level1: {
    method: "EXACT_BARCODE",
    confidence: 100,
    fields: ["barcode", "sku", "gtin"]
  },
  level2: {
    method: "AI_SEMANTIC",
    confidence: 85,
    fields: ["name", "description", "brand", "category"]
  },
  level3: {
    method: "COMPUTER_VISION",
    confidence: 75,
    fields: ["product_image"]
  },
  level4: {
    method: "MANUAL_REVIEW",
    confidence: 0,
    fields: ["unmatched"]
  }
}
```

#### 5.2.3 n8n Workflow

```json
{
  "name": "CONN-AI-001: Ürün Eşleştirme",
  "trigger": {
    "type": "WEBHOOK",
    "path": "connector/product/matching"
  },
  "nodes": [
    {
      "name": "Yeni Ürün Bildirimi",
      "type": "Webhook",
      "parameters": { "path": "new-product" }
    },
    {
      "name": "Barcode ile Eşleştir",
      "type": "PostgreSQL",
      "query": "SELECT * FROM products WHERE barcode = {{ $json.barcode }}"
    },
    {
      "name": "AI Semantic Matching",
      "type": "AI Agent",
      "systemPrompt": "İki ürünü karşılaştır: {{ $json.source }} vs {{ $json.candidates }}. Benzerlik skorları ver.",
      "model": "gemini-2.0-flash"
    },
    {
      "name": "Eşleştirme Kararı",
      "type": "Switch",
      "rules": {
        "exact": "> 95% confidence",
        "ai_match": "> 75% confidence",
        "manual": "< 75% confidence"
      }
    }
  ]
}
```

---

### 5.3 OTOMASYON-C02: Envanter Senkronizasyonu

#### 5.3.1 Senkronizasyon Matrisi

| Platform | Frekans | Gecikme | Conflict Stratejisi |
|----------|---------|---------|---------------------|
| Trendyol | 15 dakika | < 1 dakika | KEP as source of truth |
| Hepsiburada | 15 dakika | < 1 dakika | Minimum stock |
| Amazon | 30 dakika | < 5 dakika | Platform priority |

#### 5.3.2 Conflict Detection AI

```markdown
## Stok Conflict Detection Agent

Senaryolar:
1. **KEP: 100, Trendyol: 50**
   → KEP doğru, Trendyol'u güncelle
   → Not: KEP'ten satış olmuş olabilir

2. **KEP: 100, Trendyol: 120**
   → Anomali! Logla ve araştır
   → Muhtemel: İnsan düzeltmesi veya senkron hatası

3. **KEP: 0, Trendyol: 50**
   → Tüm platformlara KEP'in değerini uygula
   → Bildirim gönder: "KEP'te tükendi ama Trendyol'da var"

Karar Kuralları:
- Negatif stok mümkün değil
- Büyük sapmalar (> %20) otomatik düzeltme yerine bildirim
- Büyük platform önceliği: Amazon > Trendyol > Hepsiburada
```

---

### 5.4 OTOMASYON-C03: Fiyat Haritası Analizi

#### 5.4.1 Rakip Fiyat İzleme

```javascript
const priceMonitoring = {
  targets: [
    { platform: "Trendyol", category: "electronics" },
    { platform: "Hepsiburada", category: "electronics" },
    { platform: "Amazon", category: "electronics" },
    { platform: "N11", category: "electronics" }
  ],
  frequency: "hourly",
  metrics: [
    "min_price",
    "max_price",
    "avg_price",
    "price_trend",
    "discount_depth"
  ],
  alerts: {
    priceDrop: { threshold: 5, unit: "%", channel: "slack" },
    priceIncrease: { threshold: 10, unit: "%", channel: "email" }
  }
}
```

#### 5.4.2 AI Fiyat Trend Analizi

```markdown
## Fiyat Trend Analiz Agent

Görev: Rakip fiyat hareketlerini analiz et ve anlamlı değişiklikleri tespit et.

Analiz Edilecek:
1. Son 7 günlük fiyat hareketleri
2. Rakip kampanyaları ve indirimleri
3. Mevsimsel fiyat değişimleri
4. Rakibin stratejik fiyatlandırması

Çıktı:
{
  "trends": [...],
  "anomalies": [...],
  "recommendations": [...],
  "competitorIntelligence": {...}
}
```

---

### 5.5 OTOMASYON-C04: Hata Tolerası Yönetimi

#### 5.5.1 Hata Kategorileri

| Hata Tipi | Öncelik | Otomatik Düzeltme | İnsan Gerekli |
|-----------|---------|-------------------|---------------|
| Geçici API hatası | Düşük | ✅ Retry | ❌ |
| Rate limit | Orta | ✅ Backoff | ❌ |
| Geçersiz SKU | Orta | ❌ | ✅ |
| Authentication hatası | Yüksek | ❌ | ✅ Bildirim |
| Rate limit aşımı | Yüksek | ✅ Cooloff | ✅ Bildirim |
| Schema uyuşmazlığı | Kritik | ⚠️ Partial | ✅ |
| Platform downtime | Kritik | ✅ Failover | ✅ Bildirim |

#### 5.5.2 AI Hata Analizi

```javascript
const errorAnalysisPrompt = `
// Hata Analiz AI Prompt
const analyzeError = (error) => {
  return `
    Hata Detayları:
    - Hata Kodu: ${error.code}
    - Platform: ${error.platform}
    - Zaman: ${error.timestamp}
    - Mesaj: ${error.message}
    
    AI Analiz:
    1. Hatanın Kök Nedeni: [AI tahmini]
    2. Etkilenen İşlemler: [Liste]
    3. Düzeltme Önerisi: [Adımlar]
    4. Önleme Önerisi: [Long-term fix]
    
    Retry Gerekiyor mu? Evet/Hayır
    Retry Interval: [Önerilen süre]
  `
}
```

---

### 5.6 OTOMASYON-C05: Yeni Platform Entegrasyonu

#### 5.6.1 Otomatik Entegrasyon Şablonu Oluşturma

```markdown
## Yeni Platform Entegrasyon Agent

Görev: Bir e-ticaret platformunun API dokümantasyonunu analiz ederek
n8n workflow entegrasyonu oluştur.

Input:
- Platform API Dokümantasyonu URL'si veya OpenAPI Spec
- Platform Adı: [platform_name]
- Authentication Type: [oauth2/api_key/basic]

AI Yapılacaklar:

1. API ENDPOINTS ANALİZİ
   - Ürün CRUD endpoints
   - Stok yönetimi endpoints
   - Sipariş yönetimi endpoints
   - Fiyat güncelleme endpoints

2. AUTHENTICATION
   - Gerekli credential'ları belirle
   - Token refresh mekanizmasını anla
   - Rate limit'leri tespit et

3. DATA MAPPING
   - KEP ↔ Platform field mapping
   - Category mapping
   - Status code mapping

4. N8N WORKFLOW TEMPLATE
   - Webhook triggers
   - API call nodes
   - Data transformation nodes
   - Error handling nodes

Çıktı: Tam n8n workflow JSON + Kurulum rehberi
```

---

### 5.7 OTOMASYON-C06: Bildirim Yönetimi

```javascript
const connectorNotifications = {
  channels: {
    SLACK: "#connector-alerts",
    EMAIL: "connector-team@enoca.com",
    JIRA: "CONN"
  },
  rules: [
    {
      event: "sync_failure",
      severity: "HIGH",
      channels: ["SLACK", "EMAIL"],
      template: "Platform {platform}: {count} ürün senkronize edilemedi. Hata: {error}"
    },
    {
      event: "rate_limit_warning",
      severity: "MEDIUM",
      channels: ["SLACK"],
      template: "{platform} için rate limit yaklaşıyor: {current}/{max}"
    },
    {
      event: "new_integration",
      severity: "LOW",
      channels: ["SLACK"],
      template: "Yeni platform entegre edildi: {platform}"
    }
  ]
}
```

---

## 6. EnoPrice - AI Otomasyonları

### 6.1 EnoPrice AI Otomasyon Haritası

```
┌────────────────────────────────────────────────────────────────┐
│                  ENOPRICE AI OTOMASYONLARI                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              AI FİYAT KARAR MOTORU                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ Stok     │  │ Rakip   │  │ Maliyet  │              │  │
│  │  │ Analizi  │  │ Fiyat    │  │ Analizi  │              │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │  │
│  │       └────────────┼────────────┘                       │  │
│  │                    ▼                                      │  │
│  │           ┌─────────────────┐                           │  │
│  │           │ Gemini AI       │                           │  │
│  │           │ Fiyat Önerisi   │                           │  │
│  │           └────────┬────────┘                           │  │
│  └────────────────────┼────────────────────────────────────┘  │
│                       │                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Kampanya   │  │  Prompt     │  │  Senaryo    │        │
│  │  Optimize   │  │  Engine      │  │  Modelleme  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 6.2 OTOMASYON-P01: Rakip Fiyat İzleme

#### 6.2.1 Web Scraping + AI Analiz

```javascript
const competitorMonitoring = {
  targets: [
    {
      name: "Trendyol",
      urls: [
        "https://www.trendyol.com/{category}/",
        "https://www.trendyol.com/sr?q={product}"
      ],
      scraping: {
        method: "Puppeteer",
        interval: 3600000, // 1 saat
        fields: ["price", "discount", "seller", "rating"]
      }
    },
    {
      name: "Hepsiburada",
      urls: ["https://www.hepsiburada.com/{product}"],
      scraping: { method: "API", interval: 3600000 }
    },
    {
      name: "Amazon",
      urls: ["https://www.amazon.com/{product}"],
      scraping: { method: "ScraperAPI", interval: 7200000 }
    }
  ],
  aiAnalysis: {
    model: "gemini-2.0-flash",
    analysisType: "competitor_price_strategy",
    output: {
      minPrice: "number",
      maxPrice: "number",
      avgPrice: "number",
      priceTrend: "UP|DOWN|STABLE",
      discountDepth: "percentage"
    }
  }
}
```

#### 6.2.2 AI Rakip Analiz Prompt

```markdown
## Rakip Fiyat Analiz Agent

Senaryo: Enoca'nın ürünleri için rakip fiyatlarını analiz et.

Giriş Verileri:
{competitor_data: [
  {
    platform: "Trendyol",
    product: "Samsung Galaxy S24",
    price: 45000,
    originalPrice: 50000,
    discount: 10,
    seller: "ABC Teknoloji",
    rating: 4.5,
    reviewCount: 234
  },
  {
    platform: "Hepsiburada",
    product: "Samsung Galaxy S24",
    price: 44500,
    originalPrice: 50000,
    discount: 11,
    seller: "XYZ Market",
    rating: 4.3,
    reviewCount: 156
  }
]}

EnoPrice Değerleri:
- Mevcut Fiyat: ₺47,500
- Maliyet: ₺38,000
- Stok: 45 adet

AI Analiz Yap:
1. En düşük/ortalama/yüksek fiyat hesapla
2. Fiyat avantajı analizi (Enoca pozisyonu)
3. optimum fiyat önerisi (kar maksimize)
4. Kampanya önerisi (indirim stratejisi)
5. Uyarılar (kritik fiyat değişimleri)

Çıktı Formatı:
```json
{
  "marketAnalysis": {
    "lowestPrice": 44500,
    "highestPrice": 47000,
    "averagePrice": 45750,
    "enocaPosition": "PREMIUM" | "COMPETITIVE" | "EXPENSIVE",
    "positionPercentage": 105
  },
  "pricingRecommendation": {
    "suggestedPrice": 44999,
    "expectedMargin": 18.5,
    "confidence": 0.87,
    "reasoning": "..."
  },
  "campaignSuggestion": {
    "type": "LIMITED_DISCOUNT",
    "discountPercentage": 8,
    "targetPrice": 44800,
    "duration": "7 days",
    "expectedLift": 25
  },
  "alerts": [
    {
      "type": "PRICE_DROP",
      "severity": "HIGH",
      "message": "Amazon fiyatı %15 düştü",
      "action": "Review pricing"
    }
  ]
}
```
```

---

### 6.3 OTOMASYON-P02: Dinamik Fiyat Karar Motoru

#### 6.3.1 Çok Faktörlü Fiyatlandırma

```javascript
const dynamicPricingFactors = {
  cost: {
    weight: 0.25,
    source: "EnoPrice Cost Table",
    validation: { minMargin: 10, maxDiscount: 30 }
  },
  competitor: {
    weight: 0.30,
    sources: ["Trendyol", "Hepsiburada", "Amazon", "N11"],
    aggregation: "WEIGHTED_AVERAGE",
    decayFactor: 0.9 // eski veriler için
  },
  demand: {
    weight: 0.25,
    signals: ["searchVolume", "pageViews", "addToCart", "purchaseVelocity"],
    forecasting: "TIME_SERIES"
  },
  inventory: {
    weight: 0.20,
    rules: [
      { stockLevel: "< 10", priceAdjustment: +15 },
      { stockLevel: "10-30", priceAdjustment: +5 },
      { stockLevel: "30-50", priceAdjustment: 0 },
      { stockLevel: "> 50", priceAdjustment: -5 }
    ]
  },
  seasonality: {
    weight: 0.15,
    patterns: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    holidays: ["BLACK_FRIDAY", "SINGLE_DAY", "RAMADAN"]
  }
}
```

#### 6.3.2 AI Fiyat Öneri Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│              DİNAMİK FİYAT KARAR MOTORU                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Günlük Schedule - Her 6 saatte bir]                           │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 1. VERİ TOPLAMA │                                            │
│  │ • Stok seviyesi │                                            │
│  │ • Rakip fiyatları│                                           │
│  │ • Son satışlar   │                                            │
│  │ • Maliyet fiyatı │                                           │
│  │ • Mevsim/hafta  │                                            │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 2. FAKTÖR       │                                            │
│  │ HESAPLAMA       │                                            │
│  │ • Ağırlıklandır │                                            │
│  │ • Normalizasyon │                                            │
│  │ • Skor hesaplama│                                            │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 3. AI MODEL     │                                            │
│  │ Gemini API      │──────────────────────────┐                  │
│  │ Fiyat önerisi   │                          │                  │
│  │ + Gerekçe       │                          │                  │
│  └────────┬─────────┘                          │                  │
│           │                                     │                  │
│           ▼                                     ▼                  │
│  ┌─────────────────┐               ┌─────────────────────┐       │
│  │ 4. SONUÇ        │               │ 5. YÖNETİCİ ONAYI   │       │
│  │ • Yeni fiyat    │               │ • Slack bildirimi   │       │
│  │ • Güven skoru   │──────────────▶│ • Değişiklik özeti  │       │
│  │ • Risk analizi  │               │ • Onay/Red butonu   │       │
│  └─────────────────┘               └─────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6.4 OTOMASYON-P03: Kampanya Performans Tahmini

#### 6.4.1 Predictive Analytics

```markdown
## Kampanya Performans Tahmin Agent

Görev: Yeni kampanya başlamadan önce beklenen performansı tahmin et.

Kampanya Parametreleri:
- Tür: [INDIRIM | BUNDLE | BUY_ONE_GET_ONE | FREE_SHIPPING]
- Hedef Kategori: [Electronics | Fashion | Home | All]
- İndirim Oranı: 10%
- Başlangıç: 01.07.2026
- Bitiş: 07.07.2026
- Bütçe: ₺100,000

Geçmiş Kampanya Analizi:
- Benzer kampanyalar: 5 adet
- Ortalama conversion artışı: +35%
- Ortalama revenue artışı: +28%
- Ortalama ROI: 3.2x

AI Tahmin:
{
  "predictedMetrics": {
    "conversionLift": "28-42%",
    "revenueImpact": "₺850,000 - ₺1,200,000",
    "roi": "2.8x - 3.6x",
    "unitsSold": "12,000 - 18,000"
  },
  "confidence": 0.82,
  "riskFactors": [
    "Ramazan sonrası dönem - tüketim düşebilir",
    "Rakip kampanyası bekleniyor"
  ],
  "recommendations": [
    "Erken başlangıç avantajı kullan",
    "Email ön sipariş başlat",
    "Influencer koordinasyonu"
  ]
}
```

---

### 6.5 OTOMASYON-P04: Prompt Engineering Otomasyonu

#### 6.5.1 Prompt Optimization Workflow

```javascript
const promptOptimization = {
  cycle: {
    frequency: "weekly",
    samples: 100,
    metrics: ["conversion_rate", "customer_satisfaction", "margin_impact"]
  },
  optimizationSteps: [
    {
      step: "DATA_COLLECTION",
      action: "Son 100 kampanya sonucunu topla",
      output: "campaign_results_dataset"
    },
    {
      step: "PROMPT_VARIATION",
      action: "5 farklı prompt varyasyonu oluştur",
      output: "prompt_variants"
    },
    {
      step: "A_B_TESTING",
      action: "Farklı segmentlere farklı promptlar dene",
      output: "test_results"
    },
    {
      step: "STATISTICAL_ANALYSIS",
      action: "Hangi prompt en iyi performans gösterdi?",
      output: "winner_prompt"
    },
    {
      step: "PROMPT_REFINEMENT",
      action: "Kazanan prompt'u daha da iyileştir",
      output: "optimized_prompt"
    }
  ]
}
```

---

### 6.6 OTOMASYON-P05: Fiyat Senaryolama

#### 6.6.1 What-If Analizi

```markdown
## What-If Fiyat Senaryolama Agent

Senaryo: "Rakip %10 düşerse ne olur?"

Mevcut Durum:
- EnoPrice: ₺100
- Rakip: ₺105
- Stok: 50 adet
- Maliyet: ₺70

Senaryo Parametreleri:
1. Rakip %10 düşüyor → ₺94.50
2. Enoca fiyatını sabit tutuyor
3. 30 günlük etki analizi

AI Simülasyonu:
{
  "scenario": "COMPETITOR_10_PERCENT_DROP",
  "assumptions": [
    "Enoca fiyatı sabit",
    "Rakip yeni fiyatı 30 gün korur",
    "Talep elasticitesi: -1.2"
  ],
  "predictedOutcomes": {
    "volumeImpact": {
      "before": 100,
      "after": 85,
      "change": "-15%",
      "confidence": 0.78
    },
    "revenueImpact": {
      "before": "₺10,000/gün",
      "after": "₺8,070/gün",
      "change": "-19.3%"
    },
    "recommendedActions": [
      {
        "action": "DEFENSIVE_PRICE",
        "description": "Fiyatı ₺98'e düşür",
        "expectedOutcome": "Volume korunur, margin düşer",
        "risk": "LOW"
      },
      {
        "action": "VALUE_PROPOSITION",
        "description": "Fiyat sabit, değer artırıcı ekle (ücretsiz kargo)",
        "expectedOutcome": "Margin korunur",
        "risk": "MEDIUM"
      },
      {
        "action": "WAIT_AND_SEE",
        "description": "Değişiklik yapma",
        "expectedOutcome": "Kısa vadeli kayıp",
        "risk": "HIGH"
      }
    ]
  }
}
```

---

### 6.7 OTOMASYON-P06: Otomatik Kampanya Planlama

```javascript
const autoCampaignPlanning = {
  triggers: [
    {
      type: "STOCK_HIGH",
      condition: "stock > 100 && age > 30 days",
      suggestedAction: "CLEARANCE_CAMPAIGN",
      confidence: 0.85
    },
    {
      type: "COMPETITOR_SALE",
      condition: "competitor_price < enoca_price * 0.9",
      suggestedAction: "MATCH_OR_BEAT",
      confidence: 0.90
    },
    {
      type: "SEASONAL",
      condition: "date in [RAMADAN, BLACK_FRIDAY, SINGLE_DAY]",
      suggestedAction: "SEASONAL_CAMPAIGN",
      confidence: 0.95
    },
    {
      type: "LOW_MARGIN",
      condition: "margin < 15%",
      suggestedAction: "BUNDLE_TO_INCREASE_MARGIN",
      confidence: 0.80
    }
  ],
  planningHorizon: "90 days",
  calendarView: true,
  approvalRequired: true
}
```

---

### 6.8 OTOMASYON-P07: Fiyat Gerekçelendirme

```markdown
## AI Fiyat Gerekçelendirme Agent

Kullanım Senaryosu: Müşteri hizmetleri için otomatik fiyat açıklaması

Prompt:
"Şu ürün için müşteriye fiyat farkı nasıl açıklanır:
- Ürün: iPhone 15 Pro 256GB
- EnoPrice: ₺75,000
- Trendyol: ₺73,500
- Hepsiburada: ₺74,000
- Neden EnoPrice daha pahalı: [AI açıklaması gerekli]"

AI Çıktısı:
```json
{
  "customerFacingMessage": "Enoca olarak güvencesiniz ve hızlı teslimatle 
fark yaratıyoruz. Apple Türkiye garantisi altında resmi servis 
desteği, 24 saat içinde ücretsiz kargo ve iade garantisi sunuyoruz.
Ayrıca 12 ay taksit imkanı ve ₺2,000 değerinde aksesuar hediyesi 
ile toplam değer farkı ₺3,000'nin üzerinde.",

  "valueBreakdown": {
    "basePrice": 70000,
    "warrantyValue": 1500,
    "fastShipping": 500,
    "accessoryGift": 2000,
    "installmentBenefit": 800,
    "totalValue": 32800
  },

  "competitorComparison": {
    "trendyol": {
      "priceDifference": 1500,
      "reasons": ["Garantisi değişken", "Kargo ücretli", "İade süresi 14 gün"]
    }
  }
}
```
```

---

## 7. EnoRep - AI Otomasyonları

### 7.1 EnoRep AI Otomasyon Haritası

```
┌────────────────────────────────────────────────────────────────┐
│                   ENOREP AI OTOMASYONLARI                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              ÖNERİ MOTORU (AI CORE)                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ Kullanıcı│  │ Ürün    │  │ Context │              │  │
│  │  │ Profil   │  │ Embed.  │  │ Engine  │              │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │  │
│  │       └────────────┼────────────┘                       │  │
│  │                    ▼                                      │  │
│  │           ┌─────────────────┐                           │  │
│  │           │ Vector Search   │                           │  │
│  │           │ + LLM Rerank    │                           │  │
│  │           └────────┬────────┘                           │  │
│  └────────────────────┼────────────────────────────────────┘  │
│                       │                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Email      │  │  CLV        │  │  Churn       │        │
│  │  Person.   │  │  Prediction  │  │  Prevention  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Search     │  │  Trend      │  │  Cross-Sell │        │
│  │  Optimize   │  │  Detection  │  │  Analysis   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 7.2 OTOMASYON-R01: Kişiselleştirilmiş Email

#### 7.2.1 Email Otomasyon Türleri

| Email Türü | Trigger | AI Katkısı | Öncelik |
|------------|---------|------------|---------|
| **Hoşgeldin** | Yeni kayıt | Ürün önerisi | Kritik |
| **Sepet Hatırlatma** | 24h sepette terk | Urun/alternatif öneri | Yüksek |
| **Fiyat Düşüşü** | Stokta izlenen ürün | Bildirim + alternative | Orta |
| **Yeniden Stokta** | Ürün tekrar satışta | Satın alma promptu | Orta |
| **Satın Alma Sonrası** | Sipariş tamamlandı | Cross-sell önerisi | Yüksek |
| **Churn Risk** | 30+ gün inactive | Re-engagement | Yüksek |
| **Sadakat Ödülü** | Segment değişimi | Kişiselleştirilmiş hediye | Orta |
| **Doğum Günü** | Tarih eşleşmesi | Özel indirim | Düşük |

#### 7.2.2 AI Email Generation Workflow

```markdown
## Kişiselleştirilmiş Email AI Agent

Kullanıcı Verisi:
- Ad: Ahmet
- Segment: "Loyal"
- CLV: ₺45,000
- Son satın alma: 15 gün önce (Kablosuz kulaklık)
- İlgilendiği kategoriler: ["Electronics", "Sports"]
- Sepette: ["PS5 Controller", "Gaming Mouse"]
- Risk durumu: DÜŞÜK

Email Konusu: "Ahmet, seni özel hissettirecek bir teklifimiz var"

AI Generated Email:
```
Merhaba Ahmet,

Sana özel bir sürprizimiz var! 🎉

Son kablosuz kulaklık alışverişinden bu yana 15 gün geçti. 
Sana benzersiz bir fiyatla bir ürün önermek istiyoruz:

🎧 SENİN İÇİN SEÇTİĞİMİZ: Sony WH-1000XM5
   Normal fiyat: ₺12,500
   Senin fiyatın: ₺9,999 ( %21 indirim )
   
Neden Bu Ürün?
• Sony'nin en iyi gürültü engelleme teknolojisi
• 30 saat pil ömrü
• SENİN zevkinize göre önerildi (Electronics tutkununa özel)

Sepetindeki PS5 Controller ile birlikte harika bir kombinasyon! 
Birlikte alırsan ₺500 ekstra indirim.

[Sepete Ekle] [Daha Fazla Keşfet]

Seni özel kılan biri olduğun için teşekkür ederiz,
enoca™ Ekibi
```

A/B Test Varyasyonları:
- Varyasyon A: Emosion vurgulu (yukarıdaki)
- Varyasyon B: Fiyat odaklı
- Varyasyon C: Kısa ve öz
```

---

### 7.3 OTOMASYON-R02: Cross-Sell Önerileri

#### 7.3.1 Association Rules

```javascript
const crossSellRules = {
  minSupport: 0.01,  // %1
  minConfidence: 0.5,  // %50
  maxRules: 1000,
  topRules: [
    {
      antecedent: ["Laptop"],
      consequent: ["Laptop Bag", "Mouse", "Headset"],
      confidence: 0.72,
      lift: 3.2,
      description: "Laptop alan müşteriler %72 ihtimalle aksesuar alıyor"
    },
    {
      antecedent: ["Smartphone"],
      consequent: ["Phone Case", "Screen Protector", "Wireless Charger"],
      confidence: 0.68,
      lift: 2.9,
      description: "Telefon alanlar koruma aksesuarı istiyor"
    },
    {
      antecedent: ["Camera"],
      consequent: ["Memory Card", "Camera Bag", "Tripod"],
      confidence: 0.65,
      lift: 2.8,
      description: "Kamera ile birlikte記憶 kart en çok satan aksesuar"
    }
  ]
}
```

#### 7.3.2 AI Ürün Açıklaması

```markdown
## Cross-Sell AI Açıklama Agent

Ana Ürün: MacBook Air M3
Satın Alma: Ahmet (Loyal müşteri)

Birlikte Satın Alınan: Apple AirPods Pro

AI Generated Açıklama:
```
Ahmet, MacBook Air'in için mükemmel bir tamamlayıcı: AirPods Pro!

Neden Birlikte Harika?
✓ Aynı Apple ekosistemi - tek dokunuşla geçiş
✓ MacBook'ta işitişirken AirPods ile müzik keyfi
✓ Gürültü engelleme - dış dünya kapalı, konsantrasyon açık
✓ Uzun pil ömrü - 6 saat tek şarjla

Özel Paket: MacBook + AirPods Pro = ₺2,000 tasarruf
(Hepsin  bir arada, tek kargo, tek paket)
```

Bu açıklama:
- Emotional connection kuruyor
- Ecosystem avantajını vurguluyor
- Somut fayda sağlıyor
- Aciliyet yaratıyor
```

---

### 7.4 OTOMASYON-R03: CLV Tahmini

#### 7.4.1 Customer Lifetime Value Model

```javascript
const clvModel = {
  timeHorizon: 365, // 1 yıl
  discountRate: 0.1, // %10
  modelType: "PROBABILISTIC",
  
  features: [
    "total_orders",
    "average_order_value",
    "order_frequency",
    "recency_days",
    "product_categories_count",
    "promo_usage_rate",
    "return_rate",
    "session_duration",
    "page_views",
    "add_to_cart_rate"
  ],
  
  predictions: [
    {
      customerId: "CUST_12345",
      clvPrediction: {
        low: 25000,
        expected: 42000,
        high: 58000,
        probability: 0.85
      },
      churnProbability: 0.15,
      nextPurchaseEstimate: "14 days",
      recommendedActions: [
        { type: "UPSELL", probability: 0.72 },
        { type: "RETAIN", probability: 0.65 },
        { type: "CROSS_SELL", probability: 0.58 }
      ]
    }
  ]
}
```

---

### 7.5 OTOMASYON-R04: Arama Optimizasyonu

#### 7.5.1 Semantic Search Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                 SEMANTIC SEARCH OPTİMİZASYONU                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Kullanıcı Araması: "fotomakıne"]                              │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 1. NLP ANALİZ   │                                            │
│  │ • "fotomakine"  │──▶ [typo, Turkish spelling]                 │
│  │ • intent: SEARCH│──▶ [PRODUCT_QUERY]                          │
│  │ • entities: []  │                                            │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 2. VECTOR SEARCH │                                            │
│  │ Query embedding │                                            │
│  │ Cosine similarity│                                           │
│  │ Top 100 results │                                            │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 3. LLM RERANK   │                                            │
│  │ Gemini ile      │──▶ Re-rank by relevance                     │
│  │ yeniden sırala │──▶ Context-aware scoring                     │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 4. BUSINESS RULES│                                           │
│  │ • Stock status  │──▶ Prioritize in-stock                       │
│  │ • Margins      │──▶ Higher margin products boost             │
│  │ • Promotions   │──▶ Sale items highlighted                    │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  [Sonuç: Canon EOS R5, Nikon Z6, Sony A7 IV...]                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 7.5.2 AI Search Enhancement

```markdown
## AI Search Understanding Agent

Arama: "en iyi fotoğraf makinesi"
Context: Kullanıcı profili (amateur photographer, budget: medium)

AI Analiz:
{
  "searchIntent": {
    "primary": "PRODUCT_RECOMMENDATION",
    "secondary": ["COMPARISON", "EDUCATION"]
  },
  "entityExtraction": {
    "products": [],
    "brands": ["Canon", "Nikon", "Sony"],
    "features": ["photo", "camera"],
    "qualifiers": ["best", "top"]
  },
  "constraints": {
    "budget": "medium",
    "skillLevel": "amateur",
    "useCase": "daily,hobby"
  },
  "queryExpansion": [
    "en iyi fotoğraf makinesi 2026",
    "amateur photographers favorite camera",
    "best mirrorless camera under 50000"
  ],
  "responseStrategy": {
    "showComparison": true,
    "includeBuyingGuide": true,
    "highlightBestValue": true
  }
}
```

---

### 7.6 OTOMASYON-R05: Trend Ürün Keşfi

```javascript
const trendDetection = {
  signals: [
    {
      source: "SEARCH_QUERIES",
      window: "7 days",
      metrics: ["volume_increase", "new_queries"],
      alertThreshold: { volumeIncrease: 3, newQueries: 50 }
    },
    {
      source: "SOCIAL_MEDIA",
      window: "24 hours",
      metrics: ["mentions", "sentiment"],
      alertThreshold: { mentions: 1000, sentiment: 0.7 }
    },
    {
      source: "SALES_DATA",
      window: "3 days",
      metrics: ["units_sold", "velocity"],
      alertThreshold: { velocityIncrease: 2.5 }
    },
    {
      source: "INVENTORY",
      window: "real-time",
      metrics: ["stockout_rate", "restock_speed"],
      alertThreshold: { stockoutRate: 0.3 }
    }
  ],
  trendCategories: [
    "RISING",    // Hızlı büyüme
    "VIRAL",     // Ani popülerlik
    "SEASONAL",  // Mevsimsel
    "EMERGING"   // Yeni trend
  ],
  actions: [
    "INVENTORY_ALERT",
    "MARKETING_CAMPAIGN",
    "PRICE_OPTIMIZATION",
    "MERCHANDISING_UPDATE"
  ]
}
```

---

### 7.7 OTOMASYON-R06: Churn Prevention

#### 7.7.1 Churn Risk Tespiti

```markdown
## Churn Prediction Agent

Müşteri Profili:
- Müşteri ID: CUST_789
- Son aktivite: 45 gün önce
- Toplam sipariş: 8
- Toplam harcama: ₺18,500
- Ortalama sipariş: ₺2,312
- En son sipariş: Elektronik aksesuar
- Email açılma oranı: %15 (düşük)
- Son kampanyaya katılım: Yok

Churn Risk Analizi:
{
  "churnProbability": 0.72,
  "riskLevel": "HIGH",
  "keyFactors": [
    { factor: "Recency", contribution: 0.35, direction: "negative" },
    { factor: "Low engagement", contribution: 0.25, direction: "negative" },
    { factor: "No recent campaigns", contribution: 0.15, direction: "negative" }
  ],
  "similarCustomers": [
    { id: "CUST_456", outcome: "churned", timeToChurn: "30 days" },
    { id: "CUST_321", outcome: "reactivated", intervention: "WIN_BACK" }
  ]
}

Önerilen Aksiyonlar:
1. [YÜKSEK] Kişiselleştirilmiş win-back email + %20 indirim
2. [ORTA] Son viewed ürünler için notification
3. [ORTA] Yeni arrivals bildirimi
4. [DÜŞÜK] Sadakat puanı bonusu

Automated Actions:
- Win-back email sequence başlat (3 email, 7 gün)
- CRM'de görev oluştur (Customer success)
- Dashboard'da "At Risk" olarak işaretle
```

---

## 8. EnoCart - AI Otomasyonları

### 8.1 EnoCart AI Otomasyon Haritası

```
┌────────────────────────────────────────────────────────────────┐
│                  ENOCART AI OTOMASYONLARI                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 IoT SENSOR HUB                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ ESP32    │  │ Weight   │  │  QR/Bar  │              │  │
│  │  │ Modules  │  │ Sensors  │  │  Scanner │              │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │  │
│  │       └────────────┼────────────┘                       │  │
│  │                    ▼                                      │  │
│  │           ┌─────────────────┐                           │  │
│  │           │ Sensor Fusion  │                           │  │
│  │           │   Engine        │                           │  │
│  │           └────────┬────────┘                           │  │
│  └────────────────────┼────────────────────────────────────┘  │
│                       │                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Theft      │  │  Queue      │  │  Inventory  │        │
│  │  Detection  │  │  Prediction  │  │  Restock   │        │
│  │  Agent      │  │  Agent       │  │  Agent      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Customer   │  │  Conveyor    │  │  Real-time  │        │
│  │  Sentiment  │  │  Optimize    │  │  Dashboard   │        │
│  │  Analysis   │  │  Agent       │  │  Agent       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 8.2 OTOMASYON-CART01: Hırsızlık/Sahtekarlık Tespiti

#### 8.2.1 Anomali Tespit Kriterleri

| Anomali Tipi | Sensör Verisi | Eşik | Aksiyon |
|--------------|---------------|------|---------|
| **Ağırlık Uyuşmazlığı** | Weight mismatch | > 50g fark | Alert + Review |
| **Tarama Atlaması** | Scan pattern gap | 3+ ürün atlanırsa | Alert |
| **Hızlı Tarama** | Scan velocity | < 2 sn/ürün | Warning |
| **Şüpheli Pozisyon** | Camera + Weight | Position anomaly | Record + Alert |
| **Sistem Dışı Ürün** | Unknown barcode | Bilinmeyen ürün | Block + Review |

#### 8.2.2 AI Anomali Detection

```javascript
const theftDetectionModel = {
  inputFeatures: [
    "scan_interval_ms",
    "weight_delta_grams",
    "barcode_success_rate",
    "camera_position_x",
    "camera_position_y",
    "session_duration",
    "items_count",
    "avg_price_per_item",
    "payment_method"
  ],
  
  thresholds: {
    anomalyScore: 0.7,
    criticalScore: 0.9
  },
  
  outputActions: {
    LOW_RISK: { level: "INFO", log: true, notify: false },
    MEDIUM_RISK: { level: "WARNING", log: true, notify: true, retainFootage: true },
    HIGH_RISK: { level: "ALERT", log: true, notify: true, retainFootage: true, blockSession: false },
    CRITICAL: { level: "BLOCK", log: true, notify: true, retainFootage: true, blockSession: true }
  }
}
```

#### 8.2.3 n8n IoT Workflow

```json
{
  "name": "CART-AI-001: Sahtekarlık Tespiti",
  "trigger": {
    "type": "MQTT",
    "topic": "enocart/sensors/#"
  },
  "nodes": [
    {
      "name": "MQTT Sensor Data",
      "type": "MQTT",
      "parameters": {
        "topic": "enocart/sensors/session/{sessionId}",
        "qos": 1
      }
    },
    {
      "name": "Veri Normalizasyonu",
      "type": "Code",
      "function": "normalizeSensorData"
    },
    {
      "name": "Anomali Skoru Hesaplama",
      "type": "AI Agent",
      "model": "gemini-2.0-flash",
      "prompt": "Sensör verilerini analiz et: {{ $json.sensorData }}. Sahtekarlık riski var mı?"
    },
    {
      "name": "Risk Değerlendirme",
      "type": "Switch",
      "rules": {
        "CRITICAL": "{{ $json.anomalyScore }} > 0.9",
        "HIGH": "{{ $json.anomalyScore }} > 0.7",
        "MEDIUM": "{{ $json.anomalyScore }} > 0.5",
        "LOW": "true"
      }
    }
  ]
}
```

---

### 8.3 OTOMASYON-CART02: Kuyruk Tahmini

#### 8.3.1 Queue Time Prediction

```javascript
const queuePrediction = {
  features: [
    "current_queue_length",
    "avg_service_time_per_item",
    "hour_of_day",
    "day_of_week",
    "is_holiday",
    "weather_condition",
    "store_traffic_history",
    "promotion_active"
  ],
  
  predictionHorizon: {
    shortTerm: "15 minutes",
    mediumTerm: "1 hour",
    longTerm: "4 hours"
  },
  
  outputs: {
    estimatedWaitTime: "minutes",
    confidenceInterval: [lower, upper],
    recommendedActions: [
      "OPEN_ADDITIONAL_CHECKOUT",
      "REDIRECT_TO_SELF_CHECKOUT",
      "NOTIFY_CUSTOMERS"
    ]
  }
}
```

---

### 8.4 OTOMASYON-CART03: Envanter Restok

#### 8.4.1 Demand Forecasting

```javascript
const inventoryRestock = {
  forecastModels: {
    shortTerm: {
      horizon: "7 days",
      granularity: "hourly",
      useCases: ["Daily replenishment", "Shift planning"]
    },
    mediumTerm: {
      horizon: "30 days",
      granularity: "daily",
      useCases: ["Weekly ordering", "Storage planning"]
    },
    longTerm: {
      horizon: "90 days",
      granularity: "weekly",
      useCases: ["Supplier contracts", "Budget planning"]
    }
  },
  
  reorderPolicy: {
    reorderPoint: {
      safetyStock: 10,
      leadTimeDays: 3,
      serviceLevel: 0.95
    },
    economicOrderQuantity: {
      formula: "EOQ",
      assumptions: {
        orderingCost: 500,
        holdingCostRate: 0.25,
        annualDemand: "calculated"
      }
    }
  }
}
```

---

### 8.5 OTOMASYON-CART04: Müşteri Duygu Analizi

```javascript
const sentimentAnalysis = {
  input: {
    cameraFrames: "Real-time video stream",
    sampleRate: "1 frame per 5 seconds",
    processing: "Edge inference"
  },
  
  model: {
    type: "FacialExpressionRecognition",
    framework: "TensorFlow Lite",
    classes: ["Happy", "Neutral", "Frustrated", "Confused"],
    accuracy: 0.89
  },
  
  outputs: {
    aggregateSentiment: {
      happy: 0.65,
      neutral: 0.25,
      frustrated: 0.07,
      confused: 0.03
    },
    alerts: {
      frustratedThreshold: 0.15,
      confusedThreshold: 0.10
    },
    actions: [
      "SEND_ASSISTANCE",
      "IMPROVE_WAYFINDING",
      "STAFF_ALERT"
    ]
  }
}
```

---

### 8.6 OTOMASYON-CART05: Konveyör Optimizasyonu

```javascript
const conveyorOptimization = {
  objective: "Minimize average delivery time",
  
  inputs: [
    "package_weights",
    "package_sizes",
    "destination_zones",
    "current_congestion",
    "conveyor_speed_limits",
    "sorting_capabilities"
  ],
  
  optimizationModel: {
    type: "REINFORCEMENT_LEARNING",
    state: {
      queueLengths: [],
      currentAssignments: [],
      conveyorSpeeds: []
    },
    actions: [
      "ASSIGN_TO_ZONE",
      "ADJUST_SPEED",
      "OPEN_NEW_LANE"
    ],
    reward: "-wait_time -energy_cost +accuracy"
  },
  
  realTimeAdjustments: {
    interval: "30 seconds",
    optimizationWindow: "5 minutes"
  }
}
```

---

## 9. Cross-Proje AI Workflow'ları

### 9.1 Enterprise AI Orchestration

```
┌─────────────────────────────────────────────────────────────────────────┐
│              CROSS-PROJE AI ORCHESTRATION                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     SUPERVISOR AGENT                              │  │
│  │  (n8n Master Workflow)                                             │  │
│  │                                                                    │  │
│  │  Responsibilities:                                                 │  │
│  │  • High-level task decomposition                                   │  │
│  │  • Resource allocation                                             │  │
│  │  • Cross-system coordination                                       │  │
│  │  • Final decision making                                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│          ┌───────────────────┼───────────────────┐                      │
│          │                   │                   │                      │
│          ▼                   ▼                   ▼                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │  KEP        │    │  EnoPrice   │    │  EnoRep     │               │
│  │  Agent      │    │  Agent       │    │  Agent       │               │
│  │              │    │              │    │              │               │
│  │ • Veri yönet │    │ • Fiyat     │    │ • Öneri     │               │
│  │ • Sipariş   │    │ • Rakip     │    │ • Kişiselleş │               │
│  │ • Stok      │    │ • Kampanya  │    │ • CLV        │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│          │                   │                   │                      │
│          └───────────────────┼───────────────────┘                      │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    RESULT AGGREGATION                             │  │
│  │  • Combine outputs                                                │  │
│  │  • Resolve conflicts                                               │  │
│  │  • Generate unified response                                      │  │
│  │  • Execute actions                                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2 WORKFLOW-X01: Müşteri Yaşam Döngüsü Otomasyonu

```markdown
## Müşteri Yaşam Döngüsü AI Orchestration

Trigger: Müşteri olayı (yeni kayıt, sipariş, iade, churn risk)

### Senaryo: Yeni Müşteri Onboarding

1. KEP Agent:
   - Hesap oluştur
   - Tercihleri kaydet
   - Welcome sequence başlat

2. EnoRep Agent:
   - İlk segmentasyon yap
   - Kişiselleştirilmiş ürün önerisi oluştur
   - Email sequence tasarla

3. EnoPrice Agent:
   - First-time buyer indirimi hesapla
   - Bütçe dahilinde öneriler sun

4. Connector Agent (varsa):
   - Diğer platformlarda aynı müşteriyi ara
   - Unified customer view oluştur

### Çıktı:
- Koordineli onboarding deneyimi
- Tek CRM kaydı
- Tüm sistemlerde tutarlı müşteri görünümü
```

### 9.3 WORKFLOW-X02: Kampanya Yürütme

```
┌─────────────────────────────────────────────────────────────────┐
│           KAMPANYA YÜRÜTME WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Marketing Kararı: "Yeni sezon laptop kampanyası başlat"]       │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 1. KAMPANYA    │                                            │
│  │ PARAMETRELERİ  │                                            │
│  │ • Hedef segment │                                           │
│  │ • Bütçe         │                                           │
│  │ • Süre          │                                           │
│  │ • Ürünler       │                                           │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 2. ENOPRICE    │                                            │
│  │ AI Agent:      │──────▶ Optimal fiyatlandırma                │
│  │ • Rakip analizi│──────▶ İndirim stratejisi                   │
│  │ • Marj hesaplama│──────▶ Karlılık projeksiyonu               │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 3. ENOREP      │                                            │
│  │ AI Agent:      │──────▶ Segmentasyon                         │
│  │ • CLV scoring │──────▶ Öneri kişiselleştirme                 │
│  │ • Churn risk  │──────▶ Kampanya önceliklendirme              │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 4. KEP         │                                            │
│  │ • Kampanya oluştur │                                         │
│  │ • Email template │───▶ [Otomatik gönderim başlar]            │
│  │ • Landing page   │───▶ [Özel sayfa aktif]                  │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 5. CONNECTOR   │                                            │
│  │ • Trendyol bild │─────▶ Platformlara kampanya duyurusu         │
│  │ • Hepsiburada   │─────▶ Senkron fiyat güncellemesi            │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ 6. İZLEME      │                                            │
│  │ • Real-time KPI│─────▶ Dashboard güncelleme                   │
│  │ • A/B test     │─────▶ Sürekli optimizasyon                  │
│  │ • Alert rules  │─────▶ Anomali tespiti                        │
│  └─────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.4 WORKFLOW-X03: Olaysal Fiyatlandırma

```javascript
const eventBasedPricing = {
  trigger: {
    type: "REAL_TIME_EVENT",
    sources: [
      "COMPETITOR_PRICE_CHANGE",
      "INVENTORY_LEVEL_CHANGE",
      "DEMAND_SPIKE",
      "EXTERNAL_EVENT"
    ]
  },
  
  eventResponses: {
    COMPETITOR_PRICE_CHANGE: {
      threshold: 5, // %5 değişim
      responseTime: "< 15 minutes",
      agents: ["EnoPrice", "Connector"],
      actions: [
        "Analyze competitor move",
        "Calculate optimal response",
        "Recommend price adjustment",
        "Execute if approved"
      ]
    },
    
    INVENTORY_LEVEL_CHANGE: {
      scenarios: {
        LOW_STOCK: {
          threshold: "< 10 units",
          response: "PRICE_UP"
        },
        OVERSTOCK: {
          threshold: "> 100 units, age > 30 days",
          response: "PROMOTION"
        }
      }
    },
    
    DEMAND_SPIKE: {
      indicators: [
        "search_volume > 3x normal",
        "add_to_cart_rate > 50% increase",
        "social_media mentions > threshold"
      ],
      response: "DYNAMIC_PRICE_ADJUSTMENT"
    },
    
    EXTERNAL_EVENT: {
      examples: [
        "BLACK_FRIDAY",
        "RAMADAN",
        "COMPETITOR_SALE",
        "SUPPLY_SHOCK"
      ],
      response: "STRATEGIC_PRICE_PLAN"
    }
  }
}
```

### 9.5 WORKFLOW-X04: Entegre Stok Yönetimi

```
┌─────────────────────────────────────────────────────────────────┐
│           ENTEGRE STOK YÖNETİMİ WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐                                                 │
│  │ ENOCART    │                                                 │
│  │ (Fiziksel) │───────┐                                         │
│  └─────────────┘       │ Physical inventory count                │
│                       │                                         │
│  ┌─────────────┐       │                                         │
│  │ KEP         │───────┼──────▶ UNIFIED INVENTORY VIEW          │
│  │ (Online)    │───────┤                                         │
│  └─────────────┘       │                                         │
│                       │                                         │
│  ┌─────────────┐       │                                         │
│  │ CONNECTOR   │───────┘                                         │
│  │ (Marketplace│                                               │
│  └─────────────┘       │                                         │
│                                                                  │
│  AI Agents:                                                         │
│  • Unified stock calculation                                       │
│  • Allocation optimization                                         │
│  • Restock prediction                                              │
│  • Distribution strategy                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Entegrasyon API Spesifikasyonları

### 10.1 n8n API Node Yapılandırmaları

#### 10.1.1 KEP API Entegrasyonu

```javascript
const kepApiNode = {
  name: "KEP API",
  type: "httpRequest",
  parameters: {
    method: "POST",
    url: "https://kep-api.enoca.com/v1/{{ $param.endpoint }}",
    authentication: "genericCredentialType",
    genericAuthType: "apiKey",
    headers: {
      "Authorization": "Bearer {{ $credentials.kepApi.apiKey }}",
      "Content-Type": "application/json",
      "X-Request-ID": "{{ $uuid() }}"
    }
  },
  operations: {
    createOrder: {
      endpoint: "orders",
      mapInput: {
        customerId: "{{ $json.customer.id }}",
        items: "{{ $json.order.items }}",
        shippingAddress: "{{ $json.address }}"
      }
    },
    updateStock: {
      endpoint: "inventory/update",
      mapInput: {
        productId: "{{ $json.product.sku }}",
        quantity: "{{ $json.stock.delta }}",
        warehouseId: "{{ $json.warehouse.id }}"
      }
    },
    getCustomer: {
      endpoint: "customers/{{ $param.customerId }}",
      responseMapping: "{{ $json }}"
    }
  }
}
```

#### 10.1.2 EnoPrice API Entegrasyonu

```javascript
const enopriceApiNode = {
  name: "EnoPrice API",
  type: "httpRequest",
  parameters: {
    baseURL: "https://enoprice-api.enoca.com/api/v1",
    auth: {
      type: "OAuth2",
      clientId: "{{ $credentials.enoprice.clientId }}",
      clientSecret: "{{ $credentials.enoprice.clientSecret }}"
    }
  },
  endpoints: {
    getPriceRecommendation: {
      method: "POST",
      path: "/ai/recommend-price",
      body: {
        productId: "{{ $json.productId }}",
        context: {
          stockLevel: "{{ $json.stock }}",
          competitorAvg: "{{ $json.competitorPrice }}",
          costBasis: "{{ $json.costPrice }}"
        }
      }
    },
    createCampaign: {
      method: "POST",
      path: "/campaigns",
      body: "{{ $json.campaignParams }}"
    },
    getAnalytics: {
      method: "GET",
      path: "/analytics/price-history/{{ $param.productId }}"
    }
  }
}
```

#### 10.1.3 EnoRep API Entegrasyonu

```javascript
const enorepApiNode = {
  name: "EnoRep API",
  type: "httpRequest",
  endpoints: {
    getRecommendations: {
      method: "POST",
      url: "https://enorep-api.enoca.com/v1/recommend",
      body: {
        userId: "{{ $json.userId }}",
        context: {
          currentPage: "{{ $json.page }}",
          viewedProducts: "{{ $json.viewed }}",
          cartItems: "{{ $json.cart }}",
          limit: 10
        }
      }
    },
    submitEvent: {
      method: "POST",
      url: "https://enorep-api.enoca.com/v1/events",
      body: {
        userId: "{{ $json.userId }}",
        eventType: "{{ $json.eventType }}",
        payload: "{{ $json.payload }}",
        timestamp: "{{ $now() }}"
      }
    },
    getCLV: {
      method: "GET",
      url: "https://enorep-api.enoca.com/v1/customers/{{ $param.userId }}/clv"
    }
  }
}
```

#### 10.1.4 Connector API Entegrasyonu

```javascript
const connectorApiNode = {
  name: "Connector API",
  type: "httpRequest",
  endpoints: {
    syncProduct: {
      method: "POST",
      url: "https://connector-api.enoca.com/v1/sync/product",
      body: {
        source: "KEP",
        target: "{{ $param.platform }}", // Trendyol, Hepsiburada, Amazon
        product: "{{ $json.product }}",
        options: {
          updatePrice: true,
          updateStock: true,
          overwrite: false
        }
      }
    },
    getSyncStatus: {
      method: "GET",
      url: "https://connector-api.enoca.com/v1/sync/{{ $param.syncId }}"
    },
    resolveConflict: {
      method: "POST",
      url: "https://connector-api.enoca.com/v1/sync/conflict/resolve",
      body: {
        conflictId: "{{ $json.conflictId }}",
        resolution: "{{ $json.resolution }}", // KEP_SOURCE, PLATFORM_SOURCE, MERGE
        data: "{{ $json.mergeData }}"
      }
    }
  }
}
```

#### 10.1.5 EnoCart IoT Entegrasyonu

```javascript
const enocartIoTNode = {
  name: "EnoCart MQTT",
  type: "mqtt",
  parameters: {
    broker: "mqtt://enocart-mqtt.enoca.com:1883",
    clientId: "n8n-connector-{{ $uuid() }}",
    topics: [
      "enocart/session/+/sensors",
      "enocart/session/+/checkout",
      "enocart/alerts/#"
    ],
    qos: 1
  },
  messageFormats: {
    sensorData: {
      sessionId: "{{ topic_parts[2] }}",
      timestamp: "{{ $json.timestamp }}",
      data: {
        weight: "{{ $json.weight }}",
        barcode: "{{ $json.barcode }}",
        cameraEvents: "{{ $json.camera }}"
      }
    },
    alert: {
      sessionId: "{{ topic_parts[2] }}",
      alertType: "{{ $json.type }}", // THEFT, LOW_BATTERY, ERROR
      severity: "{{ $json.severity }}",
      details: "{{ $json.details }}"
    }
  }
}
```

---

## 11. Uygulama Yol Haritası

### 11.1 Faz Bazlı Uygulama Planı

#### Faz 1: Temel Altyapı (Ay 1-2)

| Görev | Hafta | Sorumlu | Çıktı |
|-------|-------|---------|-------|
| n8n kurulum ve konfigürasyon | 1-2 | DevOps | Çalışan n8n instance |
| Credential'ların oluşturulması | 2 | Security | API keys, OAuth2 |
| Temel API node'ları | 2-3 | Backend | HTTP node'ları |
| Error handling altyapısı | 3-4 | DevOps | Retry, circuit breaker |
| Monitoring dashboard | 4 | DevOps | Grafana + alerts |

#### Faz 2: KEP Otomasyonları (Ay 2-3)

| Otomasyon | Hafta | Öncelik | ROI |
|-----------|-------|---------|-----|
| KEP-AI-001: Sipariş İşleme | 5-7 | Kritik | %20 |
| KEP-AI-002: Müşteri Segmentasyonu | 7-8 | Yüksek | %15 |
| KEP-AI-003: Stok Uyarı | 8-9 | Yüksek | %10 |
| KEP-AI-004: RBAC Audit | 9-10 | Orta | %5 |

#### Faz 3: EnoPrice + Connector (Ay 3-4)

| Otomasyon | Hafta | Öncelik | ROI |
|-----------|-------|---------|-----|
| CONN-AI-001: Ürün Eşleştirme | 10-12 | Kritik | %25 |
| ENOPRICE-AI-001: Rakip İzleme | 11-13 | Kritik | %30 |
| ENOPRICE-AI-002: Fiyat Motoru | 12-15 | Kritik | %35 |
| CONN-AI-002: Stok Senkron | 13-14 | Yüksek | %15 |

#### Faz 4: EnoRep + EnoCart (Ay 4-5)

| Otomasyon | Hafta | Öncelik | ROI |
|-----------|-------|---------|-----|
| ENOREP-AI-001: Email Person. | 15-17 | Yüksek | %30 |
| ENOCART-AI-001: Hırsızlık Tespiti | 16-18 | Yüksek | %20 |
| ENOREP-AI-002: CLV Tahmini | 17-19 | Orta | %25 |
| CROSS-AI-001: Orchestration | 18-20 | Orta | %40 |

### 11.2 Kaynak Tahmini

| Rol | Kişi | Süre | Not |
|-----|------|------|-----|
| n8n Developer | 1-2 | 5 ay | Workflow geliştirme |
| AI/ML Engineer | 1 | 3 ay | Model fine-tuning, prompt müh. |
| Backend Engineer | 1 | 2 ay | API entegrasyonları |
| DevOps | 0.5 | 2 ay | Altyapı, monitoring |
| Ürün Yöneticisi | 0.5 | 5 ay | Prioritization, testing |

### 11.3 Başarı Kriterleri

| Faz | Kriter | Hedef |
|-----|--------|-------|
| Faz 1 | n8n uptime | > 99.5% |
| Faz 2 | Sipariş işleme başarı | > 99% |
| Faz 3 | Fiyat öneri doğruluğu | > 85% |
| Faz 4 | Kişiselleştirme conversion | > %10 lift |
| Tümü | Toplam ROI (12 ay) | > %200 |

---

## 12. Güvenlik ve İzleme

### 12.1 Güvenlik Önlemleri

#### 12.1.1 Credential Yönetimi

```yaml
security:
  credentials:
    encryption: AES-256
    rotation:
      api_keys: "90 days"
      oauth_tokens: "30 days"
    storage: "HashiCorp Vault"
    
  access_control:
    principle: "least_privilege"
    review_frequency: "monthly"
    mfa_required: true
```

#### 12.1.2 API Rate Limiting

```javascript
const rateLimits = {
  global: {
    requests: 1000,
    window: "1 minute"
  },
  per_endpoint: {
    "/ai/recommend": { requests: 100, window: "1 minute" },
    "/orders": { requests: 50, window: "1 minute" },
    "/sync": { requests: 30, window: "1 minute" }
  },
  circuit_breaker: {
    failure_threshold: 5,
    reset_timeout: 60,
    half_open_requests: 3
  }
}
```

#### 12.1.3 Audit Logging

```javascript
const auditLog = {
  captured_events: [
    "credential_access",
    "workflow_execution",
    "api_call",
    "data_modification",
    "error_occurrence",
    "security_event"
  ],
  log_format: {
    timestamp: "ISO8601",
    actor: "user_id or system",
    action: "event_type",
    resource: "affected_entity",
    result: "success/failure",
    metadata: {}
  },
  retention: {
    hot_storage: "30 days",
    cold_storage: "1 year"
  }
}
```

### 12.2 İzleme ve Alerting

#### 12.2.1 KPI Dashboard

| Metrik | Hedef | Alert Eşiği |
|--------|-------|-------------|
| Workflow Success Rate | > 99% | < 95% |
| Avg Execution Time | < 30s | > 60s |
| Error Rate | < 1% | > 5% |
| AI Accuracy | > 85% | < 75% |
| Cost per Execution | < $0.01 | > $0.05 |

#### 12.2.2 Alerting Rules

```yaml
alerts:
  - name: "workflow_failure"
    condition: "success_rate < 95%"
    severity: "HIGH"
    channels: ["slack", "email"]
    
  - name: "high_latency"
    condition: "p95_execution_time > 60s"
    severity: "MEDIUM"
    channels: ["slack"]
    
  - name: "ai_accuracy_drop"
    condition: "accuracy < 75%"
    severity: "CRITICAL"
    channels: ["slack", "email", "pagerduty"]
    
  - name: "cost_anomaly"
    condition: "cost > 2x average"
    severity: "MEDIUM"
    channels: ["slack"]
```

---

## 13. Metrikler ve KPI'lar

### 13.1 Operasyonel KPI'lar

| KPI | Hesaplama | Hedef | Mevcut |
|-----|-----------|-------|--------|
| **Otomasyon Coverage** | Otomasyonlarla işlenen işlem / Toplam işlem | > %80 | %35 |
| **Workflow Success Rate** | (Başarılı / Toplam) × 100 | > 99% | %97 |
| **Mean Time to Recovery** | Toplam downtime / Incident count | < 15 min | 45 min |
| **False Positive Rate** | Yanlış pozitif / Toplam pozitif | < %5 | %12 |
| **Cost per Transaction** | Toplam maliyet / İşlem sayısı | < $0.01 | $0.025 |

### 13.2 İş KPI'ları

| KPI | Öncesi | Hedef | ROI Hesaplaması |
|-----|--------|-------|-----------------|
| **Sipariş İşleme Süresi** | 4.2 dk | 8 sn | - |
| **Manuel Fiyat Güncelleme** | 2 saat/gün | 0 (otomatik) | 20 saat/ay |
| **Müşteri Segmentasyonu** | Haftalık | Günlük | - |
| **Kampanya Hazırlık Süresi** | 1 hafta | 1 gün | - |
| **Churn Rate** | %8 | < %5 | %38 azalma |

### 13.3 AI Performans Metrikleri

| AI Model | Metrik | Hedef | Değerlendirme Yöntemi |
|----------|--------|-------|----------------------|
| **Fiyat Öneri** | MAPE (Mean Abs. % Error) | < 10% | A/B test |
| **Öneri Engine** | CTR (Click-through rate) | > %15 | Click tracking |
| **Churn Prediction** | F1 Score | > 0.85 | Historical validation |
| **Anomali Tespiti** | Precision / Recall | > 0.90 / > 0.85 | Labeled dataset |
| **Email Personalization** | Conversion Rate | > %5 | A/B test |

---

## 14. Ekler

### 14.1 Terimler Sözlüğü

| Terim | Açıklama |
|-------|----------|
| **Agent** | AI görevlerini yerine getiren otonom birim |
| **CLV** | Customer Lifetime Value - müşterinin yaşam boyu değeri |
| **Connector** | Farklı sistemleri birbirine bağlayan katman |
| **Cross-Sell** | Mevcut ürünle birlikte ilgili ürün satma |
| **Dynamic Pricing** | Piyasa koşullarına göre anlık fiyatlandırma |
| **EnoCart** | Fiziksel mağaza için akıllı alışveriş sistemi |
| **EnoPrice** | AI destekli dinamik fiyatlama sistemi |
| **EnoRep** | Ürün öneri ve kişiselleştirme sistemi |
| **KEP** | Kurumsal E-Ticaret Platformu |
| **MAPE** | Mean Absolute Percentage Error |
| **n8n** | Workflow otomasyon platformu |
| **RAG** | Retrieval Augmented Generation |
| **RBAC** | Role-Based Access Control |
| **RFM** | Recency, Frequency, Monetary |
| **ROI** | Return on Investment |

### 14.2 Referans Dokümanlar

1. **n8n Documentation**: https://docs.n8n.io/
2. **LangChain Agent Documentation**: https://docs.langchain.com/
3. **Google Gemini API**: https://ai.google.dev/
4. **enoca KEP API Docs**: (internal)
5. **enoca Connector Docs**: (internal)
6. **enoca EnoPrice Docs**: (internal)
7. **enoca EnoRep Docs**: (internal)
8. **enoca EnoCart Docs**: (internal)

### 14.3 Template Koleksiyonu

#### Workflow Template Listesi

| Template ID | Ad | Proje | Durum |
|-------------|-----|-------|-------|
| TPL-KEP-001 | Sipariş İşleme | KEP | Hazır |
| TPL-KEP-002 | Müşteri Segmentasyonu | KEP | Hazır |
| TPL-CONN-001 | Platform Eşleştirme | Connector | Geliştirme |
| TPL-PRICE-001 | Rakip Fiyat İzleme | EnoPrice | Hazır |
| TPL-PRICE-002 | Fiyat Karar Motoru | EnoPrice | Geliştirme |
| TPL-REP-001 | Email Personalization | EnoRep | Hazır |
| TPL-CART-001 | Hırsızlık Tespiti | EnoCart | Geliştirme |

### 14.4 Versiyon Geçmişi

| Versiyon | Tarih | Yazar | Değişiklikler |
|----------|-------|-------|---------------|
| 1.0 | 25.06.2026 | enoca AR-GE | İlk versiyon |

---

**Dokümantasyon Sonu**

*Bu dokümantasyon enoca™ e-ticaret ekosistemi için AI otomasyon fırsatlarını detaylı olarak açıklamaktadır. Tüm haklar enoca™'ya aittir.*
