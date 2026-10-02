const assert=require('node:assert/strict');
const {build}=require('../duplicate-context.js');
const norm=s=>String(s||'').normalize('NFKC').trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const key=(vendor,no)=>norm(vendor)+'|'+norm(no);

const rows=[
  {_row:2,vendor:'Acme Ltd',invoice_number:'INV-101',date:'2026-09-01',total:1100,currency:'usd'},
  {_row:5,vendor:' ACME LTD ',invoice_number:'inv 101',date:'2026-09-02',total:1100,currency:'USD'},
  {_row:8,vendor:'North Star',invoice_number:'NS-9',date:'2026-09-03',total:500,currency:'EUR'},
];
const prior={
  [key('North Star','NS-9')]:{vendor:'North Star',no:'NS-9',date:'2026-08-20',total:500,currency:'eur'},
};
const ctx=build(rows,prior,key);
assert.equal(ctx.get(5).kind,'same-file');
assert.equal(ctx.get(5).firstOccurrence.row,2);
assert.equal(ctx.get(5).currentOccurrence.row,5);
assert.equal(ctx.get(2).currentOccurrence.row,5,'first row should point to the later occurrence that triggered the duplicate');
assert.equal(ctx.get(8).kind,'previous-audit');
assert.equal(ctx.get(8).previousAudit.date,'2026-08-20');
assert.equal(ctx.get(8).previousAudit.currency,'EUR');
assert.equal(ctx.get(8).currentOccurrence.row,8);
assert.equal(ctx.has(undefined),false);

const separate=build([
  {_row:2,vendor:'Vendor A',invoice_number:'100'},
  {_row:3,vendor:'Vendor B',invoice_number:'100'},
],{},key);
assert.equal(separate.size,0,'same invoice number at different vendors must not be treated as duplicate evidence');
console.log('duplicate context regression tests passed');
