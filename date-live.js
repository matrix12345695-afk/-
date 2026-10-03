(function(root){
  'use strict';

  const core=root.InvoiceGuardDateCore;
  const originalAudit=root.audit;
  if(!core||typeof originalAudit!=="function")return;

  root.audit=function(rows){
    const findings=originalAudit(rows).filter(f=>f.msgKey!=="missingDate"&&f.msgKey!=="invalidDate"&&f.msgKey!=="futureDate");
    (rows||[]).forEach(row=>{
      const classified=core.classifyInvoiceDate(row.date);
      if(classified.status==='ok')return;
      const total=num(row.total);
      findings.push({
        row:row._row,
        no:(row.invoice_number||'').trim()||'—',
        vendor:(row.vendor||'').trim()||'—',
        date:row.date||'',
        severity:'Medium',
        msgKey:classified.status==='missing'?'missingDate':classified.status==='future'?'futureDate':'invalidDate',
        msgParams:{},
        total:Number.isFinite(total)?total:0,
        currency:row.currency||''
      });
    });
    return findings;
  };
})(typeof globalThis!=="undefined"?globalThis:this);
