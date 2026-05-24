// ============================================================
//  APO — Admin Dashboard (v2)
// ============================================================

function openDashboard() {
  var html = HtmlService.createHtmlOutput(getDashboardHtml())
    .setWidth(900)
    .setHeight(640);
  SpreadsheetApp.getUi().showModalDialog(html, "āPO — Admin Dashboard");
}

function uploadNewImage(base64Data, mimeType, fileName) {
  var decoded = Utilities.base64Decode(base64Data);
  var blob    = Utilities.newBlob(decoded, mimeType, fileName);
  var file    = DriveApp.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return "https://lh3.googleusercontent.com/d/" + file.getId();
}

function publishFish(data) {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet  = ss.getSheetByName("Stock จากชาวประมง");
  var liveSheet = ss.getSheetByName("Stock ที่จะขายให้ลูกค้า");
  if (!rawSheet || !liveSheet) return { success: false, message: "ไม่พบ Sheet ค่ะ" };

  var today   = Utilities.formatDate(new Date(), "Asia/Bangkok", "d/MM/yyyy");
  var lastRow = liveSheet.getLastRow() + 1;

  liveSheet.appendRow([
    data.name, data.code, parseFloat(data.weight) || 0,
    data.source, data.date, parseFloat(data.priceKg) || "", "", data.image,
    today, "พร้อมขาย", data.category
  ]);
  liveSheet.getRange(lastRow, 7).setFormula(
    "=IF(F"+lastRow+"*C"+lastRow+'=0,"",F'+lastRow+"*C"+lastRow+")"
  );
  rawSheet.getRange(data.rowIndex, 10).setValue("Publish แล้ว");
  return { success: true, message: "ขึ้นขายเรียบร้อยแล้วค่ะ" };
}

