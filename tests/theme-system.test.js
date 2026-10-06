const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('theme.js', 'utf8');

assert.match(source, /\['system','light','dark'\]/, 'theme preference must support system, light and dark');
assert.match(source, /pref==='system'\?systemTheme\(\):pref/, 'system preference must resolve from OS color scheme');
assert.match(source, /current==='system'\?'dark':current==='dark'\?'light':'system'/, 'theme button must cycle system → dark → light → system');
assert.match(source, /if\(saved\(\)==='system'\)apply\('system'\)/, 'OS theme changes must update only while system preference is active');
assert.match(source, /button\.removeAttribute\('aria-pressed'\)/, 'three-state theme control must not expose binary aria-pressed semantics');
for (const lang of ['en','ru','uz','es','de','fr','pt']) {
  assert.match(source, new RegExp(`${lang}:\\{system:`), `${lang} must localize the system theme state`);
}

console.log('theme-system regression: ok');
