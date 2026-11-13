import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

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
  assert.match(html, new RegExp('src="' + script.replace(".", "\\.") + '"'), "missing required script: " + script);
}

for (const locale of ["en", "ru", "uz", "es", "de", "fr", "pt"]) {
  assert.match(html, new RegExp('option value="' + locale + '"'), "missing locale selector: " + locale);
}

assert.match(html, /type="file"[^>]*accept="\.csv,text\/csv"/, "CSV upload contract changed");
assert.match(html, /No signup/, "privacy-first no-signup onboarding contract missing");
assert.match(html, /Your CSV stays in your browser/, "browser-local privacy contract missing");

console.log("InvoiceGuard commercial UI contract: PASS");
console.log("Required controls: " + requiredIds.length);
console.log("Required scripts: " + requiredScripts.length);
console.log("Locales: 7");
