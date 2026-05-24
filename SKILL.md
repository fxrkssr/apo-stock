# āPO — Project Skill Sheet
> อ่านไฟล์นี้ก่อนทุกครั้งที่จะทำงานต่อ

---

## สิ่งที่ระบบทำ
ระบบจัดการสต็อกและขายปลา ทำงาน 3 ชั้น:
1. **ชาวประมง** กรอก Google Form → ข้อมูลลง Google Sheets
2. **Admin** เปิด Dashboard ใน Sheets → เลือกปลา → ราคาขึ้นอัตโนมัติ → Publish
3. **ลูกค้า** เปิดเว็บ Vercel → เลือกสินค้า → สั่งผ่าน LINE

---

## URLs สำคัญ

| ชื่อ | URL |
|------|-----|
| เว็บลูกค้า (Vercel) | https://apo-stock-di7x.vercel.app |
| Google Form (ชาวประมง) | https://forms.gle/oo5p5TmVtR49HijP7 |
| Google Form (edit) | https://docs.google.com/forms/d/1E7lftgnlrkU4PpOAkJz5Yjo_aoMvKGlt6CFalQQawiA/edit |
| Google Sheets | https://docs.google.com/spreadsheets/d/1681oFVd80odwKx_9mx5aG4-NOVLGIC7Sxu4RmwMr3mA/edit |
| Apps Script Editor | เปิดจาก Sheets → Extensions → Apps Script |
| Apps Script API (public) | https://script.google.com/macros/s/AKfycbxxjhG6wbxg9Okvui3_wW0DlUhxGXwPSP5aCOzeM7ahevlD4cYv4HicKsI3I5ilUTLK2A/exec |
| GitHub Repo | https://github.com/fxrkssr/apo-stock |

---

## โครงสร้างไฟล์

```
Apo/
├── index.html              ← หน้าเว็บลูกค้า (deploy บน Vercel)
├── workflow.html           ← diagram แสดง flow ของระบบ
├── SKILL.md                ← ไฟล์นี้
└── apps-script/
    ├── Dashboard.gs        ← Admin dashboard + setup functions
    ├── ImportStock.gs      ← นำเข้าปลา + FISH_PRICES + FISH_ENGLISH + price lookup
    ├── WebApp.gs           ← doGet() — API ให้เว็บลูกค้าดึงข้อมูล
    └── RecordSale.gs       ← บันทึกการขาย (ยังไม่ได้ integrate)
```

---

## Google Sheets — Structure

### Sheet 1: "Stock จากชาวประมง"
| Col | ข้อมูล |
|-----|--------|
| A | Timestamp |
| B | ชื่อปลา (format: `ปลาแพะ/Red Mullet`) |
| C | รหัสตัว |
| D | น้ำหนัก (กก.) |
| E | หมายเหตุ |
| F | แนบรูป (URL) |
| G | แหล่งจับ |
| H | วันที่จับ – วัน |
| I | วันที่จับ – เดือน |
| J–L | (ซ่อนไว้) duplicate columns จากการ setup — ว่างเสมอ |
| M | สถานะ (`Publish แล้ว`) |

> **หมายเหตุ column:** Google Forms สร้าง column ใหม่ทุกครั้งที่เพิ่ม question ลบ column ที่ link กับ form ไม่ได้ — ซ่อนไว้แทน
> `getRawStock()` ใช้ `allCols()` + `pickVal()` scan ทุก column ที่ชื่อเหมือนกัน เอาค่าแรกที่ไม่ว่าง

### Sheet 2: "Stock ที่จะขายให้ลูกค้า"
| Col | ข้อมูล |
|-----|--------|
| A | ชื่อปลา |
| B | รหัสตัว |
| C | น้ำหนัก/จำนวน |
| D | แหล่งจับ |
| E | วันที่จับ |
| F | ราคา/kg (หรือ/ตัว) ← auto-fill จาก Sheet ราคาปลา |
| G | ยอดรวม (formula =F×C) |
| H | รูปภาพ |
| I | วันที่ Publish |
| J | สถานะ |
| K | หมวดหมู่ |
| L | หน่วย (`kg` หรือ `ตัว`) ← auto-fill จาก Sheet ราคาปลา |

### Sheet 3: "ราคาปลา"
| Col | ข้อมูล |
|-----|--------|
| A | ชื่อปลา (Thai) |
| B | หน่วย (`kg` หรือ `ตัว`) — dropdown |
| C | ราคา |
| D | รูปภาพ default (URL) |
| E | ชื่ออังกฤษ |

> แก้ราคา/เพิ่มปลา: แก้ที่ Sheet นี้โดยตรง ไม่ต้องแตะ code

---

## Apps Script — ฟังก์ชันสำคัญ

### ImportStock.gs
| ฟังก์ชัน | ทำอะไร |
|---------|--------|
| `FISH_PRICES` | hardcode fallback ราคา 40 ชนิด |
| `FISH_UNITS` | hardcode fallback หน่วย (ปลากะรังหัวโขน = ตัว) |
| `FISH_ENGLISH` | hardcode ชื่ออังกฤษ 40 ชนิด |
| `getPriceLookup()` | อ่านราคา+หน่วย+รูป+ชื่ออังกฤษ จาก Sheet "ราคาปลา" (cache ต่อ request) |
| `getRawStock()` | ดึงปลาใหม่จาก Sheet 1 (ยังไม่ Publish) — ใช้ `allCols()`+`pickVal()` รองรับ duplicate columns |
| `importSelectedFish(rows)` | เขียนลง Sheet 2 พร้อม priceKg auto-fill |
| `setupPriceSheet()` | **รันครั้งเดียว** — สร้าง Sheet "ราคาปลา" พร้อม col E ชื่ออังกฤษ |
| `addEnglishNamesColumn()` | เพิ่ม col E ชื่ออังกฤษในชีทราคาปลาที่มีอยู่แล้ว (ไม่ลบข้อมูล) |
| `openPriceSheet()` | เมนู APO Stock → ✏️ จัดการราคาปลา |

