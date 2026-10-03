const assert=require("node:assert/strict");
const clean=require("../clean-export.js");

assert.deepEqual(clean.headers,["invoice_number","vendor","date","subtotal","tax","total","currency"]);
const csv=clean.serialize([{invoice_number:"INV-1",vendor:'Café "North"',date:"2026-10-03",subtotal:"1 000,50",tax:"100,05",total:"1100,55",currency:"EUR"}]);
assert.ok(csv.startsWith("\uFEFFinvoice_number,vendor,date,subtotal,tax,total,currency\r\n"),"UTF-8 BOM and stable machine headers are required");
assert.ok(csv.endsWith("\r\n"),"Excel-friendly CRLF output should end with a record separator");
assert.ok(csv.includes('"Café ""North"""'),"quotes and Unicode must survive export");
assert.ok(csv.includes('"1 000,50"'),"localized accounting text must remain a single CSV cell");

for(const dangerous of ["=2+2"," +SUM(A1:A2)","@cmd","-HYPERLINK(\"x\")"]){
  assert.equal(clean.safeCell(dangerous),"'"+dangerous,`formula-like cell should be neutralized: ${dangerous}`);
}
for(const safe of ["-125.50","-1 234,50","INV-001","Acme + Co"]){assert.equal(clean.safeCell(safe),safe)}
console.log("clean-export regression tests passed");
