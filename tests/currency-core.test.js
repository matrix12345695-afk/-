const assert=require('node:assert/strict');
require('../currency-core.js');
const {normalizeCurrency,normalizeAllowedCurrencies,classifyCurrency}=globalThis.InvoiceGuardCurrencyCore;

assert.equal(normalizeCurrency(' usd '),'USD');
assert.equal(normalizeCurrency('US$'),'USD');
assert.equal(normalizeCurrency('€'),'EUR');
assert.equal(normalizeCurrency('sterling'),'GBP');
assert.equal(normalizeCurrency('tenge'),'KZT');
assert.equal(normalizeCurrency('dirhams'),'AED');
assert.equal(normalizeCurrency('UZS'),'UZS');
assert.equal(normalizeCurrency('sum'),'','ambiguous SUM must not silently normalize to UZS');
assert.equal(normalizeCurrency('som'),'','ambiguous SOM must not silently normalize to UZS');
assert.equal(normalizeCurrency("so'm"),'UZS');
assert.equal(normalizeCurrency('soʻm'),'UZS');
assert.equal(normalizeCurrency('сўм'),'UZS');
assert.equal(normalizeCurrency('сум'),'UZS');
assert.equal(normalizeCurrency('US DOLLAR'),'USD');
assert.equal(normalizeCurrency('доллар США'),'USD');
assert.equal(normalizeCurrency('рубль'),'RUB');
assert.equal(normalizeCurrency('renminbi'),'CNY');
assert.equal(normalizeCurrency('USDX'),'','unknown/non-ISO-looking token must be rejected');
assert.equal(normalizeCurrency('ABC'),'','arbitrary three-letter tokens must not silently pass as currencies');
assert.equal(normalizeCurrency('XXX'),'','ISO no-currency/test code must be treated as suspicious');

assert.deepEqual(normalizeAllowedCurrencies([' usd ','USD','€','KZT']),['USD','EUR','KZT']);
assert.equal(classifyCurrency('', ['USD']).status,'missing');
assert.equal(classifyCurrency('???',['USD']).status,'unrecognized');
assert.equal(classifyCurrency('ABC',[]).status,'unrecognized');
assert.deepEqual(classifyCurrency('US$',['USD']),{status:'ok',raw:'US$',currency:'USD'});
assert.deepEqual(classifyCurrency('EUR',['USD']),{status:'not_allowed',raw:'EUR',currency:'EUR'});

console.log('currency core regression tests passed');
