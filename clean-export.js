(function(root,factory){
  const api=factory(root && root.InvoiceGuardNumbers);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.InvoiceGuardCleanExport=api;
})(typeof window!=="undefined"?window:globalThis,function(numbers){
  "use strict";
  const headers=["invoice_number","vendor","date","subtotal","tax","total","currency"];
  const formulaPrefix=/^[\s\uFEFF]*[=+@]/u;
  const fallbackNegativeNumber=/^-\s*\d+(?:[.,]\d+)?$/u;

  function isNegativeNumericLiteral(value){
    const parse=numbers && numbers.parseAccountingNumber;
    if(typeof parse==="function")return Number.isFinite(parse(value));
    // If the accounting parser is not loaded, allow only a deliberately narrow
    // decimal form. Failing closed is safer than exporting a formula-like cell.
    return fallbackNegativeNumber.test(value);
  }

  function safeCell(value){
    const text=String(value??"");
    const leading=text.trimStart();
    const negativeExpression=leading.startsWith("-")&&!isNegativeNumericLiteral(leading);
    return formulaPrefix.test(text)||negativeExpression?"'"+text:text;
  }
  function quote(value){return '"'+safeCell(value).replaceAll('"','""')+'"'}
  function serialize(rows){
    const lines=[headers.join(","),...(rows||[]).map(row=>headers.map(key=>quote(row?.[key]??"")).join(","))];
    return "\uFEFF"+lines.join("\r\n")+"\r\n";
  }
  return Object.freeze({headers:[...headers],safeCell,serialize});
});
