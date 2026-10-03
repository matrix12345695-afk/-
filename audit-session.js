(()=>{
function hash(value){let h=2166136261;for(const ch of String(value)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(36).toUpperCase().padStart(7,"0")}
function start(source){const at=new Date().toISOString(),root=document.documentElement;if(!root?.dataset)return;root.dataset.auditTimestamp=at;root.dataset.auditSession=`IG-${at.replace(/[-:.]/g,"").replace("T","").replace("Z","").slice(0,14)}-${hash(source+"|"+at)}`}
document.getElementById("file")?.addEventListener("change",e=>{const file=e.target?.files?.[0];if(file)start(file.name)});
document.getElementById("demo")?.addEventListener("click",()=>start("InvoiceGuard sample audit"));
window.InvoiceGuardAuditSession={start,hash};
})();
