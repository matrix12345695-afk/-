const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
require("../number-core.js");
const safeExporter = require("../clean-export.js");
const source = fs.readFileSync("findings-export-i18n.js", "utf8");

function exportCsv(rows, includeSafeExporter = true) {
  let handler;
  let blob;
  let downloadName;
  const rowElements = rows.map((values) => ({
    cells: values.map((textContent) => ({ textContent })),
  }));
  const context = {
    window: {
      invoiceGuardI18n: { lang: "en" },
      InvoiceGuardCleanExport: includeSafeExporter ? safeExporter : undefined,
    },
    document: {
      getElementById(id) {
        if (id === "download") return { addEventListener(_event, fn) { handler = fn; } };
        if (id === "language") return { value: "en" };
        return null;
      },
      querySelectorAll(selector) {
        return selector === "#findings tr" ? rowElements : [];
      },
      createElement(tag) {
        assert.equal(tag, "a");
        return {
          click() {},
          href: "",
          set download(value) { downloadName = value; },
        };
      },
    },
    Blob: class {
      constructor(parts, options) {
        this.parts = parts;
        this.type = options.type;
        blob = this;
      }
    },
    URL: {
      createObjectURL() { return "blob:test"; },
      revokeObjectURL() {},
    },
    setTimeout(fn) { fn(); },
  };

  vm.runInNewContext(source, context, { filename: "findings-export-i18n.js" });
  assert.equal(typeof handler, "function", "findings CSV download handler must be registered");
  handler({ preventDefault() {}, stopImmediatePropagation() {} });
  return { csv: blob.parts.join(""), type: blob.type, downloadName };
}

const result = exportCsv([
  ["2", "=2+2", "@SUM(1,1)", "High", '+HYPERLINK("x")', "USD -1+CMD()"],
  ["3", "INV-2", "Vendor", "Medium", "Ordinary finding", "USD -125.50"],
]);

assert.equal(result.type, "text/csv;charset=utf-8");
assert.equal(result.downloadName, "invoiceguard-findings-en.csv");
assert.ok(result.csv.startsWith("\uFEFF"));
assert.match(result.csv, /"'=2\+2"/, "formula-like invoice values must be neutralized");
assert.match(result.csv, /"'@SUM\(1,1\)"/, "formula-like vendor values must be neutralized");
assert.match(result.csv, /"'\+HYPERLINK\(""x""\)"/, "formula-like finding text must be neutralized and CSV-quoted");
assert.match(result.csv, /"'-1\+CMD\(\)"/, "negative arithmetic expressions in totals must be neutralized");
assert.match(result.csv, /"-125\.50"/, "valid negative monetary values must remain unchanged");

assert.throws(
  () => exportCsv([["2", "=2+2", "Vendor", "High", "Finding", "USD 10.00"]], false),
  /Safe CSV export is unavailable/,
  "missing safety helper must fail closed instead of downloading an unsafe CSV",
);

console.log("findings-export formula-injection regression tests passed");
