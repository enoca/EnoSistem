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
