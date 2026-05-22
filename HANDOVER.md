# āPO Project — Handover Document

> ภาษาไทย / English (bilingual)

---

## 1. โครงสร้างโปรเจกต์ / Project Structure

โปรเจกต์นี้ใช้สถาปัตยกรรมแบบ **Single-File Web Application** — ทุกอย่างอยู่ในไฟล์เดียว

This project uses a **Single-File Web Application** architecture — everything lives in one file.

```
apo-stock/
├── index.html                  ← ไฟล์หลัก / Main file (HTML + CSS + JS)
├── apps-script/
│   ├── ImportStock.gs          ← นำเข้าปลาจากชาวประมง → Stock ที่จะขาย
│   └── RecordSale.gs           ← บันทึกการขาย → ปลาที่ขายไปแล้ว
└── .github/
    └── workflows/
        ├── deploy.yml          ← Auto-deploy to GitHub Pages on push to main
        └── pr-check.yml        ← HTML validation on pull requests
```

> **หมายเหตุ:** ไฟล์ `.gs` ใน folder นี้คือ **backup/reference** เท่านั้น
> ของจริงที่ใช้งานอยู่ที่ **script.google.com** (Google Apps Script project ของ āPO)

---

## 2. ไฟล์หลัก / Main File (`index.html`)

ไฟล์เดียวนี้ประกอบด้วย 3 ส่วน:

| ส่วน / Section | รายละเอียด / Details |
|---|---|
| **HTML** | Header (Logo, Tabs) + Container สำหรับแสดงสินค้า |
| **CSS** (`<style>`) | ใช้ `:root` variables คุมสีธีม, Flexbox สำหรับ layout, CSS Grid สำหรับการ์ดสินค้า (responsive) |
| **JavaScript** (`<script>`) | ดึงข้อมูลจาก API → render การ์ดสินค้าอัตโนมัติ |

---

## 3. แหล่งข้อมูล / Data Source

### Google Sheets + Google Apps Script

| ระบบ | URL |
|---|---|
| **Google Form** (ชาวประมงกรอก) | https://forms.gle/oo5p5TmVtR49HijP7 |
| **Google Sheets** (ข้อมูลทั้งหมด) | https://docs.google.com/spreadsheets/d/1681oFVd80odwKx_9mx5aG4-NOVLGIC7Sxu4RmwMr3mA/edit |
| **Apps Script API** (ตัวกลาง → JSON) | https://script.google.com/macros/s/AKfycbwWBH-Bcvh8W6LNLbLMIkQxizQsAG6yNYnTUeoHV6aRIPT8VFa_N6AdQuDQCqtumsGxTA/exec |

- จุดเชื่อมต่อในโค้ด: ตัวแปร `const API = "..."` ใน `index.html`

> ⚠️ **อย่าลบหรือเปลี่ยนค่า `API`** ถ้าไม่ได้แก้ที่ตัว Google Apps Script ด้วย
>
> ⚠️ **Do not delete or change the `API` variable** unless you also update the Google Apps Script deployment.

### Google Sheets — โครงสร้าง Sheet

| Sheet | หน้าที่ |
|---|---|
| **Stock จากชาวประมง** | ชาวประมงส่งข้อมูลเข้ามา (ต้นทาง) |
| **Stock ที่จะขายให้ลูกค้า** | ปลาที่ผ่านการ approve แล้ว พร้อมขาย |
| **ปลาที่ขายไปแล้ว** | บันทึกการขาย (สร้างอัตโนมัติครั้งแรก) |

### Google Apps Script — ไฟล์และ Functions

**`ImportStock.gs`** — จัดการ stock นำเข้า

| Function | หน้าที่ |
|---|---|
| `onOpen()` | สร้างเมนู "🐟 Apo Stock" ใน Google Sheets |
| `getRawStock()` | ดึงปลาใหม่จาก Sheet 1 (ยังไม่ Publish) |
| `importSelectedFish()` | ย้ายปลาที่เลือก → Sheet 2 + ใส่สูตรราคารวม |
| `getCategory()` | แยกหมวด ปลา / หอย/ทะเล อัตโนมัติ |
| `getSidebarHtml()` | UI Sidebar สำหรับเลือกปลา |

**`RecordSale.gs`** — บันทึกการขาย

| Function | หน้าที่ |
|---|---|
| `getLiveStock()` | ดึงปลาที่สถานะ "พร้อมขาย" จาก Sheet 2 |
| `recordSale()` | บันทึกผู้ซื้อ + ราคาจริง → Sheet 3 + เปลี่ยน status เป็น "ขายแล้ว" |
| `styleHeader()` | จัด style header ของ Sheet ใหม่ |
| `getSaleSidebarHtml()` | UI Sidebar สำหรับบันทึกการขาย |

---

## 4. Assets (สื่อและรูปภาพ)

| Asset | ที่อยู่ / Location |
|---|---|
| **Logo** | https://pub-0ae76ea92a9d4cec8f2d5aace411ab7a.r2.dev/logo%20apo.png (Cloudflare R2) |
| **รูปภาพสินค้า** | URL ดึงโดยตรงจากคอลัมน์ใน Google Sheets |

---

## 5. Deployment

- โฮสต์ที่ **GitHub Pages** (branch: `main`)
- เมื่อ push ไปที่ `main` → GitHub Actions จะ validate HTML และ deploy อัตโนมัติ
- URL หน้าเว็บ: `https://fxrkssr.github.io/apo-stock/`

---

## 6. Handover Checklist (สิ่งที่ต้องส่งต่อ)

- [ ] **Google Form** — https://forms.gle/oo5p5TmVtR49HijP7 (ชาวประมงใช้กรอกข้อมูล)
- [ ] **Google Sheets** — https://docs.google.com/spreadsheets/d/1681oFVd80odwKx_9mx5aG4-NOVLGIC7Sxu4RmwMr3mA/edit
- [ ] **Apps Script API** — https://script.google.com/macros/s/AKfycbwWBH-Bcvh8W6LNLbLMIkQxizQsAG6yNYnTUeoHV6aRIPT8VFa_N6AdQuDQCqtumsGxTA/exec
- [ ] **Cloudflare R2 access** — สำหรับอัปเดตโลโก้
- [ ] **GitHub repo access** — https://github.com/fxrkssr/apo-stock
- [ ] **GitHub Pages enabled** — Settings → Pages → Source: GitHub Actions

---

## 7. Quick Reference (คำสั่งที่ใช้บ่อย)

```bash
# แก้ไขเว็บ: เปิดไฟล์นี้แล้วแก้ตรงๆ
index.html

# อัปเดตข้อมูลสินค้า: แก้ที่ Google Sheets โดยตรง ไม่ต้องแตะโค้ด
# Update product data: edit Google Sheets directly — no code changes needed

# Deploy: push to main → GitHub Actions handles the rest
git add index.html
git commit -m "your message"
git push origin main
```

---

*Prepared by āPO project team — 2026*
