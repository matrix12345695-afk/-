(function(){
  "use strict";
  const button=document.getElementById("downloadClean");
  const exporter=window.InvoiceGuardCleanExport;
  if(!button||!exporter)return;
  button.addEventListener("click",event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    const csv=exporter.serialize(typeof currentRows!=="undefined"?currentRows:[]);
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");
    a.href=url;
    a.download="invoiceguard-clean-invoices.csv";
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),0);
  },true);
})();
