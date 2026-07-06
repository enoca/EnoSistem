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
