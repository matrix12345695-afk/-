(function(root){
  'use strict';

  const core=root.InvoiceGuardCurrencyCore;
  const originalAudit=root.audit;
  if(!core||typeof originalAudit!=="function")return;

  root.audit=function(rows){
    const normalizedRows=(rows||[]).map(row=>{
      const classified=core.classifyCurrency(row.currency,rules?.allowedCurrencies||[]);
      return classified.currency?{...row,currency:classified.currency}:{...row};
    });

    const findings=originalAudit(normalizedRows).filter(f=>f.msgKey!=="missingCurrency"&&f.msgKey!=="currencyNotAllowed");
    normalizedRows.forEach(row=>{
      const classified=core.classifyCurrency(row.currency,rules?.allowedCurrencies||[]);
      if(classified.status==="ok")return;
      const total=num(row.total);
      findings.push({
        row:row._row,
        no:(row.invoice_number||"").trim()||"—",
        vendor:(row.vendor||"").trim()||"—",
        date:row.date||"",
        severity:"High",
        msgKey:classified.status==="missing"?"missingCurrency":"currencyNotAllowed",
        msgParams:{},
        total:Number.isFinite(total)?total:0,
        currency:classified.currency||String(row.currency||"").trim()
      });
    });
    return findings;
  };
})(typeof globalThis!=="undefined"?globalThis:this);
