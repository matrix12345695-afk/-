const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'theme.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

// The theme bootstrap must run before the stylesheet to avoid a light-theme flash.
assert.ok(html.indexOf('<script src="theme.js"></script>') < html.indexOf('<link rel="stylesheet" href="styles.css">'));
assert.match(html, /id="themeToggle"[^>]*aria-label="[^"]+"/);

// Preference must be local-only, persistent, support System/Light/Dark, and resolve System from the OS.
assert.match(theme, /invoiceguard_theme/);
assert.match(theme, /localStorage\.getItem\(KEY\)/);
assert.match(theme, /localStorage\.setItem\(KEY,pref\)/);
assert.match(theme, /\['system','light','dark'\]/);
assert.match(theme, /prefers-color-scheme:\s*dark/);
assert.match(theme, /addEventListener\('change'/);
assert.match(theme, /button\.removeAttribute\('aria-pressed'\)/);

// Accessibility label coverage must match every supported product locale.
for (const locale of ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt']) {
  assert.match(theme, new RegExp(`${locale}\\s*:\\{system:`), `missing three-state theme label for ${locale}`);
}

// Core audit controls must expose useful relationships and status updates to assistive tech.
assert.match(html, /id="file"[^>]*aria-describedby="auditBody"[^>]*aria-controls="results"/);
assert.match(html, /id="demo"[^>]*type="button"[^>]*aria-controls="results"/);
assert.match(html, /id="historyStatus"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
assert.match(html, /id="ruleStatus"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
assert.match(html, /class="table-wrap"[^>]*tabindex="0"[^>]*role="region"[^>]*aria-labelledby="findingsTitle"/);
assert.equal((html.match(/<th scope="col"/g) || []).length, 6, 'all findings headers must identify column scope');
for (const id of ['clearHistory', 'applyRules', 'applyMapping', 'downloadSummary', 'downloadClean', 'download']) {
  assert.match(html, new RegExp(`id="${id}"[^>]*type="button"`), `${id} must not implicitly submit a form`);
}

// Both modes must cover core audit surfaces and keyboard focus, including mobile behavior.
for (const selector of ['body', '.audit', '.card', 'table', '.drop', '.rules', '.mapping-panel', '.stats div', '.secondary', '.linkbtn', '.cta']) {
  assert.ok(css.includes(`html[data-theme=dark] ${selector}`), `dark theme missing ${selector}`);
}
assert.match(css, /:focus-visible/);
assert.match(css, /@media\(max-width:760px\)/);
assert.match(css, /color-scheme/);

// Respect OS/browser contrast modes instead of relying on product colors alone.
assert.match(css, /@media\(prefers-contrast:more\)/);
assert.match(css, /@media\(forced-colors:active\)/);
assert.match(css, /forced-color-adjust:auto/);
assert.match(css, /outline:3px solid Highlight/);

console.log('theme/accessibility regression checks passed');
