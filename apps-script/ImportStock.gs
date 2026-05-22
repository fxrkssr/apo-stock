function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("APO Stock")
    .addItem("นำปลาขึ้นหน้าร้าน", "openDashboard")
    .addItem("บันทึกการขาย", "showSaleSidebar")
    .addItem("สรุปยอดขาย", "openSalesSummary")
    .addSeparator()
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
  if (n.indexOf("หอย") === 0 || n.indexOf("ปลาหมึก") === 0) {
    return "หอย/ทะเล";
  }
  return "ปลา";
}

function makeDriveImageUrl(rawUrl) {
  if (!rawUrl) return "";
  if (rawUrl.indexOf("drive.google.com") === -1) return rawUrl;

  var fileId = "";
  var m = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) {
    fileId = m[1];
  } else {
    m = rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) fileId = m[1];
  }

  if (!fileId) return rawUrl;

  try {
    DriveApp.getFileById(fileId)
      .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch(e) {}

  return "https://lh3.googleusercontent.com/d/" + fileId;
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

    var day = row[6] || "";
    var month = row[7] || "";
    var date = day && month ? day + " " + month : "";

    result.push({
      rowIndex: i + 2,
      name:     row[1],
      code:     row[2],
      weight:   row[3],
      source:   row[4],
      note:     row[5],
      date:     date,
      image:    makeDriveImageUrl(row[8]),
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
    var weight  = parseFloat(row.weight) || 0;
    var lastRow = liveSheet.getLastRow() + 1;

    liveSheet.appendRow([
      row.name,
      row.code,
      weight,
      row.source,
      row.date,
      "",
      "",
      makeDriveImageUrl(row.image),
      today,
      "พร้อมขาย",
      row.category
    ]);

    liveSheet.getRange(lastRow, 7).setFormula(
      "=IF(F" + lastRow + "*C" + lastRow + "=0,\"\",F" + lastRow + "*C" + lastRow + ")"
    );

    rawSheet.getRange(row.rowIndex, 10).setValue("Publish แล้ว");
    imported++;
  });

  return { success: true, message: "นำเข้าสำเร็จ " + imported + " ตัวค่ะ" };
}

function refreshWebApp() {
  SpreadsheetApp.getUi().alert("Web App ดึงข้อมูลจาก Sheet แบบ real-time อยู่แล้วค่ะ");
}

