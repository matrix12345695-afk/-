(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.InvoiceGuardCleanExport=api;
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const headers=["invoice_number","vendor","date","subtotal","tax","total","currency"];
  const formulaPrefix=/^[\t\r\n ]*[=+@]/;
  const minusFormula=/^[\t\r\n ]*-[^0-9.,\s]/;

  function safeCell(value){
    const text=String(value??"");
    return formulaPrefix.test(text)||minusFormula.test(text)?"'"+text:text;
  }
  function quote(value){return '"'+safeCell(value).replaceAll('"','""')+'"'}
  function serialize(rows){
    const lines=[headers.join(","),...(rows||[]).map(row=>headers.map(key=>quote(row?.[key]??"")).join(","))];
    return "\uFEFF"+lines.join("\r\n")+"\r\n";
  }
  return Object.freeze({headers:[...headers],safeCell,serialize});
});
