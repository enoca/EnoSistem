### Task 13: İletişim bilgisi eklenmemiş dokümanlara ekle

**Files:**
- Modify: `EnoRep_Proje Dokümanı/EnoRep_Proje_Raporu.html`
- Modify: `Enoprice_Proje Dokümanı/EnoPrice_Ozet.html`
- Modify: `Enocart_Proje Dokümanı/EnoCart_Dokumantasyon.html`

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