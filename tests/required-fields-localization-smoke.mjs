import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../i18n.js', import.meta.url), 'utf8');
const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const requiredKeys = ['requiredFields', 'requiredInvoiceNumber', 'requiredVendor', 'requiredDate', 'requiredCurrency'];

const sandbox = {
  localStorage: { getItem(){ return null; }, setItem(){} },
  navigator: { language: 'en' },
  document: {
    addEventListener(){},
    querySelectorAll(){ return []; },
    getElementById(){ return null; },
    documentElement: { lang: 'en' }
  },
  window: {}
};
sandbox.window.window = sandbox.window;
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.navigator = sandbox.navigator;
sandbox.window.document = sandbox.document;
vm.runInNewContext(source, sandbox);

const dict = sandbox.window.invoiceGuardI18n?.dict;
assert.ok(dict, 'primary localization dictionary must be exposed');
assert.deepEqual(Object.keys(dict).sort(), [...locales].sort(), 'required-field UI must support exactly the product locales');

for (const locale of locales) {
  for (const key of requiredKeys) {
    assert.equal(typeof dict[locale][key], 'string', `${locale}.${key} must be text`);
    assert.ok(dict[locale][key].trim(), `${locale}.${key} must not be empty`);
    if (locale !== 'en') {
      assert.notEqual(dict[locale][key], dict.en[key], `${locale}.${key} must not silently fall back to English`);
    }
  }
}

console.log('✓ required-field controls are fully localized in the primary EN/RU/UZ/ES/DE/FR/PT contract');