function getDashboardHtml() {
  var css = ''
  + '* { margin:0; padding:0; box-sizing:border-box; }'
  + 'body { font-family:"Helvetica Neue",sans-serif; font-size:13px; background:#0d1f3c; color:#e2d1c3; height:100vh; overflow:hidden; }'
  + '.layout { display:flex; height:100vh; }'
  + '.list-panel { width:320px; flex-shrink:0; background:#0a1829; border-right:1px solid rgba(175,149,0,0.2); display:flex; flex-direction:column; }'
  + '.list-header { padding:14px 16px; background:#071221; border-bottom:1px solid rgba(175,149,0,0.2); }'
  + '.list-header h2 { font-size:13px; color:#af9500; letter-spacing:0.08em; text-transform:uppercase; }'
  + '.list-header p { font-size:11px; color:#6b7280; margin-top:2px; }'
  + '.fish-list { flex:1; overflow-y:auto; padding:10px; }'
  + '.fish-card { background:#122c52; border:1px solid rgba(175,149,0,0.1); border-radius:8px; padding:10px; margin-bottom:8px; cursor:pointer; display:flex; gap:10px; align-items:center; }'
  + '.fish-card:hover { border-color:rgba(175,149,0,0.4); }'
  + '.fish-card.active { border-color:#af9500; background:#1a3a6e; }'
  + '.fish-thumb { width:52px; height:52px; border-radius:6px; object-fit:cover; background:#0d1f3c; flex-shrink:0; }'
  + '.fish-thumb-ph { width:52px; height:52px; border-radius:6px; background:#1a2d4a; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }'
  + '.fish-meta { flex:1; min-width:0; }'
  + '.fish-name { font-weight:600; font-size:13px; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }'
  + '.fish-code { font-size:10px; color:#af9500; margin-top:1px; }'
  + '.fish-sub { font-size:11px; color:#6b7280; margin-top:3px; }'
  + '.empty-list { text-align:center; padding:40px 20px; color:#6b7280; font-size:12px; }'
  + '.edit-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; }'
  + '.placeholder { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#3a4f6b; }'
  + '.placeholder span { font-size:40px; margin-bottom:12px; }'
  + '.edit-form { flex:1; display:flex; flex-direction:column; overflow:hidden; }'
  + '.edit-header { padding:14px 20px; background:#071221; border-bottom:1px solid rgba(175,149,0,0.2); display:flex; align-items:center; justify-content:space-between; }'
  + '.edit-header h2 { font-size:13px; color:#af9500; letter-spacing:0.06em; text-transform:uppercase; }'
  + '.edit-body { flex:1; overflow-y:auto; padding:16px 20px; display:flex; gap:20px; }'
  + '.img-section { width:200px; flex-shrink:0; }'
  + '.img-preview { width:200px; height:160px; border-radius:8px; object-fit:cover; background:#0a1829; border:1px solid rgba(175,149,0,0.2); }'
  + '.img-ph { width:200px; height:160px; border-radius:8px; background:#0a1829; border:1px dashed rgba(175,149,0,0.3); display:flex; align-items:center; justify-content:center; font-size:36px; }'
  + '.btn-upload { width:100%; margin-top:8px; padding:8px; background:transparent; border:1px solid rgba(175,149,0,0.4); color:#af9500; border-radius:6px; font-size:12px; cursor:pointer; }'
  + '.img-note { font-size:10px; color:#6b7280; margin-top:6px; text-align:center; }'
  + '.fields { flex:1; display:grid; grid-template-columns:1fr 1fr; gap:12px; align-content:start; }'
  + '.field { display:flex; flex-direction:column; gap:4px; }'
  + '.field.full { grid-column:1/-1; }'
  + '.field label { font-size:10px; color:#af9500; text-transform:uppercase; letter-spacing:0.06em; }'
  + '.field input, .field select { background:#0a1829; border:1px solid rgba(175,149,0,0.2); color:#e2d1c3; padding:8px 10px; border-radius:6px; font-size:13px; }'
  + '.field input:focus, .field select:focus { outline:none; border-color:#af9500; }'
  + '.field select option { background:#0a1829; }'
  + '.edit-footer { padding:12px 20px; border-top:1px solid rgba(175,149,0,0.2); background:#071221; display:flex; align-items:center; gap:12px; }'
  + '.btn-publish { flex:1; padding:12px; background:#af9500; color:#000; border:none; border-radius:8px; font-size:13px; font-weight:700; text-transform:uppercase; cursor:pointer; }'
  + '.btn-publish:disabled { background:#3a4f6b; color:#6b7280; cursor:not-allowed; }'
  + '.ok { font-size:12px; color:#7ee8a2; } .err { font-size:12px; color:#f78166; }';

  var body = ''
  + '<div class="layout">'
  + '<div class="list-panel">'
  + '  <div class="list-header"><h2>🐟 Stock จากชาวประมง</h2><p id="cnt">กำลังโหลด...</p></div>'
  + '  <div class="fish-list" id="lst"><div class="empty-list">กำลังโหลด...</div></div>'
  + '</div>'
  + '<div class="edit-panel">'
  + '  <div class="placeholder" id="ph"><span>🐟</span><p>เลือกปลาจากรายการด้านซ้าย</p></div>'
  + '  <div class="edit-form" id="ef" style="display:none">'
  + '    <div class="edit-header"><h2>แก้ไขข้อมูลก่อนขึ้นขาย</h2><span id="ec" style="font-size:11px;color:#6b7280"></span></div>'
  + '    <div class="edit-body">'
  + '      <div class="img-section">'
  + '        <div class="img-ph" id="iph">🐟</div>'
  + '        <img id="ipv" class="img-preview" style="display:none" src="" />'
  + '        <button class="btn-upload" onclick="document.getElementById(\'fi\').click()">อัปโหลดรูปใหม่</button>'
  + '        <input type="file" id="fi" accept="image/*" style="display:none" onchange="onFile(this)" />'
  + '        <p class="img-note" id="inote">ใช้รูปเดิมจากชาวประมง</p>'
  + '      </div>'
  + '      <div class="fields">'
  + '        <div class="field full"><label>ชื่อปลา</label><input type="text" id="fn" /></div>'
  + '        <div class="field"><label>รหัสตัว</label><input type="text" id="fc" /></div>'
  + '        <div class="field"><label>ประเภท</label><select id="fcat"><option value="ปลา">ปลา</option><option value="หอย/ทะเล">หอย/ทะเล</option></select></div>'
  + '        <div class="field"><label id="fw-label">น้ำหนัก (กก.)</label><input type="number" id="fw" step="0.1" /></div>'
  + '        <div class="field"><label id="fprice-label">ราคา/กก. (บาท)</label><input type="number" id="fprice" step="1" placeholder="กรอกราคา" /></div>'
  + '        <div class="field"><label>แหล่งจับ</label><input type="text" id="fs" /></div>'
  + '        <div class="field"><label>วันที่จับ</label><input type="text" id="fd" /></div>'
  + '      </div>'
  + '    </div>'
  + '    <div class="edit-footer"><button class="btn-publish" id="bp" onclick="doPublish()">ขึ้นขาย</button><span id="fm"></span></div>'
  + '  </div>'
  + '</div>'
  + '</div>';

  var js = ''
  + 'var fish=[], sel=null, b64=null, mime=null, fname=null;'
  + 'google.script.run'
  + '.withSuccessHandler(function(d){'
  + '  fish=d||[];'
  + '  document.getElementById("cnt").textContent = fish.length ? "รายการใหม่ "+fish.length+" ตัว" : "ไม่มีรายการใหม่";'
  + '  if(!fish.length){document.getElementById("lst").innerHTML="<div class=\'empty-list\'>ไม่มีปลาใหม่จากชาวประมงค่ะ</div>";return;}'
  + '  document.getElementById("lst").innerHTML=fish.map(function(f,i){'
  + '    var img=f.image?"<img class=\'fish-thumb\' src=\'"+f.image+"\' onerror=\'this.style.display=\\\"none\\\"\' />":"<div class=\'fish-thumb-ph\'>🐟</div>";'
  + '    return "<div class=\'fish-card\' id=\'c"+i+"\' onclick=\'pick("+i+")\'>"'
  + '      +img+"<div class=\'fish-meta\'>"'
  + '      +"<div class=\'fish-name\'>"+f.name+"</div>"'
  + '      +"<div class=\'fish-code\'>"+f.code+"</div>"'
  + '      +"<div class=\'fish-sub\'>"+f.weight+" กก. · "+(f.date||"—")+"</div>"'
  + '      +"</div></div>";'
  + '  }).join("");'
  + '})'
  + '.withFailureHandler(function(e){'
  + '  document.getElementById("cnt").textContent="โหลดไม่ได้";'
  + '  document.getElementById("lst").innerHTML="<div class=\'empty-list\' style=\'color:#f78166\'>"+e.message+"</div>";'
  + '})'
  + '.getRawStock();'

  + 'function pick(i){'
  + '  if(sel!==null){var p=document.getElementById("c"+sel);if(p)p.classList.remove("active");}'
  + '  sel=i; b64=null; mime=null; fname=null;'
  + '  document.getElementById("c"+i).classList.add("active");'
  + '  var f=fish[i];'
  + '  document.getElementById("ph").style.display="none";'
  + '  document.getElementById("ef").style.display="flex";'
  + '  document.getElementById("ec").textContent=f.code;'
  + '  document.getElementById("fn").value=f.name||"";'
  + '  document.getElementById("fc").value=f.code||"";'
  + '  document.getElementById("fw").value=f.weight||"";'
  + '  document.getElementById("fs").value=f.source||"";'
  + '  document.getElementById("fd").value=f.date||"";'
  + '  document.getElementById("fcat").value=f.category||"ปลา";'
  + '  document.getElementById("fprice").value=f.priceKg||"";'
  + '  var unit=f.unit||"kg";'
  + '  document.getElementById("fw-label").textContent=unit==="ตัว"?"จำนวน (ตัว)":"น้ำหนัก (กก.)";'
  + '  document.getElementById("fprice-label").textContent=unit==="ตัว"?"ราคา/ตัว (บาท)":"ราคา/กก. (บาท)";'
  + '  var pv=document.getElementById("ipv"); var ph=document.getElementById("iph");'
  + '  if(f.image){pv.src=f.image;pv.style.display="block";ph.style.display="none";}else{pv.style.display="none";ph.style.display="flex";}'
  + '  document.getElementById("inote").textContent="ใช้รูปเดิมจากชาวประมง";'
  + '  document.getElementById("fm").textContent="";'
  + '  document.getElementById("bp").disabled=false;'
  + '  document.getElementById("bp").textContent="ขึ้นขาย";'
  + '}'

  + 'function onFile(inp){'
  + '  var file=inp.files[0]; if(!file)return;'
  + '  var r=new FileReader();'
  + '  r.onload=function(e){'
  + '    var img=new Image();'
  + '    img.onload=function(){'
  + '      var c=document.createElement("canvas");'
  + '      var s=Math.min(1,1200/Math.max(img.width,img.height));'
  + '      c.width=img.width*s; c.height=img.height*s;'
  + '      c.getContext("2d").drawImage(img,0,0,c.width,c.height);'
  + '      var url=c.toDataURL("image/jpeg",0.82);'
  + '      b64=url.split(",")[1]; mime="image/jpeg"; fname=file.name;'
  + '      var pv=document.getElementById("ipv");'
  + '      pv.src=url; pv.style.display="block";'
  + '      document.getElementById("iph").style.display="none";'
  + '      document.getElementById("inote").textContent="✅ ใช้รูปใหม่ที่เลือก";'
  + '    }; img.src=e.target.result;'
  + '  }; r.readAsDataURL(file);'
  + '}'

  + 'function driveUrl(url){'
  + '  if(!url||url.indexOf("drive.google.com")===-1)return url||"";'
  + '  var m=url.match(/\\/d\\/([a-zA-Z0-9_-]+)/);'
  + '  if(!m)m=url.match(/[?&]id=([a-zA-Z0-9_-]+)/);'
  + '  return m?"https://lh3.googleusercontent.com/d/"+m[1]:url;'
  + '}'

  + 'function doPublish(){'
  + '  if(sel===null)return;'
  + '  var f=fish[sel];'
  + '  var btn=document.getElementById("bp"); var msg=document.getElementById("fm");'
  + '  btn.disabled=true; btn.textContent="กำลังบันทึก..."; msg.textContent="";'
  + '  function save(imgUrl){'
  + '    google.script.run'
  + '    .withSuccessHandler(function(r){'
  + '      if(r.success){'
  + '        msg.className="ok"; msg.textContent=r.message;'
  + '        fish.splice(sel,1);'
  + '        document.getElementById("c"+sel).remove();'
  + '        document.querySelectorAll(".fish-card").forEach(function(c,i){c.id="c"+i;c.setAttribute("onclick","pick("+i+")");});'
  + '        sel=null;'
  + '        document.getElementById("ef").style.display="none";'
  + '        document.getElementById("ph").style.display="flex";'
  + '        document.getElementById("cnt").textContent="รายการใหม่ "+fish.length+" ตัว";'
  + '      }else{msg.className="err";msg.textContent=r.message;btn.disabled=false;btn.textContent="ขึ้นขาย";}'
  + '    })'
  + '    .withFailureHandler(function(e){msg.className="err";msg.textContent=e.message;btn.disabled=false;btn.textContent="ขึ้นขาย";})'
  + '    .publishFish({rowIndex:f.rowIndex,name:document.getElementById("fn").value,code:document.getElementById("fc").value,'
  + '      weight:document.getElementById("fw").value,priceKg:document.getElementById("fprice").value,'
  + '      source:document.getElementById("fs").value,'
  + '      date:document.getElementById("fd").value,category:document.getElementById("fcat").value,image:imgUrl});'
  + '  }'
  + '  if(b64){google.script.run.withSuccessHandler(save).withFailureHandler(function(e){msg.className="err";msg.textContent=e.message;btn.disabled=false;btn.textContent="ขึ้นขาย";}).uploadNewImage(b64,mime,fname);}'
  + '  else{save(driveUrl(fish[sel].image));}'
  + '}';

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' + css + '</style></head>'
    + '<body>' + body + '<script>' + js + '<\/script></body></html>';
}

