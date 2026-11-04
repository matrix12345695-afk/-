(function(){
  "use strict";
  const button=document.getElementById("downloadClean");
  const exporter=window.InvoiceGuardCleanExport;
  if(!button||!exporter)return;
  button.addEventListener("click",event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    const csv=exporter.serialize(typeof currentRows!=="undefined"?currentRows:[]);
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    window.InvoiceGuardDownload.downloadBlob(blob,"invoiceguard-clean-invoices.csv");
  },true);
})();
