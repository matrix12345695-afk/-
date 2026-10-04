import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');
const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const failures = [];
const placeholders = (value) => [...String(value).matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((m) => m[1]).sort().join(',');

const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('privacy.html inline localization script not found');
const dictionaryEnd = script.indexOf('\nconst lang=');
if (dictionaryEnd < 0) throw new Error('Could not isolate privacy localization dictionary');

const context = {};
vm.createContext(context);
vm.runInContext(`${script.slice(0, dictionaryEnd)};globalThis.__copy=copy;`, context, { filename: 'privacy.html' });
const copy = context.__copy;
const requiredKeys = Object.keys(copy?.en || {}).sort();
if (!requiredKeys.length) failures.push('English privacy baseline dictionary missing or empty');

// Treat English as the schema for this standalone customer-facing page. Exact key parity
// prevents a newly-added privacy/trust sentence from silently remaining English in one locale.
for (const locale of locales) {
  const dict = copy?.[locale];
  if (!dict) { failures.push(`${locale}: privacy dictionary missing`); continue; }
  const keys = Object.keys(dict).sort();
  if (keys.join('|') !== requiredKeys.join('|')) failures.push(`${locale}: privacy key set differs from English`);
  for (const key of requiredKeys) {
    if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`${locale}: privacy key ${key} missing or blank`);
    if (placeholders(dict[key]) !== placeholders(copy.en[key])) failures.push(`${locale}: privacy key ${key} placeholder mismatch`);
  }
}
for (const locale of Object.keys(copy || {})) {
  if (!locales.includes(locale)) failures.push(`privacy.html: unsupported locale ${locale}`);
}

// Exercise the actual standalone-page render and language selector for every locale.
for (const locale of locales) {
  const elements = {
    back: { textContent: '' },
    content: { innerHTML: '' },
    langLabel: { textContent: '' },
    lang: { value: '', addEventListener: () => {} },
  };
  const storage = new Map([['invoiceguard_lang', locale]]);
  const renderContext = {
    localStorage: {
      getItem: (key) => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
    document: { documentElement: { lang: 'en' }, title: '', getElementById: (id) => elements[id] || null },
  };
  vm.createContext(renderContext);
  vm.runInContext(script, renderContext, { filename: `privacy.html:${locale}` });
  const expected = copy[locale];
  if (renderContext.document.documentElement.lang !== locale) failures.push(`${locale}: document lang not applied`);
  if (renderContext.document.title !== `InvoiceGuard — ${expected.title}`) failures.push(`${locale}: localized document title not rendered`);
  if (elements.back.textContent !== expected.back) failures.push(`${locale}: localized back link not rendered`);
  if (elements.langLabel.textContent !== expected.language) failures.push(`${locale}: localized language label not rendered`);
  if (elements.lang.value !== locale) failures.push(`${locale}: language selector not synchronized`);
  if (storage.get('invoiceguard_lang') !== locale) failures.push(`${locale}: language preference not persisted`);
  for (const key of requiredKeys.filter((key) => !['back', 'language'].includes(key))) {
    if (!elements.content.innerHTML.includes(expected[key])) failures.push(`${locale}: rendered privacy content missing ${key}`);
  }
}

if (failures.length) {
  console.error(`Privacy localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Privacy localization smoke passed: ${locales.length} locales × ${requiredKeys.length} strings with exact key/placeholder parity plus rendered selector/page state.`);
