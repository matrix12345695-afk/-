import fs from 'node:fs';
import vm from 'node:vm';

const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const failures = [];
const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const placeholders = (value) => [...String(value).matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((m) => m[1]).sort().join(',');

function evaluateObject(name, pattern, label) {
  const source = read(name);
  const match = source.match(pattern);
  if (!match) {
    failures.push(`${name}: ${label} dictionary could not be isolated`);
    return null;
  }
  const context = {};
  vm.createContext(context);
  vm.runInContext(`globalThis.__copy=${match[1]};`, context);
  return context.__copy;
}

function checkNested(name, copy) {
  if (!copy?.en || typeof copy.en !== 'object') {
    failures.push(`${name}: English baseline dictionary missing`);
    return;
  }
  const baseline = Object.keys(copy.en).sort();
  for (const locale of locales) {
    const dict = copy[locale];
    if (!dict || typeof dict !== 'object') {
      failures.push(`${name}: ${locale} dictionary missing`);
      continue;
    }
    const keys = Object.keys(dict).sort();
    if (keys.join('|') !== baseline.join('|')) failures.push(`${name}: ${locale} key set differs from English`);
    for (const key of baseline) {
      if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`${name}: ${locale}.${key} is empty or missing`);
      if (placeholders(dict[key]) !== placeholders(copy.en[key])) failures.push(`${name}: ${locale}.${key} placeholder mismatch`);
    }
  }
  for (const locale of Object.keys(copy)) {
    if (!locales.includes(locale)) failures.push(`${name}: unsupported locale ${locale}`);
  }
}

function checkScalar(name, copy) {
  if (typeof copy?.en !== 'string' || !copy.en.trim()) {
    failures.push(`${name}: English baseline string missing`);
    return;
  }
  for (const locale of locales) {
    if (typeof copy[locale] !== 'string' || !copy[locale].trim()) failures.push(`${name}: ${locale} string missing`);
    if (placeholders(copy[locale]) !== placeholders(copy.en)) failures.push(`${name}: ${locale} placeholder mismatch`);
  }
  for (const locale of Object.keys(copy)) {
    if (!locales.includes(locale)) failures.push(`${name}: unsupported locale ${locale}`);
  }
}

// These helper modules render customer-visible copy outside the main data-i18n surface.
// Validate complete locale/key parity so future additions cannot silently fall back to English.
checkNested(
  'document-i18n.js',
  evaluateObject('document-i18n.js', /const copy=(\{[\s\S]*?\n\});/, 'document metadata'),
);
checkNested(
  'mapping-i18n.js',
  evaluateObject('mapping-i18n.js', /const copy=(\{[\s\S]*?\n  \});/, 'mapping UI'),
);
checkScalar(
  'print-report.js',
  evaluateObject('print-report.js', /const labels=(\{[\s\S]*?\n  \});/, 'print action'),
);

if (failures.length) {
  console.error(`Helper localization parity smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(`Helper localization parity smoke passed: document metadata, mapping UI and print action cover ${locales.length} locales without key/placeholder drift.`);
