// Load after app.js so existing audit logic resolves hardened helpers at call time.
if(window.InvoiceGuardNumbers?.parseAccountingNumber){
  num=window.InvoiceGuardNumbers.parseAccountingNumber;
}

// Load duplicate evidence without changing the stable script order in index.html.
// The audit wrapper attaches deterministic same-file / previous-audit evidence
// to duplicate findings. Evidence is also folded into the localized finding text,
// so the on-screen table and existing exports stay consistent without recomputing matches.
(function(){
  const evidenceLabels={
    en:{first:"first row",current:"current row",previous:"previous audit",date:"date",amount:"amount"},
    ru:{first:"первая строка",current:"текущая строка",previous:"предыдущая проверка",date:"дата",amount:"сумма"},
    uz:{first:"birinchi qator",current:"joriy qator",previous:"oldingi tekshiruv",date:"sana",amount:"summa"},
    es:{first:"primera fila",current:"fila actual",previous:"auditoría anterior",date:"fecha",amount:"importe"},
    de:{first:"erste Zeile",current:"aktuelle Zeile",previous:"frühere Prüfung",date:"Datum",amount:"Betrag"},
    fr:{first:"première ligne",current:"ligne actuelle",previous:"audit précédent",date:"date",amount:"montant"},
    pt:{first:"primeira linha",current:"linha atual",previous:"auditoria anterior",date:"data",amount:"valor"}
  };
  function evidenceText(context){
    if(!context)return "";
    const labels=evidenceLabels[lang()]||evidenceLabels.en;
    if(context.kind==="same-file"&&context.firstOccurrence&&context.currentOccurrence){
      return `${labels.first} ${context.firstOccurrence.row}; ${labels.current} ${context.currentOccurrence.row}`;
    }
    const p=context.previousAudit;
    if(p){
      const details=[];
      if(p.date)details.push(`${labels.date} ${p.date}`);
      if(p.total||p.currency)details.push(`${labels.amount} ${[p.currency,p.total].filter(Boolean).join(" ")}`);
      return `${labels.previous}${details.length?`: ${details.join(", ")}`:""}`;
    }
    return "";
  }
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
        if(context){
          f.duplicateContext=context;
          f.msgParams={...(f.msgParams||{}),duplicateEvidence:evidenceText(context)};
        }
      });
      return findings;
    };
    wrapped.__duplicateEvidenceWired=true;
    audit=wrapped;

    if(typeof dt==="function"&&!dt.__duplicateEvidenceWired){
      const originalDt=dt;
      const localized=function(key,params={}){
        const base=originalDt(key,params);
        return (key==="duplicate"||key==="pastDuplicate")&&params.duplicateEvidence
          ? `${base} (${params.duplicateEvidence})`
          : base;
      };
      localized.__duplicateEvidenceWired=true;
      dt=localized;
    }
  }
  if(window.InvoiceGuardDuplicateContext){wire();return;}
  const script=document.createElement("script");
  script.src="duplicate-context.js";
  script.onload=wire;
  document.head.appendChild(script);
})();
