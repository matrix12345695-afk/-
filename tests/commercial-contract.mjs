import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const summaryI18n = readFileSync(new URL("../summary-i18n.js", import.meta.url), "utf8");

const requiredIds = [
  "file",
  "demo",
  "downloadSummary",
  "downloadClean",
  "download",
  "tolerance",
  "maxTaxRate",
  "allowedCurrencies",
  "applyRules",
  "results",
];

for (const id of requiredIds) {
  assert.match(html, new RegExp('id="' + id + '"'), "missing required UI id: " + id);
}

const requiredScripts = [
  "csv-core.js",
  "number-core.js",
  "currency-core.js",
  "date-core.js",
  "duplicate-context.js",
  "required-fields-core.js",
  "clean-export.js",
  "download-utils.js",
  "summary-i18n.js",
  "findings-export-i18n.js",
  "clean-export-live.js",
];

for (const script of requiredScripts) {
  assert.match(html, new RegExp('src="' + script.replace(".", "\\.") + '"'), "missing required script tag: " + script);
  assert.ok(existsSync(new URL("../" + script, import.meta.url)), "missing local script file: " + script);
}

for (const locale of ["en", "ru", "uz", "es", "de", "fr", "pt"]) {
  assert.match(html, new RegExp('option value="' + locale + '"'), "missing locale selector: " + locale);
}

assert.match(html, /type="file"[^>]*accept="\\.csv,text\\/csv"/, "CSV upload contract changed");
assert.match(html, /No signup/, "privacy-first no-signup onboarding contract missing");
assert.match(html, /Your CSV stays in your browser/, "browser-local privacy contract missing");

// Payment-review TXT exports must remain single-physical-line safe even when
// localized/untrusted fields contain Unicode line separators.
const expectedSanitizer = String.raw`const safeText=value=>String(value??"").replace(/[\\u0000-\\u001F\\u007F-\\u009F\\u2028\\u2029]+/gu," ")`;
assert.ok(
  summaryI18n.includes(expectedSanitizer),
  "summary export sanitizer must strip C0/C1 controls and U+2028/U+2029",
);

console.log("InvoiceGuard commercial UI contract: PASS");
console.log("Required controls: " + requiredIds.length);
console.log("Required scripts and local files: " + requiredScripts.length);
console.log("Locales: 7");
console.log("Payment-review export sanitizer: U+2028/U+2029 covered");
