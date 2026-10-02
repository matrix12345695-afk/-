const assert=require('assert');
const {parseAccountingNumber}=require('../number-core.js');
const cases=[
 ['1234.56',1234.56],['1,234.56',1234.56],['1.234,56',1234.56],['1 234,56',1234.56],['1\u00a0234,56',1234.56],['1\u202f234,56',1234.56],["1'234.56",1234.56],['1,234',1234],['1.234',1234],['12,34',12.34],['12.34',12.34],['(1 234,56)',-1234.56],['-$1,234.56',-1234.56],['€ 1.234,56',1234.56]
];
for(const [input,expected] of cases){const actual=parseAccountingNumber(input);assert.strictEqual(actual,expected,`${input}: expected ${expected}, got ${actual}`);}
for(const input of ['',null,undefined,'not-a-number']) assert.ok(Number.isNaN(parseAccountingNumber(input)),`${input} should be NaN`);
console.log(`number-core: ${cases.length+4} regression cases passed`);