// รีเซ็ต Sheet "Stock จากชาวประมง" ให้สะอาด — ลบข้อมูลเก่าและ column ซ้ำทิ้งทั้งหมด
// รันครั้งเดียวจาก Apps Script Editor: Run > resetStockSheet
function resetStockSheet() {
  var FORM_ID = "1E7lftgnlrkU4PpOAkJz5Yjo_aoMvKGlt6CFalQQawiA";
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var form = FormApp.openById(FORM_ID);

  var oldSheet = ss.getSheetByName("Stock จากชาวประมง");

  // 1. ยกเลิก link form → sheet เก่า (ทำให้ลบ column ได้)
  try { form.removeDestination(); } catch(e) {}

  // 2. rename sheet เก่าก่อนเพื่อไม่ให้ชื่อชน
  if (oldSheet) oldSheet.setName("__old_stock__");

  // 3. link form → spreadsheet นี้ใหม่ → สร้าง sheet สะอาด
  var sheetsBefore = ss.getSheets().map(function(s) { return s.getName(); });
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  Utilities.sleep(4000);

  // 4. หา sheet ใหม่ที่เพิ่งสร้าง
  var newSheet = null;
  ss.getSheets().forEach(function(s) {
    if (sheetsBefore.indexOf(s.getName()) === -1) newSheet = s;
  });
  if (newSheet) {
    newSheet.setName("Stock จากชาวประมง");
    ss.moveActiveSheet(ss.getSheets().indexOf(newSheet) + 1);
  }

  // 5. ลบ sheet เก่า
  var toDelete = ss.getSheetByName("__old_stock__");
  if (toDelete) ss.deleteSheet(toDelete);

  // 6. เพิ่ม column "สถานะ" ท้าย header
  var target = ss.getSheetByName("Stock จากชาวประมง");
  if (target) {
    var lastCol = target.getLastColumn() + 1;
    target.getRange(1, lastCol).setValue("สถานะ");
  }

  SpreadsheetApp.getUi().alert("✅ รีเซ็ต Sheet เรียบร้อยแล้วค่ะ\nตอนนี้ column ตรงกับ Form พอดี");
}

