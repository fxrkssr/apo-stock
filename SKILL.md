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
| Apps Script API (public) | https://script.google.com/macros/s/AKfycbwWBH-Bcvh8W6LNLbLMIkQxizQsAG6yNYnTUeoHV6aRIPT8VFa_N6AdQuDQCqtumsGxTA/exec |
| GitHub Repo | https://github.com/fxrkssr/apo-stock |

---

## โครงสร้างไฟล์

```
Apo/
├── index.html              ← หน้าเว็บลูกค้า (deploy บน Vercel)
├── workflow.html           ← diagram แสดง flow ของระบบ
├── SKILL.md                ← ไฟล์นี้
└── apps-script/
    ├── Dashboard.gs        ← Admin dashboard + setupFishTypeQuestion + setupPriceSheet
    ├── ImportStock.gs      ← นำเข้าปลา + FISH_PRICES + price lookup จาก Sheet
    └── RecordSale.gs       ← บันทึกการขาย (ไม่ได้แตะในรอบนี้)
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
| E | แหล่งจับ |
| F | หมายเหตุ |
| G | วันที่จับ – วัน |
| H | วันที่จับ – เดือน |
| I | แนบรูป (URL) |
| J | สถานะ (`Publish แล้ว`) |

### Sheet 2: "Stock ที่จะขายให้ลูกค้า"
| Col | ข้อมูล |
|-----|--------|
| A | ชื่อปลา |
| B | รหัสตัว |
| C | น้ำหนัก/จำนวน |
| D | แหล่งจับ |
| E | วันที่จับ |
| F | ราคา/kg (หรือ/ตัว) ← **auto-fill จาก Sheet ราคาปลา** |
| G | ยอดรวม (formula =F×C) |
| H | รูปภาพ |
| I | วันที่ Publish |
| J | สถานะ |
| K | หมวดหมู่ |

### Sheet 3: "ราคาปลา" ← **สร้างในรอบนี้**
| Col | ข้อมูล |
|-----|--------|
| A | ชื่อปลา (Thai) |
| B | หน่วย (`kg` หรือ `ตัว`) — dropdown |
| C | ราคา |
| D | รูปภาพ default (URL) — ใส่ทีหลังได้ |

> แก้ราคา/เพิ่มปลา: แก้ที่ Sheet นี้โดยตรง ไม่ต้องแตะ code

---

## Apps Script — ฟังก์ชันสำคัญ

### ImportStock.gs
| ฟังก์ชัน | ทำอะไร |
|---------|--------|
| `FISH_PRICES` | hardcode fallback ราคา 40 ชนิด (ใช้เมื่อยังไม่มี Sheet ราคาปลา) |
| `FISH_UNITS` | hardcode fallback หน่วย (ปลากะรังหัวโขน = ตัว) |
| `getPriceLookup()` | อ่านราคา+หน่วย+รูป default จาก Sheet "ราคาปลา" (cache ต่อ request) |
| `getFishPriceDynamic(name)` | lookup ราคาจาก Sheet |
| `getFishUnitDynamic(name)` | lookup หน่วยจาก Sheet |
| `getRawStock()` | ดึงปลาใหม่จาก Sheet 1 (ยังไม่ Publish) + แนบ priceKg, unit, รูป default |
| `importSelectedFish(rows)` | เขียนลง Sheet 2 พร้อม priceKg auto-fill |
| `setupPriceSheet()` | **รันครั้งเดียว** — สร้าง Sheet "ราคาปลา" |
| `openPriceSheet()` | เมนู APO Stock → ✏️ จัดการราคาปลา |

### Dashboard.gs
| ฟังก์ชัน | ทำอะไร |
|---------|--------|
| `openDashboard()` | เปิด Admin dashboard (modal) |
| `publishFish(data)` | เขียนปลาลง Sheet 2 จาก Dashboard |
| `setupFishTypeQuestion()` | **รันครั้งเดียว** — อัปเดต Google Form ให้มี dropdown ชนิดปลา (อ่านจาก Sheet ราคาปลา) |
| `uploadNewImage(...)` | อัปโหลดรูปไป Google Drive |

### RecordSale.gs
ยังไม่ได้แตะ — บันทึกการขายและสรุปยอด

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
(อย่าแก้แค่ใน Google Form อย่างเดียว เพราะ lookup จะไม่ match)

---

## การ Deploy

**Apps Script → ใช้งาน:**
1. copy `ImportStock.gs` และ `Dashboard.gs` ขึ้น Apps Script Editor
2. รัน `setupPriceSheet` (ครั้งเดียว)
3. รัน `setupFishTypeQuestion` (ครั้งเดียว หรือทุกครั้งที่เพิ่ม/แก้ชนิดปลา)
4. Deploy → Manage deployments → New version

**หน้าเว็บลูกค้า → ใช้งาน:**
- แก้ `index.html` → git push → Vercel auto-deploy

---

## สิ่งที่ยังไม่ได้ทำ / ทำต่อได้
- [ ] ใส่รูปภาพ default ใน Sheet "ราคาปลา" Column D (ยังว่างอยู่)
- [ ] `RecordSale.gs` — ยังไม่ได้ integrate กับ price lookup ใหม่
- [ ] หอย/ทะเล — ยังไม่มีตารางราคา (ปัจจุบันอยู่ใน tab "Shell & Sea" แต่ไม่มี price list)
