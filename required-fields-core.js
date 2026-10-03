(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.InvoiceGuardRequiredFields=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const SUPPORTED=['invoice_number','vendor','date','currency'];
  const DEFAULTS=['invoice_number','vendor','date','currency'];
  const MISSING_KEYS={invoice_number:'missingNo',vendor:'missingVendor',date:'missingDate',currency:'missingCurrency'};
  function normalizeRequiredFields(value){
    if(!Array.isArray(value))return DEFAULTS.slice();
    return [...new Set(value.filter(x=>SUPPORTED.includes(x)))];
  }
  function isRequired(field,value){return normalizeRequiredFields(value).includes(field)}
  function filterMissingFindings(findings,value){
    const required=new Set(normalizeRequiredFields(value));
    const allowedKeys=new Set([...required].map(x=>MISSING_KEYS[x]));
    const allMissing=new Set(Object.values(MISSING_KEYS));
    return (findings||[]).filter(f=>!allMissing.has(f.msgKey)||allowedKeys.has(f.msgKey));
  }
  return {SUPPORTED,DEFAULTS,MISSING_KEYS,normalizeRequiredFields,isRequired,filterMissingFindings};
});
