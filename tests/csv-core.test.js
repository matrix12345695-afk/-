const assert=require("node:assert/strict");
const {parse,detectDelimiter}=require("../csv-core.js");

function test(name,fn){try{fn();console.log("✓",name)}catch(err){console.error("✗",name);throw err}}

test("strips UTF-8 BOM",()=>{
  const out=parse("\uFEFFinvoice_number,vendor,total\n1,Acme,12.50");
  assert.deepEqual(out.header,["invoice_number","vendor","total"]);
});

test("detects semicolon delimiter",()=>{
  const csv="invoice_number;vendor;total\n1;Acme;12,50\n2;Beta;10,00";
  assert.equal(detectDelimiter(csv),";");
  assert.equal(parse(csv).rows[0].cells[2],"12,50");
});

test("detects tab delimiter",()=>{
  const csv="invoice_number\tvendor\ttotal\n1\tAcme\t12.50";
  assert.equal(parse(csv).delimiter,"\t");
});

test("preserves multiline quoted cells",()=>{
  const out=parse('invoice_number,vendor,note,total\n1,Acme,"first line\nsecond line",12.50');
  assert.equal(out.rows.length,1);
  assert.equal(out.rows[0].cells[2],"first line\nsecond line");
});

test("preserves embedded delimiters and escaped quotes",()=>{
  const out=parse('invoice_number,vendor,note,total\n1,Acme,"hello, ""team""",12.50');
  assert.equal(out.rows[0].cells[2],'hello, "team"');
});

test("rejects unclosed quotes",()=>{
  assert.throws(()=>parse('a,b\n1,"broken'),err=>err.code==="UNCLOSED_QUOTE");
});

test("rejects unclosed quotes in semicolon CSV",()=>{
  assert.throws(()=>parse('a;b\n1;"broken'),err=>err.code==="UNCLOSED_QUOTE");
});

test("rejects row width mismatch instead of shifting columns",()=>{
  assert.throws(()=>parse("a,b,c\n1,2\n3,4,5"),err=>err.code==="ROW_WIDTH_MISMATCH"&&err.line===2);
});

console.log("CSV core regression tests passed.");