function getSidebarHtml() {
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>';
  html += '* { margin:0; padding:0; box-sizing:border-box; }';
  html += 'body { font-family: sans-serif; font-size:13px; background:#f5f7fa; }';
  html += '.header { background:#2B5089; color:white; padding:14px 16px; }';
  html += '.header h2 { font-size:15px; font-weight:600; }';
  html += '.header p { font-size:11px; opacity:0.7; margin-top:2px; }';
  html += '.content { padding:12px; }';
  html += '.loading { text-align:center; padding:30px; color:#888; }';
  html += '.fish-item { background:white; border-radius:8px; padding:12px; margin-bottom:8px; border:1.5px solid #e8edf3; cursor:pointer; }';
  html += '.fish-item.selected { border-color:#2B5089; background:#f0f4fb; }';
  html += '.fish-header { display:flex; align-items:center; gap:8px; margin-bottom:6px; }';
  html += '.fish-name { font-weight:600; color:#1a2f50; font-size:14px; }';
  html += '.fish-code { background:#2B5089; color:white; font-size:10px; padding:2px 7px; border-radius:20px; }';
  html += '.cat-badge { font-size:10px; padding:2px 8px; border-radius:20px; margin-left:auto; }';
  html += '.cat-fish { background:#e6f1fb; color:#185fa5; }';
  html += '.cat-shell { background:#e1f5ee; color:#0a6e43; }';
  html += '.fish-detail { display:grid; grid-template-columns:1fr 1fr; gap:4px; }';
  html += '.detail-item { font-size:11px; color:#666; }';
  html += '.detail-label { color:#aaa; }';
  html += '.btn-import { width:100%; padding:12px; background:#2B5089; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; margin-top:8px; }';
  html += '.btn-import:disabled { background:#ccc; cursor:not-allowed; }';
  html += '.empty { text-align:center; padding:30px; color:#aaa; }';
  html += '.count { font-size:11px; color:#888; margin-bottom:10px; }';
  html += '.success { background:#e1f5ee; color:#0a6e43; padding:10px 12px; border-radius:8px; margin-bottom:10px; }';
  html += '</style></head><body>';
  html += '<div class="header"><h2>นำเข้าปลาจากชาวประมง</h2><p>เลือกสิ่งที่ต้องการนำเข้า Stock ขาย</p></div>';
  html += '<div class="content">';
  html += '<div class="loading" id="loading">กำลังโหลด...</div>';
  html += '<div id="main" style="display:none">';
  html += '<div id="success-msg" style="display:none" class="success"></div>';
  html += '<div class="count" id="count"></div>';
  html += '<div id="fish-list"></div>';
  html += '<button class="btn-import" id="btn-import" onclick="importSelected()" disabled>นำเข้าที่เลือก (0 ตัว)</button>';
  html += '</div>';
  html += '<div class="empty" id="empty" style="display:none">ไม่มีรายการใหม่จากชาวประมงค่ะ</div>';
  html += '</div>';
  html += '<script>';
  html += 'var allFish = []; var selected = {};';
  html += 'google.script.run.withSuccessHandler(function(data) {';
  html += '  document.getElementById("loading").style.display = "none";';
  html += '  allFish = data;';
  html += '  if (data.length === 0) { document.getElementById("empty").style.display = "block"; return; }';
  html += '  document.getElementById("main").style.display = "block";';
  html += '  document.getElementById("count").textContent = "มีรายการใหม่ " + data.length + " ตัว";';
  html += '  renderList(data);';
  html += '}).getRawStock();';
  html += 'function renderList(fish) {';
  html += '  var h = "";';
  html += '  fish.forEach(function(f, i) {';
  html += '    var cc = f.category === "ปลา" ? "cat-fish" : "cat-shell";';
  html += '    h += "<div class=\\"fish-item\\" id=\\"item-" + i + "\\" onclick=\\"toggleSelect(" + i + ")\\">";';
  html += '    h += "<div class=\\"fish-header\\">";';
  html += '    h += "<span class=\\"fish-name\\">" + f.name + "</span>";';
  html += '    h += "<span class=\\"fish-code\\">" + f.code + "</span>";';
  html += '    h += "<span class=\\"cat-badge " + cc + "\\">" + f.category + "</span>";';
  html += '    h += "</div><div class=\\"fish-detail\\">";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">น้ำหนัก </span>" + f.weight + " กก.</div>";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">แหล่งจับ </span>" + f.source + "</div>";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">วันที่จับ </span>" + f.date + "</div>";';
  html += '    h += "</div></div>";';
  html += '  });';
  html += '  document.getElementById("fish-list").innerHTML = h;';
  html += '}';
  html += 'function toggleSelect(i) {';
  html += '  selected[i] = !selected[i];';
  html += '  document.getElementById("item-" + i).classList.toggle("selected", selected[i]);';
  html += '  var count = Object.values(selected).filter(Boolean).length;';
  html += '  var btn = document.getElementById("btn-import");';
  html += '  btn.disabled = count === 0;';
  html += '  btn.textContent = "นำเข้าที่เลือก (" + count + " ตัว)";';
  html += '}';
  html += 'function importSelected() {';
  html += '  var rows = Object.keys(selected).filter(function(i){ return selected[i]; }).map(function(i){ return allFish[i]; });';
  html += '  var btn = document.getElementById("btn-import");';
  html += '  btn.disabled = true;';
  html += '  btn.textContent = "กำลังนำเข้า...";';
  html += '  google.script.run.withSuccessHandler(function(result) {';
  html += '    var msg = document.getElementById("success-msg");';
  html += '    msg.textContent = result.message;';
  html += '    msg.style.display = "block";';
  html += '    selected = {};';
  html += '    btn.textContent = "นำเข้าที่เลือก (0 ตัว)";';
  html += '    google.script.run.withSuccessHandler(function(data) {';
  html += '      allFish = data;';
  html += '      document.getElementById("count").textContent = "มีรายการใหม่ " + data.length + " ตัว";';
  html += '      renderList(data);';
  html += '    }).getRawStock();';
  html += '  }).importSelectedFish(rows);';
  html += '}';
  html += '<\/script></body></html>';
  return html;
}
