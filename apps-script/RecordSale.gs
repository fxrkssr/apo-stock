// ============================================================
//  APO — Record Sale Script
//  วางในไฟล์นี้ใน Apps Script Project เดียวกับ ImportStock.gs
// ============================================================

function showSaleSidebar() {
  var html = HtmlService.createHtmlOutput(getSaleSidebarHtml())
    .setTitle("บันทึกการขาย")
    .setWidth(420);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ── ดึงปลาที่พร้อมขายจาก Sheet 2 ────────────────────────────
function getLiveStock() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Stock ที่จะขายให้ลูกค้า");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var result = [];
  data.slice(1).forEach(function(row, i) {
    if (!row[0]) return;
    if (row[9] === "ขายแล้ว") return;
    result.push({
      rowIndex: i + 2,
      name:    row[0],
      code:    row[1],
      weight:  row[2],
      source:  row[3],
      date:    row[4],
      priceKg: row[5],
      total:   row[6],
      status:  row[9] || "พร้อมขาย"
    });
  });
  return result;
}

// ── บันทึกการขาย ──────────────────────────────────────────────
function recordSale(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var liveSheet = ss.getSheetByName("Stock ที่จะขายให้ลูกค้า");
  var soldSheet = ss.getSheetByName("ปลาที่ขายไปแล้ว");

  // สร้าง Sheet ใหม่ถ้ายังไม่มี
  if (!soldSheet) {
    soldSheet = ss.insertSheet("ปลาที่ขายไปแล้ว");
    var headers = [
      "ชื่อปลา", "รหัสตัว", "น้ำหนัก (กก.)", "แหล่งจับ", "วันที่จับ",
      "ราคา/กก.", "ราคารวม", "รูป URL",
      "ชื่อผู้ซื้อ", "เบอร์โทร", "ราคาที่ขายจริง", "วันที่ขาย"
    ];
    soldSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader(soldSheet, headers.length, "#1e3d6e");
  }

  // ดึงข้อมูลปลาจาก live sheet
  var liveRow = liveSheet.getRange(data.rowIndex, 1, 1, 10).getValues()[0];

  // เพิ่มแถวใน Sheet ปลาที่ขายไปแล้ว
  soldSheet.appendRow([
    liveRow[0],         // ชื่อปลา
    liveRow[1],         // รหัสตัว
    liveRow[2],         // น้ำหนัก
    liveRow[3],         // แหล่งจับ
    liveRow[4],         // วันที่จับ
    liveRow[5],         // ราคา/กก.
    liveRow[6],         // ราคารวม
    liveRow[7],         // รูป URL
    data.buyerName,     // ชื่อผู้ซื้อ
    data.buyerPhone,    // เบอร์โทร
    data.salePrice,     // ราคาที่ขายจริง
    data.saleDate       // วันที่ขาย
  ]);

  // อัพเดต status ใน live sheet เป็น "ขายแล้ว"
  liveSheet.getRange(data.rowIndex, 10).setValue("ขายแล้ว");

  return { success: true, message: "บันทึกการขายเรียบร้อยแล้วค่ะ ✅" };
}

