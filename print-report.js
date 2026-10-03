(()=>{
  const labels={
    en:'Print accountant report',
    ru:'Печать отчёта для бухгалтера',
    uz:'Buxgalter hisobotini chop etish',
    es:'Imprimir informe contable',
    de:'Buchhaltungsbericht drucken',
    fr:'Imprimer le rapport comptable',
    pt:'Imprimir relatório contábil'
  };

  function currentLang(){
    return (window.invoiceGuardI18n&&window.invoiceGuardI18n.lang)||'en';
  }

  function refreshLabel(button){
    const lang=currentLang();
    button.textContent=labels[lang]||labels.en;
    button.setAttribute('aria-label',labels[lang]||labels.en);
  }

  function mount(){
    const actions=document.querySelector('.export-actions');
    if(!actions||document.getElementById('printReport'))return;
    const button=document.createElement('button');
    button.id='printReport';
    button.type='button';
    button.className='secondary print-report-button';
    refreshLabel(button);
    button.addEventListener('click',()=>window.print());
    actions.prepend(button);
    document.addEventListener('invoiceguard:language',()=>refreshLabel(button));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
  else mount();
})();