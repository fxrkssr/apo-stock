// ตารางราคาปลา (Thai name → ราคา/kg)
var FISH_PRICES = {
  "ปลากะมงขมิ้น":           480,
  "ปลาเจ้าสมุทร":            800,
  "ปลากะมงครีบฟ้า":          480,
  "ปลากะมงคีบฟ้า":           480,
  "ปลากะมงหัวกลม":           440,
  "ปลาเก๋าพริกไทย":          480,
  "ปลาเก๋าลายเมฆ":           460,
  "ปลากุดสลาด":              1300,
  "ปลาตะมะ":                 480,
  "ปลาหมอทะเล":              560,
  "ปลากะมงพร้าว":            440,
  "ปลากะมงจั๊งจั่น":         590,
  "ปลากะมงทะเลทราย":         380,
  "ปลาตะคองลาย":             380,
  "ปลากะพงเขียว":            600,
  "ปลาอีคุดปากหมู":          480,
  "ปลาทูลัง":                399,
  "ปลาอังเกย":               480,
  "ปลาอินทรีย์รีดเลือด":     600,
  "ปลาหัวเสี้ยม":            480,
  "ปลาอีโต้มอญ":             480,
  "ปลาเก่าดอกดำ":            480,
  "ปลาแดงเขี้ยว":            480,
  "ปลาสร้อยนกเขา":           290,
  "ปลาเก๋าสายบัว":           480,
  "ปลาเก๋าดอกแดง":           480,
  "ปลาเก๋าเลือดนก":          560,
  "ปลาแพะ":                  480,
  "ปลาดาบ":                  320,
  "ปลากะรังหัวโขน":          480,
  "ปลาสลิดหิน":              480,
  "ปลาสละ":                  480,
  "ปลาเก๋าเสือ":             560,
  "ปลากะพงแดงหลี":           830,
  "ปลาแชกำ":                 440,
  "ปลาขี้ตังเบ็ดครีบเหลือง": 400,
  "ปลากะพงเหลือง การีซี":    480,
  "ปลาการีซี":               480,
  "ปลามั่นแดง จวดแดง":       480,
  "ปลาหางเหลืองญี่ปุ่น":     230,
};

// ดึงชื่อไทยออกจาก "ปลาแพะ/Red Mullet" → "ปลาแพะ"
function getThaiName(name) {
  if (!name) return "";
  return name.toString().split("/")[0].trim();
}

// Lookup ราคาจากชื่อปลา (รองรับทั้ง "ปลาแพะ" และ "ปลาแพะ/Red Mullet")
function getFishPrice(name) {
  return FISH_PRICES[getThaiName(name)] || 0;
}

// ปลาที่ราคาต่อตัว (ไม่ใช่ต่อ kg) — fallback ถ้าไม่มี Sheet ราคาปลา
var FISH_UNITS = {
  "ปลากะรังหัวโขน": "ตัว",
};