function styleHeader(sheet, numCols, bgColor) {
  var headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange
    .setBackground(bgColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(11);
  sheet.setRowHeight(1, 36);
}

// ── Sidebar HTML ──────────────────────────────────────────────
function getSaleSidebarHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: "Helvetica Neue", sans-serif; font-size:13px; background:#f5f7fa; }
  .header { background:#1e3d6e; color:white; padding:14px 16px; }
  .header h2 { font-size:15px; font-weight:600; }
  .header p { font-size:11px; opacity:0.7; margin-top:2px; }
  .content { padding:14px; }
  .section { background:white; border-radius:8px; padding:12px; margin-bottom:10px; border:0.5px solid #e8edf3; }
  .section-title { font-size:10px; color:#aaa; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:10px; }
  .fish-select { width:100%; padding:8px 10px; border:0.5px solid #ddd; border-radius:6px; font-size:13px; background:white; }
  .fish-info { background:#f0f4fb; border-radius:6px; padding:10px; margin-top:8px; display:none; }
  .fish-info.show { display:block; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .info-item { font-size:11px; }
  .info-label { color:#aaa; display:block; margin-bottom:1px; }
  .info-val { color:#1a2f50; font-weight:500; }
  .field { margin-bottom:10px; }
  .field label { font-size:11px; color:#666; display:block; margin-bottom:4px; }
  .field input { width:100%; padding:8px 10px; border:0.5px solid #ddd; border-radius:6px; font-size:13px; }
  .btn-record { width:100%; padding:12px; background:#1e3d6e; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; margin-top:4px; }
  .btn-record:disabled { background:#ccc; cursor:not-allowed; }
  .loading { text-align:center; padding:20px; color:#888; font-size:13px; }
  .success { background:#e1f5ee; color:#0a6e43; padding:10px 12px; border-radius:8px; margin-bottom:10px; font-size:13px; }
  .empty { text-align:center; padding:20px; color:#aaa; font-size:13px; }
</style>
</head>
<body>
<div class="header">
  <h2>บันทึกการขาย</h2>
  <p>เลือกปลาและกรอกข้อมูลผู้ซื้อ</p>
</div>
<div class="content">
  <div class="loading" id="loading">กำลังโหลด...</div>
  <div id="main" style="display:none">
    <div id="success-msg" style="display:none" class="success"></div>

    <div class="section">
      <div class="section-title">ปลาที่ขาย</div>
      <select class="fish-select" id="fish-select" onchange="onFishSelect()">
        <option value="">เลือกปลา...</option>
      </select>
      <div class="fish-info" id="fish-info">
        <div class="info-grid">
          <div class="info-item"><span class="info-label">น้ำหนัก</span><span class="info-val" id="info-weight">—</span></div>
          <div class="info-item"><span class="info-label">ราคารวม</span><span class="info-val" id="info-total">—</span></div>
          <div class="info-item"><span class="info-label">แหล่งจับ</span><span class="info-val" id="info-source">—</span></div>
          <div class="info-item"><span class="info-label">วันที่จับ</span><span class="info-val" id="info-date">—</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">ข้อมูลผู้ซื้อ</div>
      <div class="field">
        <label>ชื่อร้าน / ผู้ซื้อ *</label>
        <input type="text" id="buyer-name" placeholder="เช่น ร้าน Le Du" />
      </div>
      <div class="field">
        <label>เบอร์โทร *</label>
        <input type="text" id="buyer-phone" placeholder="08X-XXX-XXXX" />
      </div>
      <div class="field">
        <label>ราคาที่ขายจริง (บาท) *</label>
        <input type="number" id="sale-price" placeholder="เช่น 1250" />
      </div>
      <div class="field">
        <label>วันที่ขาย *</label>
        <input type="text" id="sale-date" placeholder="เช่น 19/05/2568" />
      </div>
    </div>

    <button class="btn-record" id="btn-record" onclick="recordSale()" disabled>บันทึกการขาย</button>
  </div>
  <div class="empty" id="empty" style="display:none">ไม่มีปลาพร้อมขายตอนนี้ค่ะ</div>
</div>

<script>
var allFish = [];
var selectedFish = null;

document.addEventListener('DOMContentLoaded', function() {
  var today = new Date();
  var d = today.getDate().toString().padStart(2,'0');
  var m = (today.getMonth()+1).toString().padStart(2,'0');
  var y = today.getFullYear() + 543;
  document.getElementById('sale-date').value = d + '/' + m + '/' + y;
});

google.script.run
  .withSuccessHandler(function(data) {
    document.getElementById('loading').style.display = 'none';
    allFish = data;
    if (data.length === 0) {
      document.getElementById('empty').style.display = 'block';
      return;
    }
    document.getElementById('main').style.display = 'block';
    var select = document.getElementById('fish-select');
    data.forEach(function(f, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = f.name + ' ' + f.code + ' — ' + f.weight + ' กก.';
      select.appendChild(opt);
    });
  })
  .getLiveStock();

function onFishSelect() {
  var i = document.getElementById('fish-select').value;
  if (i === '') {
    document.getElementById('fish-info').classList.remove('show');
    document.getElementById('btn-record').disabled = true;
    selectedFish = null;
    return;
  }
  selectedFish = allFish[i];
  document.getElementById('info-weight').textContent = selectedFish.weight + ' กก.';
  document.getElementById('info-total').textContent = selectedFish.total ? Number(selectedFish.total).toLocaleString() + ' ฿' : '—';
  document.getElementById('info-source').textContent = selectedFish.source || '—';
  document.getElementById('info-date').textContent = selectedFish.date || '—';
  document.getElementById('fish-info').classList.add('show');
  document.getElementById('sale-price').value = selectedFish.total || '';
  document.getElementById('btn-record').disabled = false;
}

function recordSale() {
  var name  = document.getElementById('buyer-name').value.trim();
  var phone = document.getElementById('buyer-phone').value.trim();
  var price = document.getElementById('sale-price').value.trim();
  var date  = document.getElementById('sale-date').value.trim();

  if (!selectedFish || !name || !phone || !price || !date) {
    alert('กรุณากรอกข้อมูลให้ครบค่ะ');
    return;
  }

  document.getElementById('btn-record').disabled = true;
  document.getElementById('btn-record').textContent = 'กำลังบันทึก...';

  google.script.run
    .withSuccessHandler(function(result) {
      var msg = document.getElementById('success-msg');
      msg.textContent = result.message;
      msg.style.display = 'block';
      document.getElementById('fish-select').value = '';
      document.getElementById('fish-info').classList.remove('show');
      document.getElementById('buyer-name').value = '';
      document.getElementById('buyer-phone').value = '';
      document.getElementById('sale-price').value = '';
      selectedFish = null;
      document.getElementById('btn-record').disabled = false;
      document.getElementById('btn-record').textContent = 'บันทึกการขาย';

      google.script.run
        .withSuccessHandler(function(data) {
          allFish = data;
          var select = document.getElementById('fish-select');
          select.innerHTML = '<option value="">เลือกปลา...</option>';
          data.forEach(function(f, i) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.textContent = f.name + ' ' + f.code + ' — ' + f.weight + ' กก.';
            select.appendChild(opt);
          });
        })
        .getLiveStock();
    })
    .recordSale({
      rowIndex:   selectedFish.rowIndex,
      buyerName:  name,
      buyerPhone: phone,
      salePrice:  price,
      saleDate:   date
    });
}
</script>
</body>
</html>`;
}
