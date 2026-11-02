const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const theme = read("theme.js");
const i18n = read("i18n.js");
const auditState = read("audit-state.js");
const mapping = read("mapping-i18n.js");

const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
assert.ok(buttons.length >= 8, "the primary workflow buttons should remain present");
for (const [, attributes, content] of buttons) {
  assert.ok(
    /\baria-label=/.test(attributes) || /\bdata-i18n=/.test(attributes) || content.replace(/<[^>]*>/g, "").trim(),
    "button must expose an accessible name: " + attributes
  );
}

const labelTokens = [...html.matchAll(/<\/?label\b[^>]*>/g)];
const isInsideLabel = (position) => {
  let depth = 0;
  for (const token of labelTokens) {
    if (token.index >= position) break;
    depth += token[0].startsWith("</") ? -1 : 1;
  }
  return depth > 0;
};
for (const input of html.matchAll(/<input\b[^>]*>/g)) {
  assert.ok(isInsideLabel(input.index), "input must have a wrapping label: " + input[0]);
}
assert.match(html, /<select id="language"[^>]*aria-label="Language"[^>]*data-i18n-aria="languageLabel"/);
assert.match(html, /<button id="themeToggle"[^>]*aria-label="Switch color theme"/);
assert.match(mapping, /fields\.innerHTML=unknown\.map\(x=>'<label>'\+esc\(x\.name\)\+'<select data-col='/);

const statusRegions = [...html.matchAll(/<[^>]*\brole="status"[^>]*>/g)].map((match) => match[0]);
assert.ok(statusRegions.length >= 4, "audit, mapping, history and rules feedback should expose status regions");
for (const tag of statusRegions) {
  assert.match(tag, /aria-live="polite"/, "status region must be announced politely: " + tag);
  assert.match(tag, /aria-atomic="true"/, "status region must announce a complete update: " + tag);
}
assert.match(auditState, /setAttribute\('aria-busy'/);
assert.match(html, /<section id="results" class="results hidden" aria-labelledby="findingsTitle">/);
assert.match(html, /<div class="table-wrap" tabindex="0" role="region" aria-labelledby="findingsTitle">/);
assert.match(html, /<th scope="col"/);

assert.match(i18n, /document\.documentElement\.lang=lang/);
assert.match(i18n, /querySelectorAll\('\[data-i18n-aria\]'\)/);
assert.match(i18n, /setAttribute\('aria-label'/);
assert.match(theme, /button\.setAttribute\('aria-label'/);
assert.match(theme, /button\.removeAttribute\('aria-pressed'/);
for (const locale of ["en", "ru", "uz", "es", "de", "fr", "pt"]) {
  assert.ok(theme.includes(locale + ":{system:"), "theme control needs a localized accessible label for " + locale);
}

console.log("InvoiceGuard accessible-name, live-region, table and seven-language theme contracts pass.");
