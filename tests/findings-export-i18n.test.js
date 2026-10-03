const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const source=fs.readFileSync('findings-export-i18n.js','utf8');
const expected={
 en:['row','invoice','vendor','severity','finding','total','currency'],
 ru:['строка','счёт','поставщик','критичность','замечание','сумма','валюта'],
 uz:['qator','hisob','yetkazib beruvchi','daraja','topilma','jami','valyuta'],
 es:['fila','factura','proveedor','severidad','hallazgo','total','moneda'],
 de:['zeile','rechnung','lieferant','schweregrad','feststellung','gesamt','währung'],
 fr:['ligne','facture','fournisseur','sévérité','constat','total','devise'],
 pt:['linha','fatura','fornecedor','severidade','achado','total','moeda']
};
for(const [lang,headers] of Object.entries(expected)){
 let handler;
 const row={cells:['1','INV-1','Vendor','High','Duplicate invoice','USD 10.00'].map(textContent=>({textContent}))};
 const context={
  window:{invoiceGuardI18n:{lang}},
  document:{
   getElementById(id){if(id==='download')return {addEventListener(_event,fn){handler=fn}};if(id==='language')return {value:lang};return null},
   querySelectorAll(selector){return selector==='#findings tr'?[row]:[]},
   createElement(){return {click(){},set href(v){this._href=v},get href(){return this._href}}}
  },
  Blob:class{constructor(parts){this.parts=parts}},
  URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}},
  setTimeout(fn){fn()}
 };
 vm.runInNewContext(source,context);
 assert.equal(typeof handler,'function',`${lang}: download handler missing`);
 let prevented=false,stopped=false;
 context.Blob=class{constructor(parts){this.parts=parts;context.lastBlob=this}};
 handler({preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});
 assert(prevented&&stopped,`${lang}: export must own click event`);
 const csv=context.lastBlob.parts.join('');
 assert(csv.startsWith('\uFEFF'),`${lang}: UTF-8 BOM missing`);
 const headerLine=csv.slice(1).split('\n')[0];
 assert.equal(headerLine,headers.map(h=>'"'+h+'"').join(','),`${lang}: localized header mismatch`);
}
console.log('✓ findings export headers localized for EN/RU/UZ/ES/DE/FR/PT');
