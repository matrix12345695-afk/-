(()=>{
const headers={
 en:["row","invoice","vendor","severity","finding","total","currency"],
 ru:["строка","счёт","поставщик","критичность","замечание","сумма","валюта"],
 uz:["qator","hisob","yetkazib beruvchi","daraja","topilma","jami","valyuta"],
 es:["fila","factura","proveedor","severidad","hallazgo","total","moneda"],
 de:["zeile","rechnung","lieferant","schweregrad","feststellung","gesamt","währung"],
 fr:["ligne","facture","fournisseur","sévérité","constat","total","devise"],
 pt:["linha","fatura","fornecedor","severidade","achado","total","moeda"]
};
const quote=value=>'"'+String(value??"").replaceAll('"','""')+'"';
function activeLang(){return window.invoiceGuardI18n?.lang||document.getElementById("language")?.value||"en"}
function downloadFindings(event){
 event.preventDefault();event.stopImmediatePropagation();
 const lang=activeLang(),head=headers[lang]||headers.en;
 const rows=[...document.querySelectorAll("#findings tr")].map(tr=>[...tr.cells].map(td=>td.textContent.trim())).filter(r=>r.length>=6);
 const body=rows.map(r=>[r[0],r[1],r[2],r[3],r[4],...splitTotal(r[5])]);
 const csv=[head,...body].map(row=>row.map(quote).join(",")).join("\n");
 const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`invoiceguard-findings-${lang}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),0);
}
function splitTotal(value){
 const text=String(value||"").trim();
 const match=text.match(/^([^\s]+)\s+(.*)$/);
 return match?[match[2],match[1]]:[text,""];
}
document.getElementById("download")?.addEventListener("click",downloadFindings,true);
})();
