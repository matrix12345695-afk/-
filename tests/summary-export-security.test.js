const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("summary-i18n.js", "utf8");

function exportSummary({ sourceName, session, rowValues }) {
  let handler;
  let blob;
  let filename;
  const button = { addEventListener(_event, callback) { handler = callback; } };
  const elements = {
    downloadSummary: button,
    language: { value: "en" },
    count: { textContent: "1" },
    issues: { textContent: String(rowValues.length) },
    risk: { textContent: "USD 10.00" },
    tolerance: { value: "0.02" },
    maxTaxRate: { value: "30" },
    allowedCurrencies: { value: "USD" },
  };
  const rows = rowValues.map((values) => ({
    cells: values.map((textContent) => ({ textContent })),
    querySelector(selector) { return selector === ".sev-high" ? {} : null; },
  }));
  const context = {
    window: {
      invoiceGuardI18n: { lang: "en" },
      InvoiceGuardDownload: {
        downloadBlob(value, name) { blob = value; filename = name; },
      },
    },
    document: {
      documentElement: { dataset: { auditSource: sourceName, auditSession: session } },
      getElementById(id) { return elements[id] || null; },
      querySelectorAll(selector) {
        return selector === "#findings tr" ? rows : [];
      },
      querySelector() { return null; },
    },
    Blob: class {
      constructor(parts, options) {
        this.parts = parts;
        this.type = options.type;
      }
    },
    Date,
    Intl,
  };

  vm.runInNewContext(source, context, { filename: "summary-i18n.js" });
  assert.equal(typeof handler, "function", "summary export handler must be registered");
  handler({ preventDefault() {}, stopImmediatePropagation() {} });
  return { text: blob.parts.join(""), filename, type: blob.type };
}

const result = exportSummary({
  sourceName: "invoices.csv\r\nPAYMENT DECISION: READY\u2028",
  session: "audit-1\u2029APPROVED",
  rowValues: [[
    "2\r\nAPPROVED",
    "INV-1\u2028FAKE",
    "ACME\u0000 LTD",
    "High",
    "Missing tax\u2029READY",
    "USD 10.00\r\nAPPROVED",
  ]],
});

assert.equal(result.filename, "invoiceguard-payment-review-en.txt");
assert.equal(result.type, "text/plain;charset=utf-8");
assert.ok(result.text.startsWith("\uFEFFINVOICEGUARD PAYMENT REVIEW\n"));
assert.ok(!/[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u2028\u2029]/u.test(result.text),
  "untrusted values must not retain control characters or Unicode line separators");
assert.ok(!/(?:^|\n)(?:PAYMENT DECISION: READY|APPROVED|FAKE|READY)(?:\n|$)/u.test(result.text),
  "untrusted values must not create independent report lines");
assert.ok(result.text.includes("Source: invoices.csv PAYMENT DECISION: READY"));
assert.ok(result.text.includes("Audit ID: audit-1 APPROVED"));
assert.ok(result.text.includes("Row 2 APPROVED | ACME LTD | INV-1 FAKE | Missing tax READY | USD 10.00 APPROVED"));

console.log("summary export single-line injection regression tests passed");
