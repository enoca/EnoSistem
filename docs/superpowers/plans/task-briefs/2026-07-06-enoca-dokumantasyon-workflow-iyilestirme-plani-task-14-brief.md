### Task 14: HTML dokümanlarına içindekiler (TOC) ekle

**Files:**
- Modify: `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`

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