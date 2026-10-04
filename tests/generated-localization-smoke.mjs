import fs from 'node:fs';
import vm from 'node:vm';

const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const failures = [];
const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const placeholders = value => [...String(value).matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(m => m[1]).sort().join(',');

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
  const localeKeys = Object.keys(dict);
  for (const key of dynamicKeys) {
    if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`app.js: ${locale} missing generated key ${key}`);
    if (placeholders(dict[key]) !== placeholders(dynamic.en[key])) failures.push(`app.js: ${locale}.${key} placeholder mismatch (${placeholders(dict[key]) || 'none'} vs ${placeholders(dynamic.en[key]) || 'none'})`);
  }
  for (const key of localeKeys) {
    if (!dynamicKeys.includes(key)) failures.push(`app.js: ${locale} has orphan generated key ${key}`);
  }
}

// Small generated-copy modules can otherwise bypass the main DOM localization smoke.
const moduleChecks = [
  ['print-report.js', /const labels=\{([\s\S]*?)\n  \};/],
  ['document-i18n.js', /const copy=\{([\s\S]*?)\n\};/],
  ['mapping-i18n.js', /const copy=\{([\s\S]*?)\n  \};/],
  ['localization-edge-live.js', /const unknownCurrency=\{([\s\S]*?)\n  \};/],
  ['required-fields-live.js', /const copy=\{([\s\S]*?)\n  \};/],
  ['summary-i18n.js', /const copy=\{([\s\S]*?)\n\};/],
  ['finding-guidance-live.js', /const generic=\{([\s\S]*?)\};const base=/],
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
  const requiredKeys = Object.keys(requiredCopy?.en || {});
  for (const locale of locales) {
    const dict = requiredCopy?.[locale];
    if (!dict) { failures.push(`required-fields-live.js: ${locale} dictionary missing`); continue; }
    for (const key of requiredKeys) {
      if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`required-fields-live.js: ${locale} missing ${key}`);
      if (placeholders(dict[key]) !== placeholders(requiredCopy.en[key])) failures.push(`required-fields-live.js: ${locale}.${key} placeholder mismatch`);
    }
    for (const key of Object.keys(dict)) {
      if (!requiredKeys.includes(key)) failures.push(`required-fields-live.js: ${locale} has orphan key ${key}`);
    }
  }
}

// Detailed per-rule guidance is the accountant's action copy. It lives separately from the
// live generic fallback, so require every rule present in English to exist in every locale.
const detailedGuidanceSource = read('finding-guidance.js');
const detailedGuidanceMatch = detailedGuidanceSource.match(/const G=(\{[\s\S]*?\});\s*function/);
if (!detailedGuidanceMatch) {
  failures.push('finding-guidance.js: detailed guidance dictionary could not be evaluated');
} else {
  const detailedContext = {};
  vm.createContext(detailedContext);
  vm.runInContext(`globalThis.__copy=${detailedGuidanceMatch[1]};`, detailedContext);
  const detailedCopy = detailedContext.__copy;
  const detailedKeys = Object.keys(detailedCopy?.en || {});
  for (const locale of locales) {
    const dict = detailedCopy?.[locale];
    if (!dict) { failures.push(`finding-guidance.js: ${locale} dictionary missing`); continue; }
    for (const key of detailedKeys) {
      if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`finding-guidance.js: ${locale} missing ${key}`);
      if (placeholders(dict[key]) !== placeholders(detailedCopy.en[key])) failures.push(`finding-guidance.js: ${locale}.${key} placeholder mismatch`);
    }
    for (const key of Object.keys(dict)) {
      if (!detailedKeys.includes(key)) failures.push(`finding-guidance.js: ${locale} has orphan key ${key}`);
    }
  }
}

// Finding guidance is appended after rendering and can otherwise silently fall back to English.
// Evaluate the whole dictionary so every supported locale must have non-empty, placeholder-safe copy.
const guidanceSource = read('finding-guidance-live.js');
const guidanceMatch = guidanceSource.match(/const generic=(\{[\s\S]*?\});const base=/);
if (!guidanceMatch) {
  failures.push('finding-guidance-live.js: guidance dictionary could not be evaluated');
} else {
  const guidanceContext = {};
  vm.createContext(guidanceContext);
  vm.runInContext(`globalThis.__copy=${guidanceMatch[1]};`, guidanceContext);
  const guidanceCopy = guidanceContext.__copy;
  for (const locale of locales) {
    if (typeof guidanceCopy?.[locale] !== 'string' || !guidanceCopy[locale].trim()) failures.push(`finding-guidance-live.js: ${locale} guidance missing`);
    if (placeholders(guidanceCopy?.[locale]) !== placeholders(guidanceCopy?.en)) failures.push(`finding-guidance-live.js: ${locale} guidance placeholder mismatch`);
  }
  for (const locale of Object.keys(guidanceCopy || {})) {
    if (!locales.includes(locale)) failures.push(`finding-guidance-live.js: unsupported locale ${locale}`);
  }
}

// Approval summary is a customer-facing artifact. Require every locale to carry the
// same complete key set so a future added decision/export label cannot leak English.
const summarySource = read('summary-i18n.js');
const summaryMatch = summarySource.match(/const copy=(\{[\s\S]*?\n\});/);
if (!summaryMatch) {
  failures.push('summary-i18n.js: localization dictionary could not be evaluated');
} else {
  const summaryContext = {};
  vm.createContext(summaryContext);
  vm.runInContext(`globalThis.__copy=${summaryMatch[1]};`, summaryContext);
  const summaryCopy = summaryContext.__copy;
  const summaryKeys = Object.keys(summaryCopy?.en || {});
  for (const locale of locales) {
    const dict = summaryCopy?.[locale];
    if (!dict) { failures.push(`summary-i18n.js: ${locale} dictionary missing`); continue; }
    for (const key of summaryKeys) {
      if (typeof dict[key] !== 'string' || !dict[key].trim()) failures.push(`summary-i18n.js: ${locale} missing ${key}`);
      if (placeholders(dict[key]) !== placeholders(summaryCopy.en[key])) failures.push(`summary-i18n.js: ${locale}.${key} placeholder mismatch`);
    }
    for (const key of Object.keys(dict)) {
      if (!summaryKeys.includes(key)) failures.push(`summary-i18n.js: ${locale} has orphan key ${key}`);
    }
  }
}

if (failures.length) {
  console.error(`Generated localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Generated localization smoke passed: audit/status, approval/export, detailed finding guidance and helper UI cover ${locales.length} locales with key/placeholder parity.`);
