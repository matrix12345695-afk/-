const assert=require("node:assert/strict");
require("../number-core.js");
const clean=require("../clean-export.js");

assert.deepEqual(clean.headers,["invoice_number","vendor","date","subtotal","tax","total","currency"]);
const csv=clean.serialize([{invoice_number:"INV-1",vendor:'Café "North"',date:"2026-10-03",subtotal:"1 000,50",tax:"100,05",total:"1100,55",currency:"EUR"}]);
assert.ok(csv.startsWith("\uFEFFinvoice_number,vendor,date,subtotal,tax,total,currency\r\n"),"UTF-8 BOM and stable machine headers are required");
assert.ok(csv.endsWith("\r\n"),"Excel-friendly CRLF output should end with a record separator");
assert.ok(csv.includes('"Café ""North"""'),"quotes and Unicode must survive export");
assert.ok(csv.includes('"1 000,50"'),"localized accounting text must remain a single CSV cell");

for(const dangerous of [
  "=2+2",
  " +SUM(A1:A2)",
  "@cmd",
  '-HYPERLINK("x")',
  "-1+CMD()",
  "-1*2",
  "-1/0",
  '-1+HYPERLINK("x")',
  " -1+CMD()",
  "\u00a0-1+CMD()",
  "\t-1+CMD()"
]){
  assert.equal(clean.safeCell(dangerous),"'"+dangerous,"formula-like cell should be neutralized: "+dangerous);
}
for(const safe of [
  "-125.50",
  "-1 234,50",
  "-1,234.50",
  "-1.234,50",
  "-1'234.50",
  " -125.50",
  "INV-001",
  "Acme + Co"
]){
  assert.equal(clean.safeCell(safe),safe,"valid negative amount or ordinary text should remain unchanged: "+safe);
}

const injected=clean.serialize([{invoice_number:"-1+CMD()",vendor:"Acme",date:"2026-10-03",subtotal:"-125.50",tax:"0",total:"-125.50",currency:"USD"}]);
assert.ok(injected.includes('"\'-1+CMD()"'),"serialized CSV must neutralize a formula-like invoice identifier");
assert.ok(injected.includes('"-125.50"'),"valid negative amounts must remain numeric-looking text");

console.log("clean-export formula-injection regression tests passed");
