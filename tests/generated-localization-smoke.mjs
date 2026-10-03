import fs from 'node:fs';
import vm from 'node:vm';

const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const failures = [];
const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

// app.js owns generated audit/status/finding copy that is not represented by data-i18n.
// Execute only the dictionary declaration so this test stays independent of the DOM.
const app = read('app.js');
const dynamicEnd = app.indexOf(';\nconst lang=');
if (dynamicEnd < 0) throw new Error('Could not isolate app.js dynamic localization dictionary');
const appContext = {};
vm.createContext(appContext);
vm.runInContext(`${app.slice(0, dynamicEnd + 1)};globalThis.__dynamic=dynamic;`, appContext);
const dynamic = appContext.__dynamic;
const dynamicKeys = Object.keys(dynamic.en || {});
for (const locale of locales) {
  const dict = dynamic[locale];
  if (!dict) { failures.push(`app.js: ${locale} dictionary missing`); continue; }
  for (const key of dynamicKeys) {
    if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`app.js: ${locale} missing generated key ${key}`);
  }
}

// Small generated-copy modules can otherwise bypass the main DOM localization smoke.
const moduleChecks = [
  ['print-report.js', /const labels=\{([\s\S]*?)\n  \};/],
  ['document-i18n.js', /const copy=\{([\s\S]*?)\n\};/],
  ['mapping-i18n.js', /const copy=\{([\s\S]*?)\n  \};/],
  ['localization-edge-live.js', /const unknownCurrency=\{([\s\S]*?)\n  \};/],
];
for (const [name, pattern] of moduleChecks) {
  const source = read(name);
  const body = source.match(pattern)?.[1] || '';
  if (!body) { failures.push(`${name}: localization dictionary not found`); continue; }
  for (const locale of locales) {
    const localePattern = new RegExp(`(?:^|[,\\n]\\s*)${locale}\\s*:`);
    if (!localePattern.test(body)) failures.push(`${name}: ${locale} generated copy missing`);
  }
}

if (failures.length) {
  console.error(`Generated localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Generated localization smoke passed: audit/status copy and helper UI cover ${locales.length} locales.`);
