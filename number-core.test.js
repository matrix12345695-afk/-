const assert = require('assert');
const { parseAccountingNumber } = require('./number-core');

const cases = [
  ['1234.56', 1234.56],
  ['1,234.56', 1234.56],
  ['1.234,56', 1234.56],
  ['1 234,56', 1234.56],
  ['1\u00a0234,56', 1234.56],
  ['1\u202f234,56', 1234.56],
  ["1'234.56", 1234.56],
  ['USD 1,234.56', 1234.56],
  ['€1.234,56', 1234.56],
  ['(1,234.56)', -1234.56],
  ['-1.234,56', -1234.56],
  ['+1 234,56', 1234.56],
  ['1,234', 1234],
  ['1.234', 1234],
  ['12,34', 12.34],
  ['12.34', 12.34],
  ['0,5', 0.5],
  ['0.5', 0.5],
];

for (const [input, expected] of cases) {
  assert.strictEqual(parseAccountingNumber(input), expected, `${input} should parse as ${expected}`);
}

for (const input of ['', '   ', null, undefined, 'not a number']) {
  assert.ok(Number.isNaN(parseAccountingNumber(input)), `${String(input)} should be NaN`);
}

console.log(`number-core: ${cases.length + 5} regression checks passed`);
