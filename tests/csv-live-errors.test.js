const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const {parse}=require("../csv-core.js");

const source=fs.readFileSync("csv-live.js","utf8");
const languages={
  en:["A quote appears","Unexpected text follows"],
  ru:["Кавычка внутри","После закрывающей кавычки"],
  uz:["qo‘shtirnoqsiz maydon","yopuvchi qo‘shtirnoqdan keyin"],
  es:["Hay una comilla","Hay texto inesperado"],
  de:["nicht zitierten CSV-Feld","unerwarteter Text"],
  fr:["Un guillemet apparaît","Un texte inattendu"],
  pt:["Há uma aspa dentro","Há texto inesperado"]
};
const malformed=[
  'a,b\n1,broken"quote',
  'a,b\n1,"Acme"x'
];

for(const [lang,expected] of Object.entries(languages)){
  for(let i=0;i<malformed.length;i++){
    let message="",state="";
    const window={
      InvoiceGuardCSV:{parse},
      invoiceGuardAuditState:{set(value){state=value;}},
      invoiceGuardI18n:{lang}
    };
    const context={
      window,
      alert(value){message=String(value);},
      $(){return {textContent:""};},
      canonical:value=>value,
      showUnknown(){}
    };
    vm.runInNewContext(source,context);
    assert.equal(window.parseCSV(malformed[i]).length,0);
    assert.equal(state,"error",lang+" must move the audit state to error");
    assert.ok(message.includes("2"),lang+" must include the physical CSV line");
    assert.ok(message.includes(expected[i]),lang+" must show a localized quote error");
  }
}

console.log("Localized malformed-quote messages pass in EN/RU/UZ/ES/DE/FR/PT.");
