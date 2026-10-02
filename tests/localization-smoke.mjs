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
for (const locale of locales) {
  const dict = api.dict[locale];
  if (!dict) { failures.push(`${locale}: dictionary missing`); continue; }
  for (const key of uniqueKeys) {
    if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`${locale}: missing ${key}`);
  }
}
if (failures.length) {
  console.error(`Localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Localization smoke passed: ${locales.length} locales × ${uniqueKeys.length} visible keys.`);
