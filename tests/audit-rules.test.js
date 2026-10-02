const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const { parseAccountingNumber } = require('../number-core.js');

// Exercise the production audit function from app.js while injecting the same
// hardened number parser that number-live.js installs in the browser.
const source = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const normalizeMatch = source.match(/const normalizeDuplicatePart=s=>[^;]+;/);
const keyMatch = source.match(/const duplicateKey=\(vendor,no\)=>[^;]+;/);
const auditMatch = source.match(/function audit\(rows\)\{.*?return find\}/s);
assert(normalizeMatch && keyMatch && auditMatch, 'production audit implementation not found');

function run(rows, overrides = {}, history = {}) {
  const context = {
    num: parseAccountingNumber,
    priorHistory: history,
    rules: {
      tolerance: 0.02,
      maxTaxRate: 30,
      allowedCurrencies: ['USD', 'EUR', 'UZS'],
      ...overrides,
    },
  };
  vm.createContext(context);
  vm.runInContext(`${normalizeMatch[0]}\n${keyMatch[0]}\n${auditMatch[0]}\nthis.audit=audit;`, context);
  return context.audit(rows);
}

const base = { _row: 2, invoice_number: 'INV-1', vendor: 'Acme', date: '2026-09-01', currency: 'USD', subtotal: '100.00', tax: '20.00', total: '120.00' };
const keys = findings => findings.map(x => x.msgKey);

assert(!keys(run([base])).includes('badMath'), 'exact arithmetic must pass');
assert(!keys(run([{ ...base, total: '120.02' }])).includes('badMath'), 'difference at tolerance boundary must pass');
assert(keys(run([{ ...base, total: '120.03' }])).includes('badMath'), 'difference above tolerance must fail');
assert(!keys(run([{ ...base, subtotal: '100,00', tax: '20,00', total: '120,00' }])).includes('badMath'), 'decimal-comma arithmetic must use hardened parser');
assert(!keys(run([{ ...base, subtotal: '1 000,00', tax: '200,00', total: '1 200,00' }])).includes('badMath'), 'localized thousands arithmetic must pass');

assert(keys(run([{ ...base, tax: '-1', total: '99' }])).includes('negativeTax'), 'negative tax must block payment');
assert(!keys(run([{ ...base, tax: '30', total: '130' }])).includes('taxRate'), 'tax exactly at configured maximum must pass');
assert(keys(run([{ ...base, tax: '30.01', total: '130.01' }])).includes('taxRate'), 'tax above configured maximum must be reviewed');

assert(!keys(run([{ ...base, currency: 'usd' }])).includes('currencyNotAllowed'), 'currency allow-list must be case-insensitive');
assert(keys(run([{ ...base, currency: 'JPY' }])).includes('currencyNotAllowed'), 'currency outside allow-list must be flagged');
assert(!keys(run([{ ...base, currency: 'JPY' }], { allowedCurrencies: [] })).includes('currencyNotAllowed'), 'empty allow-list must allow any currency');

console.log('audit arithmetic/tax/currency regression: ok');
