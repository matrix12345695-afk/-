const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

// Exercise the production duplicate-key implementation directly from app.js so
// this regression suite cannot silently drift away from the browser audit path.
const source = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const normalizeMatch = source.match(/const normalizeDuplicatePart=s=>[^;]+;/);
const keyMatch = source.match(/const duplicateKey=\(vendor,no\)=>[^;]+;/);
assert(normalizeMatch, 'production normalizeDuplicatePart implementation not found');
assert(keyMatch, 'production duplicateKey implementation not found');

const context = {};
vm.createContext(context);
vm.runInContext(`${normalizeMatch[0]}\n${keyMatch[0]}\nthis.duplicateKey=duplicateKey;`, context);
const key = context.duplicateKey;

const same = [
  ['ACME LTD', 'INV-001', 'acme ltd', 'inv 001', 'case, punctuation and whitespace'],
  ['  ACME   LTD  ', ' INV / 001 ', 'ACME-LTD', 'INV001', 'repeated whitespace and separators'],
  ['ＡＣＭＥ', 'ＩＮＶ－００１', 'acme', 'inv-001', 'Unicode NFKC full-width forms'],
  ['Café S.A.', '№ 42', 'CAFÉ SA', '42', 'Unicode letters and symbols'],
  ['Vendor\u00a0Name', 'INV\u202f123', 'vendor name', 'inv 123', 'NBSP and narrow NBSP'],
];
for (const [v1, n1, v2, n2, label] of same) {
  assert.strictEqual(key(v1, n1), key(v2, n2), label);
}

const different = [
  ['Acme', 'INV-001', 'Acme', 'INV-002', 'different invoice numbers'],
  ['Acme', 'INV-001', 'Beta', 'INV-001', 'same invoice number at different vendors'],
  ['Acme 1', 'INV-001', 'Acme 2', 'INV-001', 'meaningful digits in vendor names'],
];
for (const [v1, n1, v2, n2, label] of different) {
  assert.notStrictEqual(key(v1, n1), key(v2, n2), label);
}

// Cross-upload history uses the exact same normalized key. This fixture guards
// the contract that a later upload resolves to the prior browser-local record.
const history = Object.create(null);
history[key('ACME LTD', 'INV-001')] = { vendor: 'ACME LTD', no: 'INV-001' };
assert(history[key(' acme-ltd ', 'inv 001')], 'normalized prior-audit record should be found');
assert.strictEqual(history[key('Beta', 'INV-001')], undefined, 'vendor must remain part of duplicate identity');

console.log('duplicate normalization regression: ok');
