const fs=require('fs');
const assert=require('assert');
const source=fs.readFileSync('product-copy-i18n.js','utf8');
const languages=['en','ru','uz','es','de','fr','pt'];
for(const lang of languages){
  assert.match(source,new RegExp(`\\b${lang}:\\{title:`),`missing trust/FAQ copy for ${lang}`);
}
for(const key of ['localBody','humanBody','faq','q1','a1','q2','a2','q3','a3']){
  const matches=source.match(new RegExp(`${key}:`,'g'))||[];
  assert.strictEqual(matches.length,7,`${key} must exist for all seven languages`);
}
assert.match(source,/invoiceGuardI18n/);
assert.match(source,/getElementById\('language'\).*addEventListener\('change'/s);
assert.match(source,/aria-labelledby','trustFaqTitle'/);
console.log('trust/FAQ localization contract: ok');
