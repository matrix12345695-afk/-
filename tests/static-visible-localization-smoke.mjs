import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const failures = [];

// Every literal text node in the shipped page must either be wired to localization,
// be runtime-localized by the required-field helper, or be language-neutral brand/UI copy.
// This catches new visible English copy before it can quietly bypass the i18n dictionaries.
const neutralText = new Set(['InvoiceGuard', 'EN', 'RU', 'UZ', 'ES', 'DE', 'FR', 'PT']);
const runtimeLocalizedAttrs = ['data-required-label=', 'id="requiredFieldsTitle"'];
const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
const textNodes = [...withoutScripts.matchAll(/<([a-z][\w-]*)([^>]*)>([^<>]+)<\/\1>/gi)];

for (const match of textNodes) {
  const [, tag, attrs, rawText] = match;
  const text = rawText.replace(/\s+/g, ' ').trim();
  if (!text) continue;
  if (neutralText.has(text)) continue;
  // Numeric counters/amount placeholders are language-neutral and are replaced by runtime data.
  if (/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(text)) continue;
  if (/data-i18n(?:-aria)?=/.test(attrs)) continue;
  if (runtimeLocalizedAttrs.some((marker) => attrs.includes(marker))) continue;
  // Document title is localized by document-i18n.js and has dedicated parity coverage.
  if (tag.toLowerCase() === 'title') continue;
  failures.push(`<${tag}> literal visible copy is not localization-wired: ${JSON.stringify(text)}`);
}

// Meta description is also customer-facing even though it is not a text node.
const metaDescription = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
if (!metaDescription?.trim()) failures.push('meta description is missing or blank');
if (!html.includes('<script src="document-i18n.js"></script>')) failures.push('document-i18n.js is not loaded for title/meta localization');

if (failures.length) {
  console.error(`Static visible localization smoke failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(`Static visible localization smoke passed: ${textNodes.length} literal text nodes audited; no unguarded customer-visible copy.`);