### WebApp.gs
| ฟังก์ชัน | ทำอะไร |
|---------|--------|
| `doGet()` | ดึงข้อมูลจาก Sheet 2 ส่งเป็น JSON ให้เว็บลูกค้า รวม `unit` field |

### Dashboard.gs
| ฟังก์ชัน | ทำอะไร |
|---------|--------|
| `openDashboard()` | เปิด Admin dashboard (modal) |
| `publishFish(data)` | เขียนปลาลง Sheet 2 รวม col L (หน่วย) — หา column สถานะจาก header โดยตรง สร้างเองถ้าไม่มี |
| `uploadNewImage(...)` | อัปโหลดรูปไป Google Drive |
| `setupFishTypeQuestion()` | **รันครั้งเดียว** — อัปเดต Google Form dropdown ชื่อปลา Thai/English (อ่านจาก Sheet ราคาปลา col A+E) |
| `setupAllFormQuestions()` | กู้คืน form questions ทั้งหมดถ้าหาย |
| `fixMissingQuestions()` | เพิ่มเฉพาะ 3 คำถามที่มักหาย (แหล่งจับ/วันที่จับ–วัน/เดือน) |
| `removeDuplicateQuestions()` | ลบ form questions ที่ชื่อซ้ำ — เก็บอันแรก |
| `resetStockSheet()` | unlink form → ลบ sheet เก่า → link ใหม่ → ได้ sheet สะอาด |

### RecordSale.gs
ยังไม่ได้ integrate กับ price lookup ใหม่

---

## เมนู APO Stock (ใน Google Sheets)
- นำปลาขึ้นหน้าร้าน → `openDashboard()`
- บันทึกการขาย → `showSaleSidebar()`
- สรุปยอดขาย → `openSalesSummary()`
- ✏️ จัดการราคาปลา → `openPriceSheet()`

---

## Logic สำคัญที่ต้องรู้

**ชื่อปลาใน Sheet format:** `ปลาแพะ/Red Mullet`
- `getThaiName()` ตัดที่ `/` เอาแค่ส่วนไทย → ใช้ lookup ราคา
- ถ้าชื่อไม่ match → ราคาเป็น 0 → sidebar แสดง "ไม่พบราคา" สีแดง

**หน่วยพิเศษ:** `ปลากะรังหัวโขน` ราคาต่อตัว ไม่ใช่ต่อ kg
- Dashboard จะเปลี่ยน label "น้ำหนัก (กก.)" → "จำนวน (ตัว)" อัตโนมัติ

**รูปภาพ priority:** รูปจากชาวประมง → รูป default จาก Sheet ราคาปลา → ว่าง

**แก้ราคา/เพิ่มปลา:** แก้ใน Sheet "ราคาปลา" แล้วรัน `setupFishTypeQuestion` ใหม่

**column สถานะ:** `publishFish()` หาจาก header โดยตรง ถ้าไม่มีสร้างเอง — ไม่ต้อง setup ด้วยมือ

**duplicate columns ใน Sheet 1:** เกิดจากการเพิ่ม form questions หลายครั้ง ลบไม่ได้ (Google Forms restriction) → ซ่อนไว้ `getRawStock()` รับมือด้วย `allCols()`+`pickVal()`

---

## การ Deploy

**Apps Script → ใช้งาน:**
1. Copy `ImportStock.gs` และ `Dashboard.gs` ขึ้น Apps Script Editor
2. Save → Deploy → Manage deployments → New version → Deploy

**Setup ครั้งแรก (รันตามลำดับ):**
1. `setupPriceSheet` — สร้าง Sheet ราคาปลา (รันครั้งเดียว)
2. `setupAllFormQuestions` — สร้าง form questions ครบ
3. `setupFishTypeQuestion` — เพิ่ม dropdown ชื่อปลา Thai/English
4. `addEnglishNamesColumn` — เพิ่ม col E ชื่ออังกฤษใน Sheet ราคาปลา

**ถ้า form questions หาย:**
1. `fixMissingQuestions` — เพิ่ม 3 คำถามที่หายกลับมา
2. `removeDuplicateQuestions` — ลบซ้ำถ้ามี
3. `setupFishTypeQuestion` — อัปเดต dropdown ชื่อปลา

**ถ้า Sheet 1 รก (duplicate columns เยอะ):**
- `resetStockSheet` — unlink form ลบ sheet เก่า สร้างใหม่สะอาด (ข้อมูลเก่าหายหมด)
- แล้วรัน setup ครั้งแรกใหม่

**หน้าเว็บลูกค้า → ใช้งาน:**
- แก้ `index.html` → git push → Vercel auto-deploy

---

## สิ่งที่ยังไม่ได้ทำ / ทำต่อได้
- [ ] ใส่รูปภาพ default ใน Sheet "ราคาปลา" Column D
- [ ] `RecordSale.gs` — ยังไม่ได้ integrate กับ price lookup ใหม่
- [ ] หอย/ทะเล — ยังไม่มีตารางราคา
