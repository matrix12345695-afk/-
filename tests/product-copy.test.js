const fs=require('fs');
const assert=require('assert');
const vm=require('vm');

const source=fs.readFileSync('product-copy-i18n.js','utf8');
const langs=['en','ru','uz','es','de','fr','pt'];
const dict=Object.fromEntries(langs.map(lang=>[lang,{free:'placeholder'}]));
const context={window:{invoiceGuardI18n:{dict}}};
vm.runInNewContext(source,context);
for(const lang of langs){
  assert.notStrictEqual(dict[lang].free,'placeholder',`${lang} trust copy missing`);
  assert(!/mvp/i.test(dict[lang].free),`${lang} exposes premature MVP wording`);
}
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('<script src="i18n.js"></script><script src="product-copy-i18n.js"></script>'),'product copy must load immediately after base i18n');
assert(!html.includes('data-i18n="free">Free MVP<'),'visible fallback must not expose MVP wording');
console.log('✓ product trust copy is localized and avoids premature MVP positioning');
