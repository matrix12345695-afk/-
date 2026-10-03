const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function cell(text, className = '') {
  return { textContent: text, className };
}
function row(values, severity = '') {
  const cells = values.map((v, i) => cell(v, i === 3 && severity ? `sev-${severity}` : ''));
  return { cells, querySelector: sel => cells.some(c => c.className === sel.slice(1)) ? {} : null };
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
    row(['2', 'INV-1', 'ACME', 'Высокий', 'Ошибка суммы', 'USD 100'], 'high'),
    row(['3', 'INV-2', 'Beta', 'Средний', 'Проверить дату', 'USD 25.50'], 'medium')
  ]
});
assert.strictEqual(summary.download, 'invoiceguard-payment-review-ru.txt');
assert.strictEqual(summary.blob.type, 'text/plain;charset=utf-8');
assert.ok(summary.text.startsWith('\uFEFFINVOICEGUARD — ПРОВЕРКА ПЕРЕД ОПЛАТОЙ\n'));
assert.ok(summary.text.includes('Решение по оплате: ОСТАНОВИТЬ ОПЛАТУ'));
assert.ok(summary.text.includes('Проверено счетов: 3'));
assert.ok(summary.text.includes('Замечания: 2'));
assert.ok(summary.text.includes('Счета, требующие внимания: 2'));
assert.ok(summary.text.includes('Строка 2 | ACME | INV-1 | Ошибка суммы | USD 100'));
assert.ok(summary.text.includes('ЗАМЕЧАНИЯ ДЛЯ ПРОВЕРКИ'));
assert.ok(summary.text.includes('Строка 3 | Beta | INV-2 | Проверить дату | USD 25.50'));

const reviewOnly = runScript('summary-i18n.js', {
  lang: 'en', count: '1', issues: '1', risk: '0',
  rows: [row(['2', 'INV-9', 'Beta', 'Medium', 'Verify date', 'USD 25'], 'medium')]
});
assert.ok(reviewOnly.text.includes('Payment decision: REVIEW BEFORE PAYMENT'));

const clean = runScript('summary-i18n.js', { lang: 'en', count: '4', issues: '0', risk: '0', rows: [] });
assert.ok(clean.text.includes('Payment decision: READY FOR APPROVAL'));
assert.ok(clean.text.includes('No payment-blocking findings.'));
assert.ok(clean.text.includes('No review findings.'));

console.log('export regression tests passed');
