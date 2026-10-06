const assert = require('node:assert/strict');
const {
  SUPPORTED,
  DEFAULTS,
  MISSING_KEYS,
  normalizeRequiredFields,
  isRequired,
  filterMissingFindings,
} = require('../required-fields-core.js');

assert.deepEqual(SUPPORTED, ['invoice_number', 'vendor', 'date', 'currency']);
assert.deepEqual(DEFAULTS, SUPPORTED);
assert.deepEqual(normalizeRequiredFields(undefined), DEFAULTS);
assert.deepEqual(normalizeRequiredFields(null), DEFAULTS);
assert.deepEqual(normalizeRequiredFields('vendor'), DEFAULTS);
assert.deepEqual(normalizeRequiredFields([]), []);
assert.deepEqual(
  normalizeRequiredFields(['vendor', 'vendor', 'currency', 'unsupported', null]),
  ['vendor', 'currency'],
  'policy should deduplicate supported fields and ignore unknown values',
);

assert.equal(isRequired('vendor', ['vendor']), true);
assert.equal(isRequired('date', ['vendor']), false);
assert.equal(isRequired('currency', undefined), true, 'default policy requires every supported field');

const findings = [
  { msgKey: MISSING_KEYS.invoice_number, row: 2 },
  { msgKey: MISSING_KEYS.vendor, row: 2 },
  { msgKey: MISSING_KEYS.date, row: 2 },
  { msgKey: MISSING_KEYS.currency, row: 2 },
  { msgKey: 'badArithmetic', row: 2 },
  { msgKey: 'duplicate', row: 3 },
];

assert.deepEqual(
  filterMissingFindings(findings, ['vendor', 'currency']).map((f) => f.msgKey),
  [MISSING_KEYS.vendor, MISSING_KEYS.currency, 'badArithmetic', 'duplicate'],
  'optional missing-field findings should be removed without touching unrelated audit findings',
);
assert.deepEqual(
  filterMissingFindings(findings, []).map((f) => f.msgKey),
  ['badArithmetic', 'duplicate'],
  'an explicitly empty policy should suppress all missing-field findings only',
);
assert.deepEqual(
  filterMissingFindings(findings, undefined).map((f) => f.msgKey),
  findings.map((f) => f.msgKey),
  'missing configuration should preserve the safe all-required default',
);
assert.deepEqual(filterMissingFindings(undefined, ['vendor']), []);

console.log('required-fields-core regression tests passed');
