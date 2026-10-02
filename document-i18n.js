(()=>{
const copy={
 en:{title:'InvoiceGuard — Catch invoice mistakes before payment',description:'InvoiceGuard checks invoice exports for duplicates, missing fields and suspicious totals before you pay.'},
 ru:{title:'InvoiceGuard — Найдите ошибки в счетах до оплаты',description:'InvoiceGuard проверяет выгрузки счетов на дубли, пропущенные поля и подозрительные суммы до оплаты.'},
 uz:{title:"InvoiceGuard — Hisob xatolarini to‘lovdan oldin toping",description:"InvoiceGuard hisob eksportlarini dublikatlar, yetishmayotgan maydonlar va shubhali summalar bo‘yicha to‘lovdan oldin tekshiradi."},
 es:{title:'InvoiceGuard — Detecta errores en facturas antes de pagar',description:'InvoiceGuard revisa exportaciones de facturas para detectar duplicados, campos ausentes y totales sospechosos antes de pagar.'},
 de:{title:'InvoiceGuard — Rechnungsfehler vor der Zahlung finden',description:'InvoiceGuard prüft Rechnungsexporte vor der Zahlung auf Duplikate, fehlende Felder und auffällige Summen.'},
 fr:{title:'InvoiceGuard — Détectez les erreurs de facture avant paiement',description:'InvoiceGuard vérifie les exports de factures avant paiement pour détecter les doublons, champs manquants et totaux suspects.'},
 pt:{title:'InvoiceGuard — Encontre erros em faturas antes de pagar',description:'O InvoiceGuard verifica exportações de faturas antes do pagamento para detectar duplicatas, campos ausentes e totais suspeitos.'}
};
function apply(){
 const lang=window.invoiceGuardI18n?.lang||document.documentElement.lang||'en';
 const t=copy[lang]||copy.en;
 document.title=t.title;
 const meta=document.querySelector('meta[name="description"]');
 if(meta)meta.setAttribute('content',t.description);
}
document.addEventListener('invoiceguard:language',apply);
document.addEventListener('DOMContentLoaded',apply);
})();
