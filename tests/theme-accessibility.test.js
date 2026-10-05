const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'theme.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

// The theme bootstrap must run before the stylesheet to avoid a light-theme flash.
assert.ok(html.indexOf('<script src="theme.js"></script>') < html.indexOf('<link rel="stylesheet" href="styles.css">'));
assert.match(html, /id="themeToggle"[^>]*aria-label="[^"]+"[^>]*aria-pressed="false"/);

// Preference must be local-only, persistent, and fall back to the OS preference.
assert.match(theme, /invoiceguard_theme/);
assert.match(theme, /localStorage\.getItem\(KEY\)/);
assert.match(theme, /localStorage\.setItem\(KEY,theme\)/);
assert.match(theme, /prefers-color-scheme:\s*dark/);
assert.match(theme, /addEventListener\('change'/);
assert.match(theme, /aria-pressed/);

// Accessibility label coverage must match every supported product locale.
for (const locale of ['en', 'ru', 'uz', 'es', 'de', 'fr', 'pt']) {
  assert.match(theme, new RegExp(`${locale}\\s*:`), `missing theme label for ${locale}`);
}

// Both modes must cover core audit surfaces and keyboard focus, including mobile behavior.
for (const selector of ['body', '.audit', '.card', 'table', '.drop', '.rules', '.mapping-panel', '.stats div', '.secondary', '.linkbtn', '.cta']) {
  assert.ok(css.includes(`html[data-theme=dark] ${selector}`), `dark theme missing ${selector}`);
}
assert.match(css, /:focus-visible/);
assert.match(css, /@media\(max-width:760px\)/);
assert.match(css, /color-scheme/);

console.log('theme/accessibility regression checks passed');
