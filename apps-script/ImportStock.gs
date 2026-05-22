// ============================================================
//  APO — Import Stock Script (v3)
//  ลบ code เดิมใน ImportStock ทั้งหมด แล้ววางอันนี้แทน
// ============================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🐟 Apo Stock")
    .addItem("นำเข้าปลาจากชาวประมง", "showImportSidebar")
    .addItem("บันทึกการขาย", "showSaleSidebar")
    .addItem("รีเฟรช Web App", "refreshWebApp")
    .addToUi();
}

function showImportSidebar() {
  var html = HtmlService.createHtmlOutput(getSidebarHtml())
    .setTitle("นำเข้า Stock ปลา")
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getCategory(name) {
  if (!name) return "ปลา";
  var n = name.toString();
  if (n.indexOf("หอย") === 0 || n.indexOf("ปลาหมึก") === 0 || n.indexOf("อยจาว") === 0) {
    return "หอย/ทะเล";
  }
  return "ปลา";
}

function getRawStock() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Stock จากชาวประมง");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var result = [];
  data.slice(1).forEach(function(row, i) {
    if (!row[1]) return;
    var status = row[9] || "ใหม่";
    if (status === "Publish แล้ว") return;

    var day   = row[6] || "";
    var month = row[7] || "";
    var date  = day && month ? day + " " + month : "";

    result.push({
      rowIndex: i + 2,
      name:     row[1],
      code:     row[2],
      weight:   row[3],
      source:   row[4],
      note:     row[5],
      date:     date,
      image:    row[8],
      status:   status,
      category: getCategory(row[1])
    });
  });

  return result;
}

function importSelectedFish(selectedRows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet  = ss.getSheetByName("Stock จากชาวประมง");
  var liveSheet = ss.getSheetByName("Stock ที่จะขายให้ลูกค้า");

  if (!rawSheet || !liveSheet) {
    return { success: false, message: "ไม่พบ Sheet ค่ะ" };
  }

  var today = Utilities.formatDate(new Date(), "Asia/Bangkok", "d/MM/yyyy");
  var imported = 0;
  selectedRows.forEach(function(row) {
    var weight = parseFloat(row.weight) || 0;
    var lastRow = liveSheet.getLastRow() + 1;

    liveSheet.appendRow([
      row.name,      // ชื่อปลา
      row.code,      // รหัสตัว
      weight,        // น้ำหนัก
      row.source,    // แหล่งจับ
      row.date,      // วันที่จับ
      "",            // ราคา/กก. (ทีม Apo ใส่เอง)
      "",            // ราคารวม (สูตร)
      row.image,     // รูป URL จากชาวประมง
      today,         // วันที่ publish
      "พร้อมขาย",   // สถานะ
      row.category   // ประเภท
    ]);

    // ใส่สูตรราคารวม
    liveSheet.getRange(lastRow, 7).setFormula(
      '=IF(F'+lastRow+'*C'+lastRow+'=0,"",F'+lastRow+'*C'+lastRow+')'
    );

    // อัพเดต status ใน Sheet 1
    rawSheet.getRange(row.rowIndex, 10).setValue("Publish แล้ว");
    imported++;
  });

  return { success: true, message: "นำเข้าสำเร็จ " + imported + " ตัวค่ะ" };
}

function refreshWebApp() {
  SpreadsheetApp.getUi().alert("Web App ดึงข้อมูลจาก Sheet แบบ real-time อยู่แล้วค่ะ 🐟");
}

function getSidebarHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: "Helvetica Neue", sans-serif; font-size:13px; background:#f5f7fa; }
  .header { background:#2B5089; color:white; padding:14px 16px; }
  .header h2 { font-size:15px; font-weight:600; }
  .header p { font-size:11px; opacity:0.7; margin-top:2px; }
  .content { padding:12px; }
  .loading { text-align:center; padding:30px; color:#888; }
  .fish-item { background:white; border-radius:8px; padding:12px; margin-bottom:8px; border:1.5px solid #e8edf3; cursor:pointer; }
  .fish-item:hover { border-color:#2B5089; }
  .fish-item.selected { border-color:#2B5089; background:#f0f4fb; }
  .fish-header { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .fish-name { font-weight:600; color:#1a2f50; font-size:14px; }
  .fish-code { background:#2B5089; color:white; font-size:10px; padding:2px 7px; border-radius:20px; }
  .cat-badge { font-size:10px; padding:2px 8px; border-radius:20px; margin-left:auto; }
  .cat-fish { background:#e6f1fb; color:#185fa5; }
  .cat-shell { background:#e1f5ee; color:#0a6e43; }
  .fish-detail { display:grid; grid-template-columns:1fr 1fr; gap:4px; }
  .detail-item { font-size:11px; color:#666; }
  .detail-label { color:#aaa; }
  .btn-import { width:100%; padding:12px; background:#2B5089; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; margin-top:8px; }
  .btn-import:disabled { background:#ccc; cursor:not-allowed; }
  .empty { text-align:center; padding:30px; color:#aaa; }
  .count { font-size:11px; color:#888; margin-bottom:10px; }
  .success { background:#e1f5ee; color:#0a6e43; padding:10px 12px; border-radius:8px; margin-bottom:10px; font-size:13px; }
</style>
</head>
<body>
<div class="header">
  <h2>นำเข้าปลาจากชาวประมง</h2>
  <p>เลือกสิ่งที่ต้องการนำเข้า Stock ขาย</p>
</div>
<div class="content">
  <div class="loading" id="loading">กำลังโหลด...</div>
  <div id="main" style="display:none">
    <div id="success-msg" style="display:none" class="success"></div>
    <div class="count" id="count"></div>
    <div id="fish-list"></div>
    <button class="btn-import" id="btn-import" onclick="importSelected()" disabled>นำเข้าที่เลือก (0 ตัว)</button>
  </div>
  <div class="empty" id="empty" style="display:none">ไม่มีรายการใหม่จากชาวประมงค่ะ</div>
</div>
<script>
var allFish = [];
var selected = {};

google.script.run
  .withSuccessHandler(function(data) {
    document.getElementById('loading').style.display = 'none';
    allFish = data;
    if (data.length === 0) {
      document.getElementById('empty').style.display = 'block';
      return;
    }
    document.getElementById('main').style.display = 'block';
    document.getElementById('count').textContent = 'มีรายการใหม่ ' + data.length + ' ตัว';
    renderList(data);
  })
  .getRawStock();

function renderList(fish) {
  var html = '';
  fish.forEach(function(f, i) {
    var catClass = f.category === 'ปลา' ? 'cat-fish' : 'cat-shell';
    html += '<div class="fish-item" id="item-'+i+'" onclick="toggleSelect('+i+')">'
      + '<div class="fish-header">'
      + '<span class="fish-name">' + f.name + '</span>'
      + '<span class="fish-code">' + f.code + '</span>'
      + '<span class="cat-badge ' + catClass + '">' + f.category + '</span>'
      + '</div>'
      + '<div class="fish-detail">'
      + '<div class="detail-item"><span class="detail-label">น้ำหนัก </span>' + f.weight + ' กก.</div>'
      + '<div class="detail-item"><span class="detail-label">แหล่งจับ </span>' + f.source + '</div>'
      + '<div class="detail-item"><span class="detail-label">วันที่จับ </span>' + f.date + '</div>'
      + '</div>'
      + '</div>';
  });
  document.getElementById('fish-list').innerHTML = html;
}

function toggleSelect(i) {
  selected[i] = !selected[i];
  document.getElementById('item-'+i).classList.toggle('selected', selected[i]);
  var count = Object.values(selected).filter(Boolean).length;
  var btn = document.getElementById('btn-import');
  btn.disabled = count === 0;
  btn.textContent = 'นำเข้าที่เลือก (' + count + ' ตัว)';
}

function importSelected() {
  var rows = Object.keys(selected).filter(function(i){ return selected[i]; }).map(function(i){ return allFish[i]; });
  document.getElementById('btn-import').disabled = true;
  document.getElementById('btn-import').textContent = 'กำลังนำเข้า...';
  google.script.run
    .withSuccessHandler(function(result) {
      var msg = document.getElementById('success-msg');
      msg.textContent = '✅ ' + result.message;
      msg.style.display = 'block';
      selected = {};
      document.getElementById('btn-import').textContent = 'นำเข้าที่เลือก (0 ตัว)';
      google.script.run
        .withSuccessHandler(function(data) {
          allFish = data;
          document.getElementById('count').textContent = 'มีรายการใหม่ ' + data.length + ' ตัว';
          renderList(data);
        }).getRawStock();
    }).importSelectedFish(rows);
}
</script>
</body>
</html>`;
}
