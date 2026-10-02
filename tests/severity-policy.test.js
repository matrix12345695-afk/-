const assert = require('node:assert/strict');
const { severityForFinding, applySeverityPolicy } = require('../severity-policy.js');

const blocking = ['missingNo','missingVendor','missingCurrency','currencyNotAllowed','invalidTotal','badMath','negativeTax','pastDuplicate','duplicate'];
const review = ['missingDate','invalidDate','futureDate','taxRate'];

for (const key of blocking) assert.equal(severityForFinding(key, 'Medium'), 'High', `${key} must block payment`);
for (const key of review) assert.equal(severityForFinding(key, 'High'), 'Medium', `${key} must require review, not block payment`);
assert.equal(severityForFinding('futureRule', 'High'), 'High', 'unknown rules preserve engine severity');

const findings = applySeverityPolicy([
  { msgKey: 'missingCurrency', severity: 'Medium', row: 2 },
  { msgKey: 'taxRate', severity: 'High', row: 3 },
]);
assert.deepEqual(findings.map(x => x.severity), ['High', 'Medium']);
assert.deepEqual(findings.map(x => x.row), [2, 3], 'policy must preserve finding context');

console.log('severity policy tests passed');
