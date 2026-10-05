(()=>{
  const i18n=window.invoiceGuardI18n;
  if(!i18n?.dict)return;
  const copy={
    en:'Private browser audit',
    ru:'Приватная проверка в браузере',
    uz:'Brauzerda maxfiy tekshiruv',
    es:'Auditoría privada en el navegador',
    de:'Private Prüfung im Browser',
    fr:'Audit privé dans le navigateur',
    pt:'Auditoria privada no navegador'
  };
  for(const [lang,text] of Object.entries(copy)){
    if(i18n.dict[lang]) i18n.dict[lang].free=text;
  }
})();
