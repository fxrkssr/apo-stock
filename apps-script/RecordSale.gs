function openSalesSummary() {
  var html = HtmlService.createHtmlOutput(getSalesSummaryHtml())
    .setWidth(860)
    .setHeight(580);
  SpreadsheetApp.getUi().showModalDialog(html, "สรุปยอดขาย");
}

function getSalesData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ปลาที่ขายไปแล้ว");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var result = [];
  data.slice(1).forEach(function(row) {
    if (!row[0]) return;
    result.push({
      name:       row[0],
      code:       row[1],
      weight:     row[2],
      priceKg:    row[5],
      total:      row[6],
      buyerName:  row[8],
      buyerPhone: row[9],
      salePrice:  row[10],
      saleDate:   row[11]
    });
  });
  return result;
}

function getSalesSummaryHtml() {
  var h = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>';
  h += '* { margin:0; padding:0; box-sizing:border-box; }';
  h += 'body { font-family:sans-serif; font-size:13px; background:#0d1f3c; color:#e2d1c3; height:100vh; display:flex; flex-direction:column; overflow:hidden; }';
  h += '.topbar { background:#071221; padding:14px 20px; border-bottom:1px solid rgba(175,149,0,0.2); flex-shrink:0; }';
  h += '.topbar h2 { font-size:13px; color:#af9500; letter-spacing:0.08em; text-transform:uppercase; }';
  h += '.stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; padding:16px 20px; flex-shrink:0; }';
  h += '.stat-box { background:#122c52; border:1px solid rgba(175,149,0,0.15); border-radius:8px; padding:14px 16px; }';
  h += '.stat-label { font-size:10px; color:#af9500; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }';
  h += '.stat-val { font-size:22px; font-weight:700; color:#fff; }';
  h += '.stat-unit { font-size:12px; color:#6b7280; margin-left:4px; }';
  h += '.table-wrap { flex:1; overflow-y:auto; padding:0 20px 20px; }';
  h += 'table { width:100%; border-collapse:collapse; }';
  h += 'thead th { position:sticky; top:0; background:#071221; color:#af9500; font-size:10px; text-transform:uppercase; letter-spacing:0.06em; padding:10px 10px; text-align:left; border-bottom:1px solid rgba(175,149,0,0.2); }';
  h += 'tbody tr { border-bottom:1px solid rgba(255,255,255,0.05); }';
  h += 'tbody tr:hover { background:rgba(175,149,0,0.05); }';
  h += 'tbody td { padding:10px 10px; font-size:12px; color:#e2d1c3; }';
  h += '.badge { display:inline-block; background:#1a3a6e; color:#af9500; font-size:10px; padding:2px 7px; border-radius:20px; }';
  h += '.price { color:#7ee8a2; font-weight:600; }';
  h += '.loading { color:#6b7280; text-align:center; padding:40px; }';
  h += '.empty { color:#6b7280; text-align:center; padding:40px; }';
  h += '</style></head><body>';
  h += '<div class="topbar"><h2>สรุปยอดขาย</h2></div>';
  h += '<div class="stats">';
  h += '<div class="stat-box"><div class="stat-label">ขายแล้วทั้งหมด</div><div class="stat-val" id="s-count">...</div></div>';
  h += '<div class="stat-box"><div class="stat-label">ยอดขายรวม</div><div class="stat-val" id="s-revenue">...</div></div>';
  h += '<div class="stat-box"><div class="stat-label">น้ำหนักรวม</div><div class="stat-val" id="s-weight">...</div></div>';
  h += '</div>';
  h += '<div class="table-wrap">';
  h += '<div class="loading" id="loading">กำลังโหลด...</div>';
  h += '<table id="tbl" style="display:none"><thead><tr>';
  h += '<th>วันที่ขาย</th><th>ชื่อปลา</th><th>รหัส</th><th>น้ำหนัก</th><th>ราคา/กก.</th><th>ยอดขาย</th><th>ผู้ซื้อ</th>';
  h += '</tr></thead><tbody id="tbody"></tbody></table>';
  h += '<div class="empty" id="empty" style="display:none">ยังไม่มีการขายค่ะ</div>';
  h += '</div>';
  h += '<script>';
  h += 'google.script.run.withSuccessHandler(function(data) {';
  h += '  document.getElementById("loading").style.display = "none";';
  h += '  if (!data.length) { document.getElementById("empty").style.display = "block"; return; }';
  h += '  var totalRev = 0, totalWt = 0;';
  h += '  var rows = "";';
  h += '  data.forEach(function(r) {';
  h += '    var sp = parseFloat(r.salePrice) || 0;';
  h += '    var wt = parseFloat(r.weight) || 0;';
  h += '    totalRev += sp; totalWt += wt;';
  h += '    var pkg = r.priceKg ? Number(r.priceKg).toLocaleString() + " ฿" : "-";';
  h += '    rows += "<tr>";';
  h += '    rows += "<td>" + (r.saleDate || "-") + "</td>";';
  h += '    rows += "<td>" + r.name + "</td>";';
  h += '    rows += "<td><span class=\\"badge\\">" + r.code + "</span></td>";';
  h += '    rows += "<td>" + wt + " กก.</td>";';
  h += '    rows += "<td>" + pkg + "</td>";';
  h += '    rows += "<td class=\\"price\\">" + sp.toLocaleString() + " ฿</td>";';
  h += '    rows += "<td>" + (r.buyerName || "-") + "</td>";';
  h += '    rows += "</tr>";';
  h += '  });';
  h += '  document.getElementById("s-count").innerHTML = data.length + "<span class=\\"stat-unit\\">ตัว</span>";';
  h += '  document.getElementById("s-revenue").innerHTML = totalRev.toLocaleString() + "<span class=\\"stat-unit\\">฿</span>";';
  h += '  document.getElementById("s-weight").innerHTML = totalWt.toFixed(1) + "<span class=\\"stat-unit\\">กก.</span>";';
  h += '  document.getElementById("tbody").innerHTML = rows;';
  h += '  document.getElementById("tbl").style.display = "table";';
  h += '}).getSalesData();';
  h += '<\/script></body></html>';
  return h;
}

