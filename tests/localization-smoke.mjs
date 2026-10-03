import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = fs.readFileSync(new URL('../i18n.js', import.meta.url), 'utf8');
const keys = [...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(m => m[1]);
const uniqueKeys = [...new Set(keys)];
const listeners = {};
const fakeDocument = {
  documentElement: { lang: 'en' },
  addEventListener(type, fn) { listeners[type] = fn; },
  dispatchEvent() {},
  querySelectorAll() { return []; },
  getElementById() { return null; },
};
const store = new Map();
const context = {
  window: {},
  document: fakeDocument,
  navigator: { language: 'en' },
  localStorage: { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) },
  CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
};
vm.createContext(context);
vm.runInContext(source, context, { filename: 'i18n.js' });
const api = context.window.invoiceGuardI18n;
if (!api?.dict) throw new Error('invoiceGuardI18n dictionary was not initialized');
const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const failures = [];

// Runtime coverage catches missing/blank values used by the visible DOM.
for (const locale of locales) {
  const dict = api.dict[locale];
  if (!dict) { failures.push(`${locale}: dictionary missing`); continue; }
  for (const key of uniqueKeys) {
    if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`${locale}: missing ${key}`);
  }
}

// Non-English dictionaries spread `en` for defensive compatibility. Require every
// visible key to be explicitly overridden so that fallback cannot create mixed UI.
for (const locale of locales.slice(1)) {
  const marker = `const ${locale}={...en,`;
  const start = source.indexOf(marker);
  if (start < 0) { failures.push(`${locale}: source dictionary missing`); continue; }
  const bodyStart = start + marker.length;
  const end = source.indexOf('};', bodyStart);
  const body = source.slice(bodyStart, end);
  const explicitKeys = new Set([...body.matchAll(/(?:^|,)\s*([A-Za-z][A-Za-z0-9]*)\s*:/g)].map(m => m[1]));
  for (const key of uniqueKeys) {
    if (!explicitKeys.has(key)) failures.push(`${locale}: visible key ${key} would fall back to English`);
  }
}

if (failures.length) {
  console.error(`Localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Localization smoke passed: ${locales.length} locales × ${uniqueKeys.length} visible keys; no visible English fallback.`);
