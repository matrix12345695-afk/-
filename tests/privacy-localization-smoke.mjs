import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');
const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const requiredKeys = ['title', 'current', 'p1', 'p2', 'p3', 'boundaries', 'p4', 'p5', 'back'];
const failures = [];

const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('privacy.html inline localization script not found');
const dictionaryEnd = script.indexOf('\nconst saved=');
if (dictionaryEnd < 0) throw new Error('Could not isolate privacy localization dictionary');

const context = {};
vm.createContext(context);
vm.runInContext(`${script.slice(0, dictionaryEnd)};globalThis.__copy=copy;`, context, { filename: 'privacy.html' });
const copy = context.__copy;

for (const locale of locales) {
  const dict = copy?.[locale];
  if (!dict) { failures.push(`${locale}: privacy dictionary missing`); continue; }
  for (const key of requiredKeys) {
    if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`${locale}: privacy key ${key} missing or blank`);
  }
}

for (const locale of locales) {
  const elements = { back: { textContent: '' }, content: { innerHTML: '' } };
  const renderContext = {
    localStorage: { getItem: (key) => key === 'invoiceguard_lang' ? locale : null },
    document: { documentElement: { lang: 'en' }, title: '', getElementById: (id) => elements[id] || null },
  };
  vm.createContext(renderContext);
  vm.runInContext(script, renderContext, { filename: `privacy.html:${locale}` });
  const expected = copy[locale];
  if (renderContext.document.documentElement.lang !== locale) failures.push(`${locale}: document lang not applied`);
  if (renderContext.document.title !== `InvoiceGuard — ${expected.title}`) failures.push(`${locale}: localized document title not rendered`);
  if (elements.back.textContent !== expected.back) failures.push(`${locale}: localized back link not rendered`);
  for (const key of ['title', 'current', 'p1', 'p2', 'p3', 'boundaries', 'p4', 'p5']) {
    if (!elements.content.innerHTML.includes(expected[key])) failures.push(`${locale}: rendered privacy content missing ${key}`);
  }
}

if (failures.length) {
  console.error(`Privacy localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Privacy localization smoke passed: ${locales.length} locales × ${requiredKeys.length} strings plus rendered page state.`);
