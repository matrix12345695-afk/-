// Load after app.js so existing audit logic resolves hardened helpers at call time.
if(window.InvoiceGuardNumbers?.parseAccountingNumber){
  num=window.InvoiceGuardNumbers.parseAccountingNumber;
}

// Load duplicate evidence without changing the stable script order in index.html.
// The audit wrapper attaches deterministic same-file / previous-audit evidence
// to duplicate findings; rendering/export can consume it without recomputing matches.
(function(){
  function wire(){
    const core=window.InvoiceGuardDuplicateContext;
    if(!core||typeof audit!=="function"||audit.__duplicateEvidenceWired)return;
    const original=audit;
    const wrapped=function(rows){
      const findings=original(rows);
      let prior={};
      try{prior=JSON.parse(localStorage.getItem("invoiceguard_history")||"{}")}catch{}
      const evidence=core.build(rows,prior,duplicateKey);
      findings.forEach(f=>{
        if(f.msgKey!=="duplicate"&&f.msgKey!=="pastDuplicate")return;
        const context=evidence.get(f.row);
        if(context)f.duplicateContext=context;
      });
      return findings;
    };
    wrapped.__duplicateEvidenceWired=true;
    audit=wrapped;
  }
  if(window.InvoiceGuardDuplicateContext){wire();return;}
  const script=document.createElement("script");
  script.src="duplicate-context.js";
  script.onload=wire;
  document.head.appendChild(script);
})();
