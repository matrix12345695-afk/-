const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const { parseAccountingNumber } = require('../number-core.js');

// Exercise the production audit() implementation, not a test-only copy.
const source = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const normalizeMatch = source.match(/const normalizeDuplicatePart=s=>[^;]+;/);
const keyMatch = source.match(/const duplicateKey=\(vendor,no\)=>[^;]+;/);
const auditMatch = source.match(/function audit\(rows\)\{.*?return find\}/s);
assert(normalizeMatch && keyMatch && auditMatch, 'production audit implementation not found');

function run(rows) {
  const context = {
    num: parseAccountingNumber,
    priorHistory: {},
    rules: { tolerance: 0.02, maxTaxRate: 30, allowedCurrencies: ['USD', 'EUR', 'UZS'] },
  };
  vm.createContext(context);
  vm.runInContext(`${normalizeMatch[0]}\n${keyMatch[0]}\n${auditMatch[0]}\nthis.audit=audit;`, context);
  return context.audit(rows);
}

const base = {
  _row: 2,
  invoice_number: 'INV-1',
  vendor: 'Acme',
  date: '2026-09-01',
  currency: 'USD',
  subtotal: '100.00',
  tax: '20.00',
  total: '120.00',
};
const keys = findings => findings.map(x => x.msgKey);

// Required identifiers and payment fields.
assert(keys(run([{ ...base, invoice_number: '' }])).includes('missingNo'), 'missing invoice number must block payment');
assert(keys(run([{ ...base, vendor: '' }])).includes('missingVendor'), 'missing vendor must block payment');
assert(keys(run([{ ...base, date: '' }])).includes('missingDate'), 'missing invoice date must be reviewed');
assert(keys(run([{ ...base, currency: '' }])).includes('missingCurrency'), 'missing currency must be reviewed');
assert(keys(run([{ ...base, total: '' }])).includes('invalidTotal'), 'missing total must be treated as invalid total');

// Date sanity. Use an ISO date for deterministic parsing and compute future dates
// relative to runtime so this suite does not rot as the calendar advances.
assert(!keys(run([base])).some(k => k === 'invalidDate' || k === 'futureDate'), 'valid ISO invoice date must pass date checks');
assert(keys(run([{ ...base, date: 'not-a-date' }])).includes('invalidDate'), 'malformed invoice date must be flagged');

const farFuture = new Date();
farFuture.setUTCFullYear(farFuture.getUTCFullYear() + 5);
const futureIso = farFuture.toISOString().slice(0, 10);
assert(keys(run([{ ...base, date: futureIso }])).includes('futureDate'), 'clearly future invoice date must be flagged');

// One day ahead is explicitly tolerated by the production policy to avoid
// timezone/processing-boundary false positives.
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
assert(!keys(run([{ ...base, date: tomorrowIso }])).includes('futureDate'), 'tomorrow must remain inside the configured date grace window');

console.log('audit missing-field/date regression: ok');
