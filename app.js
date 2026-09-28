const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Math.max(0,n||0));
function update(){
  const hours=+$("hours").value||0, rate=+$("rate").value||0, buffer=+$("buffer").value||0, tax=+$("tax").value||0;
  const base=hours*rate, bufferAmount=base*(buffer/100), quote=base+bufferAmount, taxAmount=quote*(tax/100), takeHome=quote-taxAmount;
  $("base").textContent=money(base); $("bufferValue").textContent=money(bufferAmount); $("quote").textContent=money(quote); $("taxValue").textContent=money(taxAmount); $("takeHome").textContent=money(takeHome);
  return {hours,rate,buffer,tax,base,bufferAmount,quote,taxAmount,takeHome};
}
["hours","rate","buffer","tax","project"].forEach(id=>$(id).addEventListener("input",update));
$("copyQuote").addEventListener("click",async()=>{
  const v=update(), project=$("project").value.trim()||"Project";
  const quoteText=project+"\n\nEstimated scope: "+v.hours+" hours\nProject quote: "+money(v.quote)+"\n\nThis price includes a "+v.buffer+"% delivery/risk buffer and is based on a target rate of "+money(v.rate)+"/hour.";
  try{await navigator.clipboard.writeText(quoteText);$("copyStatus").textContent="Copied. Ready to paste into email or chat."}catch{$("copyStatus").textContent="Copy is unavailable in this browser."}
});
$("year").textContent=new Date().getFullYear(); update();