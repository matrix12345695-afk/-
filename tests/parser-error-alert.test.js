const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const loadLine = source.split(/\r?\n/).find(line => line.startsWith('function load(text){'));
assert.ok(loadLine, 'production load() implementation must be present');

function runWithAuditState(state) {
  let alerts = 0;
  let renders = 0;
  const context = {
    rawText: '',
    priorHistory: {},
    history: () => ({}),
    parseCSV: () => [],
    $: () => ({ dataset: { state } }),
    alert: () => { alerts += 1; },
    dt: key => key,
    render: () => { renders += 1; },
  };
  vm.createContext(context);
  vm.runInContext(loadLine + '\nthis.load = load;', context);
  context.load('synthetic-invalid.csv');
  return { alerts, renders };
}

assert.deepEqual(runWithAuditState('error'), { alerts: 0, renders: 0 },
  'a specific parser error must not be followed by a second generic no-rows alert');
assert.deepEqual(runWithAuditState('empty'), { alerts: 1, renders: 0 },
  'an empty/header-only input must still receive the generic no-rows guidance');

console.log('✓ InvoiceGuard parser failures show one specific error; empty input keeps generic guidance.');