function showSaleSidebar() {
  var html = HtmlService.createHtmlOutput(getSaleSidebarHtml())
    .setWidth(860)
    .setHeight(580);
  SpreadsheetApp.getUi().showModalDialog(html, "บันทึกการขาย");
}

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
      name:     row[0],
      code:     row[1],
      weight:   row[2],
      source:   row[3],
      date:     row[4],
      priceKg:  row[5],
      total:    row[6],
      image:    row[7],
      status:   row[9] || "พร้อมขาย"
    });
  });
  return result;
}

function recordSale(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var liveSheet = ss.getSheetByName("Stock ที่จะขายให้ลูกค้า");
  var soldSheet = ss.getSheetByName("ปลาที่ขายไปแล้ว");

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

  var liveRow = liveSheet.getRange(data.rowIndex, 1, 1, 10).getValues()[0];

  soldSheet.appendRow([
    liveRow[0], liveRow[1], liveRow[2], liveRow[3], liveRow[4],
    liveRow[5], liveRow[6], liveRow[7],
    data.buyerName, data.buyerPhone, data.salePrice, data.saleDate
  ]);

  liveSheet.getRange(data.rowIndex, 10).setValue("ขายแล้ว");

  return { success: true, message: "บันทึกการขายเรียบร้อยแล้วค่ะ" };
}

