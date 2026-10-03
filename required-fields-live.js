(function(){
  const core=window.InvoiceGuardRequiredFields;if(!core)return;
  const copy={
    en:{title:'Required fields',invoice_number:'Invoice number',vendor:'Vendor',date:'Invoice date',currency:'Currency'},
    ru:{title:'Обязательные поля',invoice_number:'Номер счёта',vendor:'Поставщик',date:'Дата счёта',currency:'Валюта'},
    uz:{title:'Majburiy maydonlar',invoice_number:'Hisob raqami',vendor:'Yetkazib beruvchi',date:'Hisob sanasi',currency:'Valyuta'},
    es:{title:'Campos obligatorios',invoice_number:'Número de factura',vendor:'Proveedor',date:'Fecha de factura',currency:'Moneda'},
    de:{title:'Pflichtfelder',invoice_number:'Rechnungsnummer',vendor:'Lieferant',date:'Rechnungsdatum',currency:'Währung'},
    fr:{title:'Champs obligatoires',invoice_number:'Numéro de facture',vendor:'Fournisseur',date:'Date de facture',currency:'Devise'},
    pt:{title:'Campos obrigatórios',invoice_number:'Número da fatura',vendor:'Fornecedor',date:'Data da fatura',currency:'Moeda'}
  };
  const readSaved=()=>{try{return JSON.parse(localStorage.getItem('invoiceguard_rules')||'{}').requiredFields}catch{return undefined}};
  const selected=()=>core.SUPPORTED.filter(f=>document.querySelector(`[data-required-field="${f}"]`)?.checked);
  function sync(){
    const fields=core.normalizeRequiredFields(readSaved());
    core.SUPPORTED.forEach(f=>{const el=document.querySelector(`[data-required-field="${f}"]`);if(el)el.checked=fields.includes(f)});
  }
  function localize(){const l=window.invoiceGuardI18n?.lang||'en',d=copy[l]||copy.en;const t=document.getElementById('requiredFieldsTitle');if(t)t.textContent=d.title;core.SUPPORTED.forEach(f=>{const el=document.querySelector(`[data-required-label="${f}"]`);if(el)el.textContent=d[f]})}
  if(typeof window.audit==='function'){
    const base=window.audit;
    window.audit=function(rows){return core.filterMissingFindings(base(rows),rules.requiredFields)};
  }
  rules.requiredFields=core.normalizeRequiredFields(readSaved());
  document.getElementById('applyRules')?.addEventListener('click',()=>{
    rules.requiredFields=selected();
    localStorage.setItem('invoiceguard_rules',JSON.stringify(rules));
    if(currentRows.length){current=audit(currentRows);document.getElementById('issues').textContent=current.length;document.getElementById('risk').textContent=riskText(current);renderFindings()}
  });
  document.getElementById('language')?.addEventListener('change',()=>setTimeout(localize,0));
  sync();localize();
})();
