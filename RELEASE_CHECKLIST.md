# InvoiceGuard release verification checklist

Use this checklist before calling a build sellable, published, or ready for owner handoff. GitHub `main` remains the source of truth. Never substitute `archive/profitkit` for InvoiceGuard.

## Automated gate
- [ ] `npm test` passes on the exact release commit.
- [ ] `npm run smoke` passes on the exact release commit.
- [ ] GitHub Actions regression workflow is green for the exact release commit.
- [ ] No secrets, merchant credentials, invoice contents, vendor names, invoice numbers, or filenames are added to analytics payloads.

## Seven-language UI gate
Check EN, RU, UZ, ES, DE, FR and PT independently.
- [ ] Empty state contains no mixed-language copy.
- [ ] Sample audit contains no mixed-language copy.
- [ ] Malformed/empty CSV error states contain no mixed-language copy.
- [ ] Successful results, findings, severity labels and guidance contain no mixed-language copy.
- [ ] Mapping, required-field controls, rule feedback and history feedback contain no mixed-language copy.
- [ ] Findings CSV, clean CSV, approval summary and printable report use the selected language where copy is generated.
- [ ] Document title/description and accessibility labels follow the selected language where supported.

## Audit correctness gate
- [ ] Quoted commas, multiline values, escaped quotes, BOM and supported delimiters parse correctly.
- [ ] International decimal/thousands formats do not silently change invoice value.
- [ ] Duplicate normalization catches formatting variants without merging materially different invoices.
- [ ] Cross-upload duplicate history works and can be cleared locally.
- [ ] Arithmetic tolerance, tax-rate, currency, date and required-field rules produce expected severity and evidence.
- [ ] Representative clean invoices produce no false payment-blocking finding.
- [ ] Representative problematic invoices produce actionable accountant guidance.

## Browser and responsive gate
- [ ] Desktop Chromium: upload, sample, rules, findings, exports, language and theme flows work.
- [ ] Desktop Firefox: core audit and export flows work.
- [ ] Desktop Safari/WebKit where available: core audit and export flows work.
- [ ] Mobile width around 360 px: no clipped primary controls; findings remain horizontally usable.
- [ ] Tablet width around 768 px: controls and tables remain readable.
- [ ] Light, Dark and System modes render every state with readable contrast.
- [ ] System mode follows OS theme changes while selected and preserves the user's theme preference.

## Accessibility gate
- [ ] Entire primary audit flow is usable by keyboard with a visible focus indicator.
- [ ] File input, language, theme, rules, mapping and export controls have meaningful accessible names.
- [ ] Empty/loading/error/success and rule/history feedback are announced without disruptive repetition.
- [ ] Findings table has usable headers and a keyboard-accessible horizontal region.
- [ ] High-contrast/forced-colors mode preserves controls, focus and severity meaning without relying on color alone.

## Privacy and trust gate
- [ ] Product copy accurately states that CSV audit processing is browser-local for the current build.
- [ ] Product does not imply that it autonomously approves, rejects or sends payments.
- [ ] Supported input limitations are stated accurately; do not imply PDF/image ingestion before it exists.
- [ ] Local duplicate history behavior and clear-history control are understandable.
- [ ] Privacy/security page matches actual product behavior.

## Hosted-build gate
- [ ] Reconcile hosted Floot behavior against GitHub `main`; record intentional prototype-only differences in `STATUS.md`.
- [ ] Publish only through an available authorized hosting path.
- [ ] Open the public URL after publication and verify the deployed build, not merely source or preview state.
- [ ] Recheck sample audit, one upload, one export, all seven language selectors and Light/Dark/System on the public build.
- [ ] Record the verified public URL and release commit in `STATUS.md`.

## Payments
- [ ] Sandbox checkout may be tested only with non-secret owner setup already available.
- [ ] Never call a client-side checkout prototype production entitlement/provisioning.
- [ ] Live payments remain off until owner completes provider verification, KYC/banking, domain approval and deliberate entitlement design.

## Known current limitations
- CSV invoice exports are the supported audit input. PDF/image ingestion is later work.
- Cross-upload history is local to the browser/device; it is not shared team history.
- InvoiceGuard is a review aid. An accountant or other authorized reviewer remains responsible for the payment decision.
- Floot checkout is a sandbox/prototype surface until server-side webhook verification and an account/entitlement model exist.
