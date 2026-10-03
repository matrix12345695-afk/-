(()=>{
  "use strict";
  const unknownCurrency={
    en:"Unknown currency",
    ru:"Неизвестная валюта",
    uz:"Noma’lum valyuta",
    es:"Moneda desconocida",
    de:"Unbekannte Währung",
    fr:"Devise inconnue",
    pt:"Moeda desconhecida"
  };
  const activeLang=()=>window.invoiceGuardI18n?.lang||document.getElementById("language")?.value||"en";
  window.riskText=function(findings){
    const seen=new Set(),totals={};
    findings.filter(x=>x.severity==="High").forEach(x=>{
      const key=[x.row,x.no,x.vendor].join("|");
      if(seen.has(key))return;
      seen.add(key);
      const raw=String(x.currency||"").trim().toUpperCase();
      const currencyKey=raw||"__UNKNOWN__";
      totals[currencyKey]=(totals[currencyKey]||0)+(Number.isFinite(x.total)?x.total:0);
    });
    const entries=Object.entries(totals).filter(([,value])=>value!==0);
    if(!entries.length)return "0";
    const lang=activeLang(),unknown=unknownCurrency[lang]||unknownCurrency.en;
    return entries.map(([currency,value])=>{
      const label=currency==="__UNKNOWN__"?unknown:currency;
      return label+" "+new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(value);
    }).join(" · ");
  };
})();
