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
  ['required-fields-live.js', /const copy=\{([\s\S]*?)\n  \};/],
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

// Required-field controls are visible accountant workflow copy but are localized by
// required-fields-live.js rather than data-i18n. Guard every label, not just locale presence.
const requiredSource = read('required-fields-live.js');
const requiredMatch = requiredSource.match(/const copy=(\{[\s\S]*?\n  \});/);
if (!requiredMatch) {
  failures.push('required-fields-live.js: localization dictionary could not be evaluated');
} else {
  const requiredContext = {};
  vm.createContext(requiredContext);
  vm.runInContext(`globalThis.__copy=${requiredMatch[1]};`, requiredContext);
  const requiredCopy = requiredContext.__copy;
  const requiredKeys = ['title', 'invoice_number', 'vendor', 'date', 'currency'];
  for (const locale of locales) {
    const dict = requiredCopy?.[locale];
    if (!dict) { failures.push(`required-fields-live.js: ${locale} dictionary missing`); continue; }
    for (const key of requiredKeys) {
      if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`required-fields-live.js: ${locale} missing ${key}`);
    }
  }
}

if (failures.length) {
  console.error(`Generated localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Generated localization smoke passed: audit/status copy and helper UI cover ${locales.length} locales.`);
