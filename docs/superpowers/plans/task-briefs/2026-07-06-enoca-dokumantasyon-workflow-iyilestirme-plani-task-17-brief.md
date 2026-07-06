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