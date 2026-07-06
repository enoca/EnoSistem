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