// เพิ่ม 3 คำถามที่ยังขาด (แหล่งจับ / วันที่จับ–วัน / วันที่จับ–เดือน) และจัดลำดับ
function fixMissingQuestions() {
  var form = FormApp.openById("1E7lftgnlrkU4PpOAkJz5Yjo_aoMvKGlt6CFalQQawiA");

  form.addListItem().setTitle("แหล่งจับ").setRequired(true)
    .setChoiceValues(["หลีเป๊ะ","ภูเก็ต","กระบี่","สตูล","ตรัง","ระนอง","สุราษฎร์ธานี","อื่นๆ"]);

  var days = [];
  for (var d = 1; d <= 31; d++) days.push(String(d));
  form.addListItem().setTitle("วันที่จับ – วัน").setRequired(true).setChoiceValues(days);

  form.addListItem().setTitle("วันที่จับ – เดือน").setRequired(true)
    .setChoiceValues(["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]);

  // จัดลำดับ
  var order = ["ชื่อปลา","รหัสตัว","น้ำหนัก (กก.)","แหล่งจับ","หมายเหตุ","วันที่จับ – วัน","วันที่จับ – เดือน","แนบรูป"];
  order.forEach(function(title, pos) {
    var items = form.getItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i].getTitle() === title) {
        try { form.moveItem(items[i].getIndex(), pos); } catch(e) {}
        break;
      }
    }
  });

  SpreadsheetApp.getUi().alert("✅ เพิ่มครบแล้วค่ะ รวม " + form.getItems().length + " คำถาม");
}

