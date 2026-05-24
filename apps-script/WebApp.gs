// ============================================================
//  APO — Web App API
// ============================================================
// Deploy: Apps Script → Deploy → Manage Deployments → New version
// ตั้ง Access: Anyone (even anonymous)

function doGet(e) {
  var ss    = SpreadsheetApp.openById("1681oFVd80odwKx_9mx5aG4-NOVLGIC7Sxu4RmwMr3mA");
  var sheet = ss.getSheetByName("Stock ที่จะขายให้ลูกค้า");
  if (!sheet) return jsonOut([]);

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOut([]);

  // col index (0-based): A=0 B=1 C=2 D=3 E=4 F=5 G=6 H=7 I=8 J=9 K=10 L=11
  var rows = data.slice(1)
    .filter(function(r) { return (r[9] || "") === "พร้อมขาย"; })
    .map(function(r) {
      return {
        name:     (r[0]  || "").toString(),
        code:     (r[1]  || "").toString(),
        weight:   r[2]   || 0,
        source:   (r[3]  || "").toString(),
        date:     (r[4]  || "").toString(),
        priceKg:  r[5]   || 0,
        total:    r[6]   || 0,
        image:    (r[7]  || "").toString(),
        category: (r[10] || "ปลา").toString(),
        unit:     (r[11] || "kg").toString()
      };
    });

  return jsonOut(rows);
}

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
