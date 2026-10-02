import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('privacy.html inline localization script not found');

const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt'];
const failures = [];
for (const locale of locales) {
  const elements = new Map([['back', { textContent: '' }], ['content', { innerHTML: '' }]]);
  const document = {
    documentElement: { lang: 'en' },
    title: '',
    getElementById(id) { return elements.get(id) ?? null; },
  };
  const context = {
    document,
    localStorage: { getItem: key => key === 'invoiceguard_lang' ? locale : null, setItem() {} },
  };
  vm.createContext(context);
  try {
    vm.runInContext(script, context, { filename: `privacy.html:${locale}` });
  } catch (error) {
    failures.push(`${locale}: ${error.message}`);
    continue;
  }
  if (document.documentElement.lang !== locale) failures.push(`${locale}: html lang not applied`);
  if (!document.title || /undefined/.test(document.title)) failures.push(`${locale}: localized title missing`);
  if (!elements.get('back').textContent.trim()) failures.push(`${locale}: back label missing`);
  const rendered = elements.get('content').innerHTML;
  if (!rendered.trim() || /undefined/.test(rendered)) failures.push(`${locale}: privacy content incomplete`);
  if ((rendered.match(/<h2>/g) || []).length !== 2 || (rendered.match(/<p>/g) || []).length !== 5) failures.push(`${locale}: expected 2 sections and 5 paragraphs`);
}

if (failures.length) {
  console.error(`Privacy localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Privacy localization smoke passed: ${locales.length} locales.`);