// กู้คืน form questions ที่หายไป — รันครั้งเดียวจาก Apps Script Editor
function setupAllFormQuestions() {
  var REAL_FORM_ID = "1E7lftgnlrkU4PpOAkJz5Yjo_aoMvKGlt6CFalQQawiA";
  var form;
  try {
    form = FormApp.openById(REAL_FORM_ID);
  } catch(e) {
    SpreadsheetApp.getUi().alert("เปิด Form ไม่ได้: " + e.message);
    return;
  }

  function getByTitle(title) {
    var items = form.getItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i].getTitle() === title) return items[i];
    }
    return null;
  }

  if (!getByTitle("รหัสตัว")) {
    form.addTextItem().setTitle("รหัสตัว").setRequired(true);
  }
  if (!getByTitle("แหล่งจับ")) {
    form.addListItem().setTitle("แหล่งจับ").setRequired(true)
      .setChoiceValues(["หลีเป๊ะ", "ภูเก็ต", "กระบี่", "สตูล", "ตรัง", "ระนอง", "สุราษฎร์ธานี", "อื่นๆ"]);
  }
  if (!getByTitle("วันที่จับ – วัน")) {
    var days = [];
    for (var d = 1; d <= 31; d++) days.push(String(d));
    form.addListItem().setTitle("วันที่จับ – วัน").setRequired(true).setChoiceValues(days);
  }
  if (!getByTitle("วันที่จับ – เดือน")) {
    form.addListItem().setTitle("วันที่จับ – เดือน").setRequired(true)
      .setChoiceValues(["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]);
  }

  // จัดลำดับให้ตรงกับ Sheet columns: B C D E F G H I
  var order = [
    "ชื่อปลา",
    "รหัสตัว",
    "น้ำหนัก (กก.)",
    "แหล่งจับ",
    "หมายเหตุ",
    "วันที่จับ – วัน",
    "วันที่จับ – เดือน",
    "แนบรูป"
  ];
  order.forEach(function(title, targetPos) {
    var items = form.getItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i].getTitle() === title) {
        if (items[i].getIndex() !== targetPos) {
          try { form.moveItem(items[i].getIndex(), targetPos); } catch(e) {}
        }
        break;
      }
    }
  });

  SpreadsheetApp.getUi().alert(
    "✅ กู้คืน Form เรียบร้อยแล้วค่ะ\n" +
    "Sheet จะมี column ใหม่เพิ่มมา — ปกติค่ะ ระบบรับมือไว้แล้ว"
  );
}

