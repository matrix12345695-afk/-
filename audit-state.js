(()=>{
const copy={
en:{empty:"Ready for an invoice CSV",emptyBody:"Choose a CSV or run the sample audit. Files are processed locally in this browser.",loading:"Reading invoice data…",success:"Audit complete",successBody:"Review the findings below before approving payment.",error:"Could not audit this file",errorBody:"Check that the file is a valid CSV with a header row, then try again."},
ru:{empty:"Готово к проверке CSV со счетами",emptyBody:"Выберите CSV или запустите пример проверки. Файлы обрабатываются локально в этом браузере.",loading:"Читаем данные счетов…",success:"Проверка завершена",successBody:"Перед оплатой просмотрите найденные замечания ниже.",error:"Не удалось проверить файл",errorBody:"Убедитесь, что это корректный CSV со строкой заголовков, и попробуйте снова."},
uz:{empty:"Hisoblar CSV faylini tekshirishga tayyor",emptyBody:"CSV faylni tanlang yoki namunaviy tekshiruvni ishga tushiring. Fayllar shu brauzerda lokal qayta ishlanadi.",loading:"Hisob ma’lumotlari o‘qilmoqda…",success:"Tekshiruv yakunlandi",successBody:"To‘lovni tasdiqlashdan oldin quyidagi topilmalarni ko‘rib chiqing.",error:"Faylni tekshirib bo‘lmadi",errorBody:"Fayl sarlavha qatoriga ega to‘g‘ri CSV ekanini tekshirib, qayta urinib ko‘ring."},
es:{empty:"Listo para auditar un CSV de facturas",emptyBody:"Elige un CSV o ejecuta la auditoría de ejemplo. Los archivos se procesan localmente en este navegador.",loading:"Leyendo datos de facturas…",success:"Auditoría completada",successBody:"Revisa los hallazgos antes de aprobar el pago.",error:"No se pudo auditar este archivo",errorBody:"Comprueba que sea un CSV válido con una fila de encabezados e inténtalo de nuevo."},
de:{empty:"Bereit für eine Rechnungs-CSV",emptyBody:"CSV auswählen oder Beispielprüfung starten. Dateien werden lokal in diesem Browser verarbeitet.",loading:"Rechnungsdaten werden gelesen…",success:"Prüfung abgeschlossen",successBody:"Prüfen Sie die Feststellungen unten, bevor Sie die Zahlung freigeben.",error:"Diese Datei konnte nicht geprüft werden",errorBody:"Prüfen Sie, ob die Datei eine gültige CSV mit Kopfzeile ist, und versuchen Sie es erneut."},
fr:{empty:"Prêt à auditer un CSV de factures",emptyBody:"Choisissez un CSV ou lancez l’audit d’exemple. Les fichiers sont traités localement dans ce navigateur.",loading:"Lecture des données de facturation…",success:"Audit terminé",successBody:"Examinez les constats ci-dessous avant d’approuver le paiement.",error:"Impossible d’auditer ce fichier",errorBody:"Vérifiez qu’il s’agit d’un CSV valide avec une ligne d’en-tête, puis réessayez."},
pt:{empty:"Pronto para auditar um CSV de faturas",emptyBody:"Escolha um CSV ou execute a auditoria de exemplo. Os arquivos são processados localmente neste navegador.",loading:"Lendo dados das faturas…",success:"Auditoria concluída",successBody:"Revise os achados abaixo antes de aprovar o pagamento.",error:"Não foi possível auditar este arquivo",errorBody:"Verifique se é um CSV válido com uma linha de cabeçalho e tente novamente."}}
};
const box=document.getElementById('auditState'),title=document.getElementById('auditStateTitle'),body=document.getElementById('auditStateBody');
if(!box||!title||!body)return;
const lang=()=>window.invoiceGuardI18n?.lang||localStorage.getItem('invoiceguard_lang')||'en';
let state='empty';
function paint(next=state){state=next;const c=copy[lang()]||copy.en;box.dataset.state=state;box.setAttribute('aria-busy',state==='loading'?'true':'false');title.textContent=c[state]||c.empty;body.textContent=c[state+'Body']||'';}
paint();
const file=document.getElementById('file'),demo=document.getElementById('demo'),results=document.getElementById('results');
file?.addEventListener('change',()=>{if(file.files?.length)paint('loading')},{capture:true});
demo?.addEventListener('click',()=>paint('loading'),{capture:true});
const observer=new MutationObserver(()=>{if(results&&!results.classList.contains('hidden'))paint('success')});
if(results)observer.observe(results,{attributes:true,attributeFilter:['class']});
window.addEventListener('error',()=>{if(state==='loading')paint('error')});
document.getElementById('language')?.addEventListener('change',()=>queueMicrotask(()=>paint()));
window.invoiceGuardAuditState={set:paint};
})();