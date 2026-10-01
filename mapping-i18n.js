(function(){
  "use strict";
  const copy={
    en:{ignore:"Ignore"},ru:{ignore:"Игнорировать"},uz:{ignore:"E’tiborsiz qoldirish"},es:{ignore:"Ignorar"},de:{ignore:"Ignorieren"},fr:{ignore:"Ignorer"},pt:{ignore:"Ignorar"}
  };
  const language=()=>window.invoiceGuardI18n?.lang||"en";
  window.showUnknown=function(raw,h){
    const known=new Set(Object.keys(aliases));
    const unknown=raw.map((name,i)=>({name,key:h[i],norm:normalize(name)})).filter(x=>!known.has(x.key));
    const panel=$("mappingPanel"),fields=$("mappingFields");
    if(!unknown.length){panel.classList.add("hidden");fields.innerHTML="";return;}
    panel.classList.remove("hidden");
    const ignore=(copy[language()]||copy.en).ignore;
    const fieldLabel=window.InvoiceGuardFieldLabel||((key)=>String(key).replaceAll("_"," "));
    const opts='<option value="">'+esc(ignore)+'</option>'+Object.keys(aliases).map(k=>'<option value="'+k+'">'+esc(fieldLabel(k))+'</option>').join("");
    fields.innerHTML=unknown.map(x=>'<label>'+esc(x.name)+'<select data-col="'+esc(x.norm)+'">'+opts+'</select></label>').join("");
  };
})();
