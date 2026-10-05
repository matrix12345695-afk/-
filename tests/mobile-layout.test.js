const fs = require('node:fs');
const assert = require('node:assert/strict');

const css = fs.readFileSync('styles.css', 'utf8');

assert.match(css, /\.table-wrap\{[^}]*overflow-x:auto[^}]*-webkit-overflow-scrolling:touch[^}]*\}/, 'findings table must remain horizontally scrollable');
assert.match(css, /@media\(max-width:760px\)[\s\S]*\.export-actions\{[^}]*grid-template-columns:1fr[^}]*\}/, 'export actions must stack on mobile');
assert.match(css, /@media\(max-width:760px\)[\s\S]*\.rule-grid\{[^}]*grid-template-columns:1fr[^}]*\}/, 'audit rule fields must stack on mobile');
assert.match(css, /@media\(max-width:760px\)[\s\S]*\.mapping-panel label\{[^}]*grid-template-columns:1fr[^}]*\}/, 'mapping controls must stack on mobile');
assert.match(css, /@media\(max-width:760px\)[\s\S]*\.nav-actions select\{[^}]*min-height:44px[^}]*\}/, 'language selector must keep a mobile touch target');
assert.match(css, /@media\(max-width:760px\)[\s\S]*\.table-wrap\{[^}]*overscroll-behavior-inline:contain[^}]*\}/, 'mobile findings scroller must contain horizontal overscroll');
assert.match(css, /@media\(max-width:760px\)[\s\S]*\.table-wrap table\{[^}]*min-width:680px[^}]*\}/, 'mobile findings table must preserve readable columns instead of crushing them');

console.log('✓ mobile layout contract keeps controls usable and findings horizontally scrollable');
