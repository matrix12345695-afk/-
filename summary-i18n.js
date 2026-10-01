(()=>{
const copy={
en:{title:"INVOICEGUARD AUDIT SUMMARY",generated:"Generated",reviewed:"Invoices reviewed",findings:"Findings",attention:"Invoices requiring attention",risk:"At-risk value",high:"HIGH-SEVERITY FINDINGS",row:"Row",none:"No high-severity findings."},
ru:{title:"СВОДКА АУДИТА INVOICEGUARD",generated:"Сформировано",reviewed:"Проверено счетов",findings:"Замечания",attention:"Счета, требующие внимания",risk:"Сумма под риском",high:"КРИТИЧЕСКИЕ ЗАМЕЧАНИЯ",row:"Строка",none:"Критических замечаний нет."},
uz:{title:"INVOICEGUARD AUDIT XULOSASI",generated:"Yaratildi",reviewed:"Tekshirilgan hisoblar",findings:"Topilmalar",attention:"E’tibor talab qiladigan hisoblar",risk:"Xavf ostidagi qiymat",high:"YUQORI DARAJALI TOPILMALAR",row:"Qator",none:"Yuqori darajali topilmalar yo‘q."},
es:{title:"RESUMEN DE AUDITORÍA INVOICEGUARD",generated:"Generado",reviewed:"Facturas revisadas",findings:"Hallazgos",attention:"Facturas que requieren atención",risk:"Valor en riesgo",high:"HALLAZGOS DE ALTA SEVERIDAD",row:"Fila",none:"No hay hallazgos de alta severidad."},
de:{title:"INVOICEGUARD PRÜFZUSAMMENFASSUNG",generated:"Erstellt",reviewed:"Geprüfte Rechnungen",findings:"Feststellungen",attention:"Rechnungen mit Handlungsbedarf",risk:"Gefährdeter Wert",high:"FESTSTELLUNGEN MIT HOHER SCHWERE",row:"Zeile",none:"Keine Feststellungen mit hoher Schwere."},
fr:{title:"RÉSUMÉ D’AUDIT INVOICEGUARD",generated:"Généré",reviewed:"Factures examinées",findings:"Constats",attention:"Factures nécessitant une attention",risk:"Valeur à risque",high:"CONSTATS DE SÉVÉRITÉ ÉLEVÉE",row:"Ligne",none:"Aucun constat de sévérité élevée."},
pt:{title:"RESUMO DE AUDITORIA INVOICEGUARD",generated:"Gerado",reviewed:"Faturas revisadas",findings:"Achados",attention:"Faturas que exigem atenção",risk:"Valor em risco",high:"ACHADOS DE ALTA SEVERIDADE",row:"Linha",none:"Nenhum achado de alta severidade."}
};
const locale={en:"en-US",ru:"ru-RU",uz:"uz-UZ",es:"es-ES",de:"de-DE",fr:"fr-FR",pt:"pt-PT"};
function activeLang(){return window.invoiceGuardI18n?.lang||document.getElementById("language")?.value||"en"}
function downloadSummary(e){
 e.preventDefault();e.stopImmediatePropagation();
 const l=activeLang(),t=copy[l]||copy.en;
 const rows=[...document.querySelectorAll("#findings tr")].map(tr=>[...tr.cells].map(td=>td.textContent.trim())).filter(r=>r.length>=6);
 const highRows=rows.filter(r=>document.querySelectorAll("#findings tr")[rows.indexOf(r)]?.querySelector(".sev-high"));
 const attention=new Set(highRows.map(r=>r[0]+"|"+r[1]+"|"+r[2])).size;
 const count=document.getElementById("count")?.textContent?.trim()||"0";
 const issues=document.getElementById("issues")?.textContent?.trim()||"0";
 const risk=document.getElementById("risk")?.textContent?.trim()||"0";
 const lines=[t.title,`${t.generated}: ${new Date().toLocaleString(locale[l]||l)}`,`${t.reviewed}: ${count}`,`${t.findings}: ${issues}`,`${t.attention}: ${attention}`,`${t.risk}: ${risk}`,"",t.high,...(highRows.length?highRows.map(r=>`${t.row} ${r[0]} | ${r[2]} | ${r[1]} | ${r[4]} | ${r[5]}`):[t.none])];
 const blob=new Blob(["\uFEFF"+lines.join("\n")],{type:"text/plain;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`invoiceguard-audit-summary-${l}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),0);
}
document.getElementById("downloadSummary")?.addEventListener("click",downloadSummary,true);
})();
