const assert=require('assert');
const policy=require('../required-fields-core.js');

assert.deepStrictEqual(policy.normalizeRequiredFields(),policy.DEFAULTS);
assert.deepStrictEqual(policy.normalizeRequiredFields(['vendor','vendor','date','bogus']),['vendor','date']);
assert.strictEqual(policy.isRequired('currency',['currency']),true);
assert.strictEqual(policy.isRequired('currency',['vendor']),false);

const findings=[
  {msgKey:'missingNo'}, {msgKey:'missingVendor'}, {msgKey:'missingDate'},
  {msgKey:'missingCurrency'}, {msgKey:'invalidTotal'}, {msgKey:'duplicate'}
];
assert.deepStrictEqual(
  policy.filterMissingFindings(findings,['invoice_number','vendor']).map(x=>x.msgKey),
  ['missingNo','missingVendor','invalidTotal','duplicate']
);
assert.deepStrictEqual(
  policy.filterMissingFindings(findings,[]).map(x=>x.msgKey),
  ['invalidTotal','duplicate']
);
console.log('required-fields-core tests passed');
