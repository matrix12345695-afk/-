import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const tests = readdirSync(here)
  .filter((name) => name !== 'run-all.mjs' && (name.endsWith('.test.js') || name.endsWith('-smoke.mjs')))
  .sort();

if (!tests.length) {
  console.error('No InvoiceGuard regression tests found.');
  process.exit(1);
}

let passed = 0;
for (const name of tests) {
  const path = join(here, name);
  console.log(`\n▶ ${relative(root, path)}`);
  const result = spawnSync(process.execPath, [path], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' },
  });

  if (result.error) {
    console.error(`Failed to start ${name}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`\n✗ ${name} failed with exit code ${result.status ?? 'unknown'}.`);
    process.exit(result.status || 1);
  }
  passed += 1;
}

console.log(`\n✓ InvoiceGuard regression suite passed (${passed}/${tests.length} files).`);