// ชื่อภาษาอังกฤษของแต่ละชนิดปลา
var FISH_ENGLISH = {
  "ปลากะมงขมิ้น":           "Blacktip Trevally",
  "ปลาเจ้าสมุทร":            "Bluberlip Snapper",
  "ปลากะมงครีบฟ้า":          "Bluefin Trevally",
  "ปลากะมงคีบฟ้า":           "Blue Fin Trevally",
  "ปลากะมงหัวกลม":           "Buldger Trevally",
  "ปลาเก๋าพริกไทย":          "Camouflage Grouper",
  "ปลาเก๋าลายเมฆ":           "Cloudy Grouper",
  "ปลากุดสลาด":              "Coral Grouper",
  "ปลาตะมะ":                 "Emperor",
  "ปลาหมอทะเล":              "Giant Grouper",
  "ปลากะมงพร้าว":            "Giant Trevally",
  "ปลากะมงจั๊งจั่น":         "Golden Pompano",
  "ปลากะมงทะเลทราย":         "Golden Trevally",
  "ปลาตะคองลาย":             "Striped Trevally",
  "ปลากะพงเขียว":            "Green Jobfish",
  "ปลาอีคุดปากหมู":          "Harry Hot Lips",
  "ปลาทูลัง":                "Indian Mackerel",
  "ปลาอังเกย":               "John Snapper",
  "ปลาอินทรีย์รีดเลือด":     "King Mackerel",
  "ปลาหัวเสี้ยม":            "Longnose Emperor",
  "ปลาอีโต้มอญ":             "Mahi Mahi",
  "ปลาเก่าดอกดำ":            "Malabar Grouper",
  "ปลาแดงเขี้ยว":            "Mangrove Snapper",
  "ปลาสร้อยนกเขา":           "Painted Sweetlips",
  "ปลาเก๋าสายบัว":           "Peacock Rockcod",
  "ปลาเก๋าดอกแดง":           "Red Dot Grouper",
  "ปลาเก๋าเลือดนก":          "Red Mouth Grouper",
  "ปลาแพะ":                  "Red Mullet",
  "ปลาดาบ":                  "Ribbon Fish",
  "ปลากะรังหัวโขน":          "Stone Fish",
  "ปลาสลิดหิน":              "Streaked Spinefoot",
  "ปลาสละ":                  "Talang Queen Fish",
  "ปลาเก๋าเสือ":             "Tiger Grouper",
  "ปลากะพงแดงหลี":           "Two Spot Red Snapper",
  "ปลาแชกำ":                 "Yellow Dot Giant Trevally",
  "ปลาขี้ตังเบ็ดครีบเหลือง": "Yellowfin Surgeon Fish",
  "ปลากะพงเหลือง การีซี":    "Yellow Snapper",
  "ปลาการีซี":               "Yellow Snapper",
  "ปลามั่นแดง จวดแดง":       "Yellow Streaked Snapper",
  "ปลาหางเหลืองญี่ปุ่น":     "Yellow Tail Fusilier",
};

function getFishUnit(name) {
  return FISH_UNITS[getThaiName(name)] || "kg";
}

// ─── อ่านราคาจาก Sheet "ราคาปลา" (ถ้ามี) แทน hardcode ───
var _priceLookup = null;

function getPriceLookup() {
  if (_priceLookup) return _priceLookup;

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ราคาปลา");

  if (!sheet) {
    _priceLookup = { prices: FISH_PRICES, units: FISH_UNITS, images: {} };
    return _priceLookup;
  }

  var data    = sheet.getDataRange().getValues();
  var prices  = {};
  var units   = {};
  var images  = {};
  var english = {};

  data.slice(1).forEach(function(row) {
    var name  = (row[0] || "").toString().trim();
    var unit  = (row[1] || "kg").toString().trim();
    var price = parseFloat(row[2]) || 0;
    var img   = (row[3] || "").toString().trim();
    var eng   = (row[4] || "").toString().trim();
    if (name && price) {
      prices[name] = price;
      if (unit !== "kg") units[name] = unit;
      if (img) images[name] = img;
      if (eng) english[name] = eng;
    }
  });

  _priceLookup = { prices: prices, units: units, images: images, english: english };
  return _priceLookup;
}

// ใช้ฟังก์ชันเหล่านี้แทน FISH_PRICES/FISH_UNITS โดยตรง
function getFishPriceDynamic(name) {
  return getPriceLookup().prices[getThaiName(name)] || 0;
}

function getFishUnitDynamic(name) {
  return getPriceLookup().units[getThaiName(name)] || "kg";
}

// ─── สร้าง Sheet "ราคาปลา" พร้อม data เริ่มต้น ───
// รันครั้งเดียวจาก Apps Script Editor: Run > setupPriceSheet
function setupPriceSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ราคาปลา");

  if (!sheet) {
    sheet = ss.insertSheet("ราคาปลา");
  } else {
    sheet.clearContents();
  }

  // Header
  sheet.appendRow(["ชื่อปลา", "หน่วย", "ราคา", "รูปภาพ default", "ชื่ออังกฤษ"]);

  // Data เริ่มต้นจาก FISH_PRICES + FISH_UNITS + FISH_ENGLISH
  Object.keys(FISH_PRICES).forEach(function(name) {
    var unit  = FISH_UNITS[name] || "kg";
    var price = FISH_PRICES[name];
    var eng   = FISH_ENGLISH[name] || "";
    sheet.appendRow([name, unit, price, "", eng]);
  });

  // จัด style header
  var header = sheet.getRange(1, 1, 1, 5);
  header.setBackground("#2B5089").setFontColor("#FFFFFF").setFontWeight("bold");
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 200);

  // Dropdown kg / ตัว ใน column B
  var unitRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["kg", "ตัว"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("B2:B1000").setDataValidation(unitRule);

  sheet.getRange("C2:C1000").setNumberFormat("0");

  SpreadsheetApp.getUi().alert(
    "✅ สร้าง Sheet ราคาปลาเรียบร้อยแล้วค่ะ\n" +
    "แก้ราคาได้ที่ Column C\nเปลี่ยนหน่วยได้ที่ Column B (kg หรือ ตัว)"
  );
}

