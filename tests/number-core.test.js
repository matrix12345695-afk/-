const assert=require('assert');
const {parseAccountingNumber}=require('../number-core.js');
const cases=[
 ['1234.56',1234.56],['1,234.56',1234.56],['1.234,56',1234.56],['1 234,56',1234.56],
 ['1\u00a0234,56',1234.56],['1\u202f234,56',1234.56],["1'234.56",1234.56],['1,234',1234],
 ['1.234',1234],['12,34',12.34],['12.34',12.34],['(1 234,56)',-1234.56],['-$1,234.56',-1234.56],
 ['€ 1.234,56',1234.56],['1,234.56 €',1234.56],['1.234.567',1234567],
 ['1,234,567.89',1234567.89],['12,34,567',1234567],['1234,567',1234.567],['0.123',0.123],['1,234,567.89',1234567.89],['1.234.567,89',1234567.89],['1 234 567,89',1234567.89]
];
for(const [input,expected] of cases){
  const actual=parseAccountingNumber(input);
  assert.strictEqual(actual,expected, input+': expected '+expected+', got '+actual);
}
for(const input of ['',null,undefined,'not-a-number']) assert.ok(Number.isNaN(parseAccountingNumber(input)),String(input)+' should be NaN');

const malformed=[
 '12abc34','12 USD 34','1-2','--12','12+3','1,23,4','1,,234','1.23.4',
 '1,234,56','1.234,5.6','12$34','$12€','( -1 )','1,234.56-','1,234.56 USD','1,234.567,89','1.234,567.89','1 234,567.89','1,234 567.89','1,234 567','1.234 567',"1'234 567"
];
for(const input of malformed){
  assert.ok(Number.isNaN(parseAccountingNumber(input)),input+' must be rejected, not coerced');
}
console.log('number-core: '+(cases.length+4+malformed.length)+' regression cases passed');
