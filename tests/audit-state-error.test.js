const assert = require('node:assert/strict');
const fs = require('node:fs');

const csvLive = fs.readFileSync('csv-live.js', 'utf8');
const auditState = fs.readFileSync('audit-state.js', 'utf8');

assert.match(csvLive, /invoiceGuardAuditState\?\.set\?\.\("error"\)/, 'CSV integration must expose controlled parser failures in the audit state');
assert.match(csvLive, /catch\(err\)\{auditError\(\);alert\(errorText\(err\)\);return\[\];\}/, 'Malformed CSV parser errors must set the error state before presenting details');
assert.match(csvLive, /parsed\.header\.length<1\|\|parsed\.rows\.length<1\)\{auditError\(\);return\[\];\}/, 'Empty/header-only CSV must leave loading and enter the error state');
assert.match(auditState, /errorBody:/, 'Audit error state must include user guidance');
assert.match(auditState, /aria-busy/, 'Audit state must expose loading state to assistive technology');

console.log('✓ controlled CSV failures are wired to the accessible audit error state');
