const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const loadLine = source.split(/\r?\n/).find(line => line.startsWith('function load(text){'));
assert.ok(loadLine, 'production load() implementation must be present');

function run({ parserError = false, staleError = false } = {}) {
  let alerts = 0;
  let renders = 0;
  const window = { invoiceGuardParserErrorShown: staleError };
  const context = {
    window,
    rawText: '',
    priorHistory: {},
    history: () => ({}),
    parseCSV: () => {
      if (parserError) window.invoiceGuardParserErrorShown = true;
      return [];
    },
    alert: () => { alerts += 1; },
    dt: key => key,
    render: () => { renders += 1; },
  };
  vm.createContext(context);
  vm.runInContext(loadLine + '\nthis.load = load;', context);
  context.load('synthetic-invalid.csv');
  return { alerts, renders };
}

assert.deepEqual(run({ parserError: true }), { alerts: 0, renders: 0 },
  'a specific parser error must not be followed by a second generic no-rows alert');
assert.deepEqual(run(), { alerts: 1, renders: 0 },
  'empty/header-only input must retain generic no-rows guidance');
assert.deepEqual(run({ staleError: true }), { alerts: 1, renders: 0 },
  'a previous parser error must not suppress guidance for a later empty input');

console.log('✓ InvoiceGuard shows one specific parser error; empty and header-only inputs retain generic guidance.');
