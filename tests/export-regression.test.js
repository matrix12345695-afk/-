const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function cell(text, className = '') {
  return { textContent: text, className };
}
function row(values, high = false) {
  const cells = values.map((v, i) => cell(v, i === 3 && high ? 'sev-high' : ''));
  return { cells, querySelector: sel => sel === '.sev-high' && high ? {} : null };
}
function runScript(file, { lang = 'en', rows = [], count = '2', issues = '1', risk = 'USD 100' } = {}) {
  let handler;
  let download;
  let blob;
  const button = { addEventListener: (_type, fn) => { handler = fn; } };
  const elements = {
    language: { value: lang }, download: button, downloadSummary: button,
    count: { textContent: count }, issues: { textContent: issues }, risk: { textContent: risk }
  };
  class TestBlob {
    constructor(parts, options) { this.parts = parts; this.type = options.type; blob = this; }
  }
  const context = {
    window: { invoiceGuardI18n: { lang } },
    document: {
      getElementById: id => elements[id] || null,
      querySelectorAll: selector => selector === '#findings tr' ? rows : [],
      createElement: tag => {
        assert.strictEqual(tag, 'a');
        return { href: '', download: '', click() { download = this.download; } };
      }
    },
    Blob: TestBlob,
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} },
    setTimeout: fn => fn(),
    Date,
    Intl,
    console
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  assert.ok(handler, `${file} should register a download handler`);
  handler({ preventDefault() {}, stopImmediatePropagation() {} });
  return { download, blob, text: blob.parts.join('') };
}

const findingHeaders = {
  en: '"row","invoice","vendor","severity","finding","total","currency"',
  ru: '"строка","счёт","поставщик","критичность","замечание","сумма","валюта"',
  uz: '"qator","hisob","yetkazib beruvchi","daraja","topilma","jami","valyuta"',
  es: '"fila","factura","proveedor","severidad","hallazgo","total","moneda"',
  de: '"zeile","rechnung","lieferant","schweregrad","feststellung","gesamt","währung"',
  fr: '"ligne","facture","fournisseur","sévérité","constat","total","devise"',
  pt: '"linha","fatura","fornecedor","severidade","achado","total","moeda"'
};

for (const [lang, header] of Object.entries(findingHeaders)) {
  const r = runScript('findings-export-i18n.js', {
    lang,
    rows: [row(['2', 'INV-1', 'ACME, Inc.', 'High', 'Quoted "finding"', 'USD 1,234.50'])]
  });
  assert.strictEqual(r.download, `invoiceguard-findings-${lang}.csv`);
  assert.strictEqual(r.blob.type, 'text/csv;charset=utf-8');
  assert.ok(r.text.startsWith('\uFEFF' + header + '\n'), `${lang} findings header/BOM`);
  assert.ok(r.text.includes('"ACME, Inc."'));
  assert.ok(r.text.includes('"Quoted ""finding"""'));
  assert.ok(r.text.endsWith('"1,234.50","USD"'), 'amount/currency should be split without corrupting grouping');
}

const summary = runScript('summary-i18n.js', {
  lang: 'ru', count: '3', issues: '2', risk: 'USD 125.50',
  rows: [
    row(['2', 'INV-1', 'ACME', 'Высокий', 'Ошибка суммы', 'USD 100'], true),
    row(['3', 'INV-2', 'Beta', 'Средний', 'Проверить дату', 'USD 25.50'], false)
  ]
});
assert.strictEqual(summary.download, 'invoiceguard-audit-summary-ru.txt');
assert.strictEqual(summary.blob.type, 'text/plain;charset=utf-8');
assert.ok(summary.text.startsWith('\uFEFFСВОДКА АУДИТА INVOICEGUARD\n'));
assert.ok(summary.text.includes('Проверено счетов: 3'));
assert.ok(summary.text.includes('Замечания: 2'));
assert.ok(summary.text.includes('Счета, требующие внимания: 1'));
assert.ok(summary.text.includes('Строка 2 | ACME | INV-1 | Ошибка суммы | USD 100'));
assert.ok(!summary.text.includes('INV-2 | Проверить дату'), 'medium findings must not enter high-severity section');

console.log('export regression tests passed');