// รันครั้งเดียวจาก Apps Script Editor เพื่ออัปเดต Google Form
// Run > setupFishTypeQuestion
function setupFishTypeQuestion() {
  var FORM_ID = "1FAIpQLSd"; // placeholder — ดูจาก URL ของ Form ที่ edit

  // ดึง Form ID จริงจาก URL: https://docs.google.com/forms/d/<FORM_ID>/edit
  // แล้วแทนค่า FORM_ID ด้านบน
  var formUrl = "https://forms.gle/oo5p5TmVtR49HijP7";

  // resolve short URL → เปิดด้วย ID ตรง ๆ แทน
  var REAL_FORM_ID = "1E7lftgnlrkU4PpOAkJz5Yjo_aoMvKGlt6CFalQQawiA";
  var form;
  try {
    form = FormApp.openById(REAL_FORM_ID);
  } catch(e) {
    SpreadsheetApp.getUi().alert("กรุณาแทนค่า REAL_FORM_ID ด้วย ID จาก URL ของ Google Form\n\nเปิด Form → ดู URL → คัดลอก ID ยาว ๆ มาใส่");
    return;
  }

  // อ่านชื่อปลาจาก Sheet "ราคาปลา" (ถ้ามี) — ไม่ต้อง hardcode อีกต่อไป
  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var priceSheet = ss.getSheetByName("ราคาปลา");
  var choices;

  if (priceSheet) {
    var rows = priceSheet.getDataRange().getValues().slice(1);
    choices = rows
      .filter(function(r) { return r[0] && r[2]; })
      .map(function(r) {
        var thaiName = r[0].toString().trim();
        var engName  = (r[4] || "").toString().trim();
        if (!engName) engName = FISH_ENGLISH[thaiName] || "";
        return engName ? thaiName + "/" + engName : thaiName;
      });
  } else {
    // fallback hardcode ถ้ายังไม่ได้รัน setupPriceSheet
    choices = Object.keys(FISH_PRICES).map(function(name) {
      var eng = FISH_ENGLISH[name] || "";
      return eng ? name + "/" + eng : name;
    });
  }

  // หา list items ที่มีอยู่แล้วทั้งหมด
  var existing = form.getItems(FormApp.ItemType.LIST);

  if (existing.length > 0) {
    // อัปเดต choices ในข้อแรก — Sheets จะ reuse column เดิม ไม่สร้างใหม่
    existing[0].asListItem().setTitle("ชื่อปลา").setRequired(true).setChoiceValues(choices);
    form.moveItem(existing[0].getIndex(), 0);
    // ลบ duplicates ที่เหลือ (วน backwards เพื่อ index ไม่เลื่อน)
    for (var i = existing.length - 1; i >= 1; i--) {
      form.deleteItem(existing[i]);
    }
  } else {
    // ยังไม่มีเลย — สร้างใหม่ครั้งเดียว
    var listItem = form.addListItem();
    listItem.setTitle("ชื่อปลา").setRequired(true).setChoiceValues(choices);
    form.moveItem(listItem.getIndex(), 0);
  }

  SpreadsheetApp.getUi().alert("✅ อัปเดต Google Form เรียบร้อยแล้วค่ะ\nเพิ่ม dropdown ชื่อปลา " + choices.length + " ชนิด");
}