// ─────────────────────────────────────────────

// เพิ่มคอลัมน์ชื่ออังกฤษ (col E) ใน Sheet ราคาปลาที่มีอยู่แล้ว — รันครั้งเดียว
function addEnglishNamesColumn() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ราคาปลา");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("ไม่พบ Sheet ราคาปลา กรุณารัน setupPriceSheet ก่อนค่ะ");
    return;
  }

  var data = sheet.getDataRange().getValues();
  sheet.getRange(1, 5).setValue("ชื่ออังกฤษ")
    .setBackground("#2B5089").setFontColor("#FFFFFF").setFontWeight("bold");
  sheet.setColumnWidth(5, 200);

  var updates = [];
  data.slice(1).forEach(function(row, i) {
    var thaiName = (row[0] || "").toString().trim();
    updates.push([(row[4] || "").toString().trim() || FISH_ENGLISH[thaiName] || ""]);
  });
  if (updates.length) {
    sheet.getRange(2, 5, updates.length, 1).setValues(updates);
  }

  SpreadsheetApp.getUi().alert(
    "✅ เพิ่มคอลัมน์ชื่ออังกฤษเรียบร้อยแล้วค่ะ\n" +
    "รัน setupFishTypeQuestion ต่อเพื่ออัปเดต Google Form"
  );
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("APO Stock")
    .addItem("นำปลาขึ้นหน้าร้าน", "openDashboard")
    .addItem("บันทึกการขาย", "showSaleSidebar")
    .addItem("สรุปยอดขาย", "openSalesSummary")
    .addSeparator()
    .addItem("รีเฟรช Web App", "refreshWebApp")
    .addSeparator()
    .addItem("✏️ จัดการราคาปลา", "openPriceSheet")
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

  // อ่าน column index จาก header row
  var headers = data[0].map(function(h) { return (h || "").toString().trim(); });

  // รวบรวมทุก index ที่มีชื่อ header ตรงกัน (รองรับ duplicate columns)
  function allCols(name) {
    var cols = [];
    headers.forEach(function(h, i) { if (h === name) cols.push(i); });
    return cols;
  }
  // คืนค่าแรกที่ไม่ว่างจาก cols ที่ให้มา
  function pickVal(row, cols) {
    for (var k = 0; k < cols.length; k++) {
      var v = row[cols[k]];
      if (v != null && v !== "") return v;
    }
    return "";
  }

  var nameCols   = allCols("ชื่อปลา");        if (!nameCols.length)   nameCols   = [1];
  var codeCols   = allCols("รหัสตัว");        if (!codeCols.length)   codeCols   = [2];
  var weightCols = allCols("น้ำหนัก (กก.)"); if (!weightCols.length) weightCols = [3];
  var sourceCols = allCols("แหล่งจับ");       if (!sourceCols.length) sourceCols = [4];
  var noteCols   = allCols("หมายเหตุ");       if (!noteCols.length)   noteCols   = [5];
  var dayCols    = allCols("วันที่จับ – วัน");   if (!dayCols.length)    dayCols    = [6];
  var monthCols  = allCols("วันที่จับ – เดือน"); if (!monthCols.length)  monthCols  = [7];
  var imageCols  = allCols("แนบรูป");         if (!imageCols.length)  imageCols  = [8];
  var statusCol  = headers.lastIndexOf("สถานะ"); if (statusCol < 0)      statusCol  = 9;

  var result = [];
  data.slice(1).forEach(function(row, i) {
    var fishName = pickVal(row, nameCols);
    if (!fishName) return;

    var status = (row[statusCol] || "").toString() || "ใหม่";
    if (status === "Publish แล้ว") return;

    var day   = pickVal(row, dayCols);
    var month = pickVal(row, monthCols);
    var date  = day && month ? day + " " + month : "";

    var fishImage = makeDriveImageUrl(pickVal(row, imageCols)) ||
                    (getPriceLookup().images[getThaiName(fishName)] || "");

    result.push({
      rowIndex:  i + 2,
      name:      fishName,
      code:      pickVal(row, codeCols),
      weight:    pickVal(row, weightCols),
      source:    pickVal(row, sourceCols),
      note:      pickVal(row, noteCols),
      date:      date,
      image:     fishImage,
      status:    status,
      category:  getCategory(fishName),
      priceKg:   getFishPriceDynamic(fishName),
      unit:      getFishUnitDynamic(fishName),
      statusCol: statusCol
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
    var weight   = parseFloat(row.weight) || 0;
    var priceKg  = row.priceKg || getFishPriceDynamic(row.name);
    var lastRow  = liveSheet.getLastRow() + 1;

    liveSheet.appendRow([
      row.name,
      row.code,
      weight,
      row.source,
      row.date,
      priceKg,
      "",
      makeDriveImageUrl(row.image),
      today,
      "พร้อมขาย",
      row.category,
      row.unit || "kg"
    ]);

    liveSheet.getRange(lastRow, 7).setFormula(
      "=IF(F" + lastRow + "*C" + lastRow + "=0,\"\",F" + lastRow + "*C" + lastRow + ")"
    );

    var statusCol = (row.statusCol || 9) + 1; // convert 0-based → 1-based
    rawSheet.getRange(row.rowIndex, statusCol).setValue("Publish แล้ว");
    imported++;
  });

  return { success: true, message: "นำเข้าสำเร็จ " + imported + " ตัวค่ะ" };
}

function refreshWebApp() {
  SpreadsheetApp.getUi().alert("Web App ดึงข้อมูลจาก Sheet แบบ real-time อยู่แล้วค่ะ");
}

function openPriceSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ราคาปลา");
  if (!sheet) {
    var ui = SpreadsheetApp.getUi();
    var res = ui.alert("ยังไม่มี Sheet ราคาปลา", "ต้องการสร้างเลยไหมคะ?", ui.ButtonSet.YES_NO);
    if (res === ui.Button.YES) setupPriceSheet();
    return;
  }
  ss.setActiveSheet(sheet);
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
  html += '.price-tag { font-size:12px; font-weight:700; color:#AF9500; }';
  html += '.btn-import { width:100%; padding:12px; background:#2B5089; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; margin-top:8px; }';
  html += '.btn-import:disabled { background:#ccc; cursor:not-allowed; }';
  html += '.empty { text-align:center; padding:30px; color:#aaa; }';
  html += '.count { font-size:11px; color:#888; margin-bottom:10px; }';
  html += '.success { background:#e1f5ee; color:#0a6e43; padding:10px 12px; border-radius:8px; margin-bottom:10px; }';
  html += '.no-price { color:#e57373; font-size:11px; }';
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
  html += '    var priceHtml = f.priceKg > 0';
  html += '      ? "<span class=\\"price-tag\\">" + f.priceKg.toLocaleString() + " ฿/" + (f.unit||"kg") + "</span>"';
  html += '      : "<span class=\\"no-price\\">ไม่พบราคา</span>";';
  html += '    h += "<div class=\\"fish-item\\" id=\\"item-" + i + "\\" onclick=\\"toggleSelect(" + i + ")\\">";';
  html += '    h += "<div class=\\"fish-header\\">";';
  html += '    h += "<span class=\\"fish-name\\">" + f.name + "</span>";';
  html += '    h += "<span class=\\"fish-code\\">" + f.code + "</span>";';
  html += '    h += "<span class=\\"cat-badge " + cc + "\\">" + f.category + "</span>";';
  html += '    h += "</div><div class=\\"fish-detail\\">";';
  html += '    var wLabel = (f.unit === "ตัว") ? "จำนวน" : "น้ำหนัก";';
  html += '    var wUnit  = (f.unit === "ตัว") ? " ตัว" : " กก.";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">" + wLabel + " </span>" + f.weight + wUnit + "</div>";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">แหล่งจับ </span>" + f.source + "</div>";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">วันที่จับ </span>" + f.date + "</div>";';
  html += '    h += "<div class=\\"detail-item\\"><span class=\\"detail-label\\">ราคา </span>" + priceHtml + "</div>";';
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
