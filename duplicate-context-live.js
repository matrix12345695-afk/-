(function(root){
  const core=root.InvoiceGuardDuplicateContext;
  const originalAudit=root.audit;
  if(!core||typeof originalAudit!=="function")return;

  root.audit=function(rows){
    const findings=originalAudit(rows);
    let history={};
    try{history=JSON.parse(localStorage.getItem("invoiceguard_history")||"{}")}catch{}
    const keyFn=typeof root.duplicateKey==="function"?root.duplicateKey:(vendor,no)=>String(vendor||"").trim().toLocaleLowerCase()+"|"+String(no||"").trim().toLocaleLowerCase();
    const evidence=core.build(rows,history,keyFn);
    for(const finding of findings){
      if(finding.msgKey!=="duplicate"&&finding.msgKey!=="pastDuplicate")continue;
      const context=evidence.get(finding.row);
      if(context)finding.duplicateContext=context;
    }
    return findings;
  };
})(typeof globalThis!=="undefined"?globalThis:this);
