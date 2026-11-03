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
      invoiceGuardI18n:{lang},
      invoiceGuardParserErrorShown:false
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
    assert.equal(window.invoiceGuardParserErrorShown,true,lang+" must mark that a specific parser alert was shown");
    assert.ok(message.includes("2"),lang+" must include the physical CSV line");
    assert.ok(message.includes(expected[i]),lang+" must show a localized quote error");
  }
}

const duplicateHeaderMessages={
  en:"Two or more CSV columns",
  ru:"Два или более столбца CSV",
  uz:"ikki yoki undan ortiq ustun",
  es:"Dos o más columnas CSV",
  de:"Zwei oder mehr CSV-Spalten",
  fr:"Plusieurs colonnes CSV",
  pt:"Duas ou mais colunas CSV"
};
for(const [lang,expected] of Object.entries(duplicateHeaderMessages)){
  let message="",state="";
  const window={
    InvoiceGuardCSV:{parse},
    invoiceGuardAuditState:{set(value){state=value;}},
    invoiceGuardI18n:{lang},
    invoiceGuardParserErrorShown:false
  };
  const context={
    window,
    alert(value){message=String(value);},
    $(){return {textContent:""};},
    canonical:value=>value==="amount_due"?"total":value,
    showUnknown(){}
  };
  vm.runInNewContext(source,context);
  const result=window.parseCSV("invoice_number,vendor,total,amount_due\nINV-1,Acme,100,100");
  assert.equal(result.length,0,lang+" must reject duplicate canonical field mappings");
  assert.equal(state,"error",lang+" must set the audit state to error");
  assert.equal(window.invoiceGuardParserErrorShown,true,lang+" must mark that a specific duplicate-header alert was shown");
  assert.ok(message.includes(expected),lang+" must show a localized duplicate-header error");
  assert.ok(message.includes("1"),lang+" must identify the header row");
}

console.log("Localized malformed-quote and duplicate-header messages pass in EN/RU/UZ/ES/DE/FR/PT.");

{
  let message="",state="";
  const window={
    InvoiceGuardCSV:{parse:()=>({delimiter:",",header:["invoice_number"],rows:[]})},
    invoiceGuardAuditState:{set(value){state=value;}},
    invoiceGuardI18n:{lang:"en"},
    invoiceGuardParserErrorShown:false
  };
  const context={window,alert(value){message=String(value);},$(){return {textContent:""};},canonical:value=>value,showUnknown(){}};
  vm.runInNewContext(source,context);
  assert.equal(window.parseCSV("invoice_number\\n").length,0);
  assert.equal(state,"error","header-only input must enter the accessible error state");
  assert.equal(window.invoiceGuardParserErrorShown,false,"header-only input must not claim a specific parser alert was shown");
  assert.equal(message,"","header-only input should leave generic no-rows guidance to app.js");
}