function styleHeader(sheet, numCols, bgColor) {
  sheet.getRange(1, 1, 1, numCols)
    .setBackground(bgColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(11);
  sheet.setRowHeight(1, 36);
}

function getSaleSidebarHtml() {
  var today = new Date();
  var d = today.getDate().toString();
  var m = (today.getMonth() + 1).toString().padStart(2, '0');
  var y = today.getFullYear() + 543;
  var todayStr = d + "/" + m + "/" + y;

  var h = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>';
  h += '* { margin:0; padding:0; box-sizing:border-box; }';
  h += 'body { font-family: sans-serif; font-size:13px; background:#f0f4f8; display:flex; flex-direction:column; height:100vh; overflow:hidden; }';
  h += '.topbar { background:#1e3d6e; color:white; padding:12px 18px; flex-shrink:0; }';
  h += '.topbar h2 { font-size:15px; font-weight:600; }';
  h += '.topbar p { font-size:11px; opacity:0.6; margin-top:2px; }';
  h += '.body { display:flex; flex:1; overflow:hidden; }';
  h += '.left { width:320px; flex-shrink:0; overflow-y:auto; padding:12px; border-right:1px solid #dde3ec; background:#f7f9fc; }';
  h += '.right { flex:1; overflow-y:auto; padding:16px; background:white; }';
  h += '.fish-card { background:white; border:1.5px solid #dde3ec; border-radius:8px; padding:11px 13px; margin-bottom:8px; cursor:pointer; }';
  h += '.fish-card:hover { border-color:#1e3d6e; }';
  h += '.fish-card.active { border-color:#1e3d6e; background:#eef2fb; }';
  h += '.card-thumb { width:100%; height:80px; object-fit:cover; border-radius:5px; margin-bottom:7px; background:#dde3ec; }';
  h += '.card-name { font-weight:600; color:#1a2f50; font-size:13px; }';
  h += '.card-code { display:inline-block; background:#1e3d6e; color:white; font-size:10px; padding:1px 7px; border-radius:20px; margin-left:6px; }';
  h += '.card-meta { font-size:11px; color:#888; margin-top:4px; }';
  h += '.card-price { font-size:12px; color:#1e3d6e; font-weight:600; margin-top:3px; }';
  h += '.placeholder { color:#aaa; font-size:13px; text-align:center; padding:40px 20px; }';
  h += '.section { margin-bottom:16px; }';
  h += '.section-title { font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px; }';
  h += '.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }';
  h += '.info-box { background:#f0f4f8; border-radius:6px; padding:8px 10px; }';
  h += '.info-label { font-size:10px; color:#aaa; margin-bottom:2px; }';
  h += '.info-val { font-size:13px; color:#1a2f50; font-weight:600; }';
  h += '.field { margin-bottom:10px; }';
  h += '.field label { font-size:11px; color:#666; display:block; margin-bottom:4px; }';
  h += '.field input { width:100%; padding:8px 10px; border:1px solid #ddd; border-radius:6px; font-size:13px; }';
  h += '.btn-record { width:100%; padding:12px; background:#1e3d6e; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; margin-top:6px; }';
  h += '.btn-record:disabled { background:#ccc; cursor:not-allowed; }';
  h += '.success { background:#e1f5ee; color:#0a6e43; padding:10px 12px; border-radius:8px; margin-bottom:12px; font-size:13px; }';
  h += '.loading { color:#aaa; font-size:13px; text-align:center; padding:30px; }';
  h += '.empty { color:#aaa; font-size:13px; text-align:center; padding:30px; }';
  h += '.fish-img { width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:14px; background:#eee; }';
  h += '</style></head><body>';

  h += '<div class="topbar"><h2>บันทึกการขาย</h2><p>เลือกปลาแล้วกรอกข้อมูลผู้ซื้อ</p></div>';
  h += '<div class="body">';

  h += '<div class="left">';
  h += '<div class="loading" id="loading">กำลังโหลด...</div>';
  h += '<div id="fish-list"></div>';
  h += '<div class="empty" id="empty" style="display:none">ไม่มีปลาพร้อมขายค่ะ</div>';
  h += '</div>';

  h += '<div class="right">';
  h += '<div class="placeholder" id="placeholder">เลือกปลาจากรายการซ้ายมือ</div>';
  h += '<div id="form-area" style="display:none">';
  h += '<div id="success-msg" style="display:none" class="success"></div>';
  h += '<img id="fish-img" class="fish-img" src="" style="display:none" />';
  h += '<div class="section">';
  h += '<div class="section-title">ข้อมูลปลา</div>';
  h += '<div class="info-grid">';
  h += '<div class="info-box"><div class="info-label">น้ำหนัก</div><div class="info-val" id="info-weight">-</div></div>';
  h += '<div class="info-box"><div class="info-label">แหล่งจับ</div><div class="info-val" id="info-source">-</div></div>';
  h += '<div class="info-box"><div class="info-label">ราคา/กก.</div><div class="info-val" id="info-price-kg">-</div></div>';
  h += '<div class="info-box"><div class="info-label">ราคารวม</div><div class="info-val" id="info-total">-</div></div>';
  h += '</div></div>';
  h += '<div class="section">';
  h += '<div class="section-title">ข้อมูลผู้ซื้อ</div>';
  h += '<div class="field"><label>ชื่อร้าน / ผู้ซื้อ *</label><input type="text" id="buyer-name" placeholder="เช่น ร้าน Le Du" /></div>';
  h += '<div class="field"><label>เบอร์โทร *</label><input type="text" id="buyer-phone" placeholder="08X-XXX-XXXX" /></div>';
  h += '<div class="field"><label>ราคาที่ขายจริง (บาท) *</label><input type="number" id="sale-price" placeholder="0" /></div>';
  h += '<div class="field"><label>วันที่ขาย *</label><input type="text" id="sale-date" value="' + todayStr + '" /></div>';
  h += '</div>';
  h += '<button class="btn-record" id="btn-record" onclick="doRecord()">บันทึกการขาย</button>';
  h += '</div></div></div>';

  h += '<script>';
  h += 'var allFish = []; var selected = null;';
  h += 'google.script.run.withSuccessHandler(function(data) {';
  h += '  document.getElementById("loading").style.display = "none";';
  h += '  allFish = data;';
  h += '  if (data.length === 0) { document.getElementById("empty").style.display = "block"; return; }';
  h += '  renderList(data);';
  h += '}).getLiveStock();';

  h += 'function renderList(fish) {';
  h += '  var html = "";';
  h += '  fish.forEach(function(f, i) {';
  h += '    var total = f.total ? Number(f.total).toLocaleString() + " ฿" : "-";';
  h += '    var imgUrl = toImgUrl(f.image);';
  h += '    html += "<div class=\\"fish-card\\" id=\\"card-" + i + "\\" onclick=\\"selectFish(" + i + ")\\">";';
  h += '    if (imgUrl) html += "<img class=\\"card-thumb\\" src=\\"" + imgUrl + "\\" />";';
  h += '    html += "<div><span class=\\"card-name\\">" + f.name + "</span><span class=\\"card-code\\">" + f.code + "</span></div>";';
  h += '    html += "<div class=\\"card-meta\\">" + f.weight + " กก. · " + (f.source || "-") + "</div>";';
  h += '    html += "<div class=\\"card-price\\">" + total + "</div>";';
  h += '    html += "</div>";';
  h += '  });';
  h += '  document.getElementById("fish-list").innerHTML = html;';
  h += '}';

  h += 'function toImgUrl(url) {';
  h += '  if (!url || url.indexOf("drive.google.com") === -1) return url;';
  h += '  var m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\\/d\\/([a-zA-Z0-9_-]+)/);';
  h += '  return m ? "https://lh3.googleusercontent.com/d/" + m[1] : url;';
  h += '}';
  h += 'function selectFish(i) {';
  h += '  document.querySelectorAll(".fish-card").forEach(function(c) { c.classList.remove("active"); });';
  h += '  document.getElementById("card-" + i).classList.add("active");';
  h += '  selected = allFish[i];';
  h += '  document.getElementById("placeholder").style.display = "none";';
  h += '  document.getElementById("form-area").style.display = "block";';
  h += '  document.getElementById("success-msg").style.display = "none";';
  h += '  document.getElementById("info-weight").textContent = selected.weight + " กก.";';
  h += '  document.getElementById("info-source").textContent = selected.source || "-";';
  h += '  document.getElementById("info-price-kg").textContent = selected.priceKg ? Number(selected.priceKg).toLocaleString() + " ฿" : "-";';
  h += '  document.getElementById("info-total").textContent = selected.total ? Number(selected.total).toLocaleString() + " ฿" : "-";';
  h += '  document.getElementById("sale-price").value = selected.total || "";';
  h += '  var img = document.getElementById("fish-img");';
  h += '  if (selected.image) { img.src = toImgUrl(selected.image); img.style.display = "block"; } else { img.style.display = "none"; }';
  h += '}';

  h += 'function doRecord() {';
  h += '  var name  = document.getElementById("buyer-name").value.trim();';
  h += '  var phone = document.getElementById("buyer-phone").value.trim();';
  h += '  var price = document.getElementById("sale-price").value.trim();';
  h += '  var date  = document.getElementById("sale-date").value.trim();';
  h += '  if (!selected || !name || !phone || !price || !date) { alert("กรุณากรอกข้อมูลให้ครบค่ะ"); return; }';
  h += '  var btn = document.getElementById("btn-record");';
  h += '  btn.disabled = true; btn.textContent = "กำลังบันทึก...";';
  h += '  google.script.run.withSuccessHandler(function(result) {';
  h += '    var msg = document.getElementById("success-msg");';
  h += '    msg.textContent = result.message; msg.style.display = "block";';
  h += '    document.getElementById("buyer-name").value = "";';
  h += '    document.getElementById("buyer-phone").value = "";';
  h += '    document.getElementById("sale-price").value = "";';
  h += '    btn.disabled = false; btn.textContent = "บันทึกการขาย";';
  h += '    selected = null;';
  h += '    document.getElementById("placeholder").style.display = "block";';
  h += '    document.getElementById("form-area").style.display = "none";';
  h += '    google.script.run.withSuccessHandler(function(data) {';
  h += '      allFish = data;';
  h += '      renderList(data);';
  h += '    }).getLiveStock();';
  h += '  }).recordSale({ rowIndex: selected.rowIndex, buyerName: name, buyerPhone: phone, salePrice: price, saleDate: date });';
  h += '}';
  h += '<\/script></body></html>';

  return h;
}
