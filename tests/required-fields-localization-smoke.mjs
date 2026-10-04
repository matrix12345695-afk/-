import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../required-fields-live.js', import.meta.url), 'utf8');
const match = source.match(/const copy=(\{[\s\S]*?\n  \});\n  const readSaved/);
assert.ok(match, 'required-field localization dictionary must remain discoverable');

const copy = vm.runInNewContext(`(${match[1]})`);
const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
assert.deepEqual(Object.keys(copy).sort(), [...locales].sort(), 'required-field UI must support exactly the product locales');

const englishKeys = Object.keys(copy.en).sort();
assert.deepEqual(englishKeys, ['currency', 'date', 'invoice_number', 'title', 'vendor'].sort());
for (const locale of locales) {
  assert.deepEqual(Object.keys(copy[locale]).sort(), englishKeys, `${locale} required-field keys must match EN`);
  for (const key of englishKeys) {
    assert.equal(typeof copy[locale][key], 'string', `${locale}.${key} must be text`);
    assert.ok(copy[locale][key].trim(), `${locale}.${key} must not be empty`);
    if (locale !== 'en') assert.notEqual(copy[locale][key], copy.en[key], `${locale}.${key} must not silently fall back to English`);
  }
}

console.log('✓ required-field controls are fully localized in EN/RU/UZ/ES/DE/FR/PT');
