const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('audit-state.js', 'utf8');

function boot({ documentLang = 'en', activeLang, storage = () => null } = {}) {
  const elements = new Map();
  const makeElement = () => ({
    dataset: {},
    attributes: {},
    textContent: '',
    files: [],
    classList: { contains: () => true },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener() {},
  });

  for (const id of ['auditState', 'auditStateTitle', 'auditStateBody', 'file', 'demo', 'results', 'language']) {
    elements.set(id, makeElement());
  }

  const document = {
    documentElement: { lang: documentLang },
    getElementById(id) { return elements.get(id) || null; },
  };
  const window = {
    invoiceGuardI18n: activeLang ? { lang: activeLang } : undefined,
    addEventListener() {},
  };
  const localStorage = { getItem: storage };
  class MutationObserver {
    constructor(callback) { this.callback = callback; }
    observe() {}
  }

  vm.runInNewContext(source, { document, window, localStorage, MutationObserver });
  return { elements, window };
}

// If browser storage is blocked, the document language still keeps the status UI localized.
{
  const { elements, window } = boot({
    documentLang: 'ru',
    storage() { throw new Error('Storage access denied'); },
  });
  assert.equal(elements.get('auditStateTitle').textContent, 'Готово к проверке CSV со счетами');
  assert.match(elements.get('auditStateBody').textContent, /обрабатываются локально/);
  assert.equal(elements.get('auditState').attributes['aria-busy'], 'false');

  window.invoiceGuardAuditState.set('error');
  assert.equal(elements.get('auditState').dataset.state, 'error');
  assert.equal(elements.get('auditStateTitle').textContent, 'Не удалось проверить файл');
}

// The active app locale takes precedence over document and stored preferences.
{
  const { elements } = boot({
    documentLang: 'en',
    activeLang: 'fr',
    storage() { throw new Error('Storage access denied'); },
  });
  assert.equal(elements.get('auditStateTitle').textContent, 'Prêt à auditer un CSV de factures');
}

console.log('✓ audit status remains localized and functional when browser storage is unavailable');
