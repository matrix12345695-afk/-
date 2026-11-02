### C651 | 2026-11-03 02:01 Asia/Tashkent
- [x] Restored C650 and checked current GitHub main, open PR state, connected Floot publish snapshots, Shopify product/digital-delivery metadata and Paddle seller-support mail.
- [x] InvoiceGuard accessibility regression strengthened: tests/accessibility-contract.test.js now calculates WCAG relative luminance/contrast from the actual CSS palette and requires a 3:1 focus-indicator contrast against five real surfaces: light page **6.90:1**, light card **7.37:1**, dark page **11.81:1**, dark card **10.14:1**, dark audit **11.16:1**. It also asserts the shared 3px focus ring.
- [x] Updated RELEASE_CHECKLIST.md to identify this as a targeted source-level contrast regression, not a complete WCAG claim.
- [x] [PR #7](https://github.com/matrix12345695-afk/-/pull/7) merged to main at 16b0612576ee33a7b8186d33faf99df616b73c33.
- [x] Exact PR Actions [41524797724](https://github.com/matrix12345695-afk/-/actions/runs/41524797724) SUCCESS: **28/28 test files PASS**; inspected job steps/logs and confirmed the new measured-contrast contract executed. Test and checklist blobs were read back from main.
- [ ] A separate post-merge main Actions run was not returned by the PR-only workflow lookup. Manual keyboard-only, screen-reader, real Windows forced-colors and cross-browser acceptance remain open.
- [x] Paddle seller-support inbox rechecked: latest direct reply remains **2026-10-22**. Sherwin says the submitted Shopify domain ukuxbp-k1.myshopify.com was declined and explicitly asks the owner to re-upload https://leadforge-ai.floot.app. No newer direct response was found. Re-submission is owner-controlled; not performed.
- [x] Read-only Floot status confirms InvoiceGuard https://invoiceguard.floot.app (published 2026-10-06), Spreadsheet Doctor https://spreadsheet-doctor.floot.app (published 2026-09-28), and QualiSift AI https://leadforge-ai.floot.app (published 2026-10-05) remain public on the free plan, without custom domains. All three older releases have no recorded source digest/file count, so source parity remains unproven.
- [x] Shopify readback confirms QualiSift AI remains ACTIVE at USD 39 one-time with QualiSift-AI-v1.2.zip (4,243 bytes), no product media, last updated 2026-10-07. ZIP/source parity and buyer download verification remain open.
- [ ] Floot source/file actions are temporarily blocked by the fresh 100-actions/day limit response; reset is **2026-11-03 03:00 Asia/Tashkent**. Read-only publish-status polling still works. No publish or project mutation attempted.
- [ ] Commercial acceptance remains **0/7 sale-ready**. No live payments, KYC, banking, secrets, customer data, paid upgrades, domain changes, database migrations or public deployment were performed.
- **Next:** after the 03:00 Floot reset, inspect InvoiceGuard's current project tree/source and run targeted typecheck/tests before any publish; then compare hosted CSV upload/audit/export behavior with GitHub main. Continue Spreadsheet Doctor production XLSX acceptance after InvoiceGuard. Keep Paddle domain re-submission owner-controlled.

## C650 global keyboard focus and forced-colors contract — 2026-11-03
- [x] Added a shared focus-visible ring for all focusable controls, including the plain Privacy link and future controls without product-specific classes.
- [x] Added a dark-theme focus ring color and Windows forced-colors OS Highlight ring; existing high-contrast severity underlines/system-color borders remain.
- [x] Extended tests/accessibility-contract.test.js and RELEASE_CHECKLIST.md with source-contract coverage.
- [x] [PR #6](https://github.com/matrix12345695-afk/-/pull/6) squash-merged to main at e759095abd2395866a48f453d4685289d498b976.
- [x] Exact PR-head Actions [41515735235](https://github.com/matrix12345695-afk/-/actions/runs/41515735235) and independent post-merge main Actions [41515876279](https://github.com/matrix12345695-afk/-/actions/runs/41515876279) both SUCCESS: **28/28 test files PASS**; logs inspected.
- [ ] Manual keyboard-only, screen-reader, Windows forced-colors and cross-browser acceptance remain open. This is not a WCAG conformance claim.
- [ ] No Floot publish, hosted source parity, real buyer entitlement or commercial release is claimed.

## C648 accessibility contract regression — 2026-11-02
- [x] Added `tests/accessibility-contract.test.js` in [PR #5](https://github.com/matrix12345695-afk/-/pull/5), merged to `main` at `79dfa84089cd41162832bc60654eb1f8816bb477`.
- [x] Exact final PR-head Actions [41497925871](https://github.com/matrix12345695-afk/-/actions/runs/41497925871) passed on `6aa20d38aa41d8674e4838bc3b390fc7940ac6c1`: **28/28 test files PASS**. The new dependency-free test guards accessible names for primary buttons, wrapping labels for inputs, polite/atomic status regions, findings-table region/header semantics, localized mapping controls, and seven-language theme/language accessible-name behavior.
- [x] Added the automated source-contract gate to `RELEASE_CHECKLIST.md`; both files were read back from `main`.
- [ ] This does not close manual keyboard, screen-reader, high-contrast/forced-colors, browser, responsive or real-file QA. It is not a WCAG conformance claim. Hosted Floot parity, buyer entitlement and commercial release remain unverified.
- [ ] No separate post-merge `main` workflow run was returned by the PR-run lookup; only the exact tested PR head is claimed green.

## C645 post-merge verification — 2026-11-02
- [x] Independent post-merge main regression Actions [41451719467](https://github.com/matrix12345695-afk/-/actions/runs/41451719467) passed on merge commit 6202f2884377be830b98e7d45488e844e1782364.
- [x] Latest main regression Actions [41452122920](https://github.com/matrix12345695-afk/-/actions/runs/41452122920) passed on main 98b4108d908f6ac550b2f7ee0c033100893f8311; the test job and regression step succeeded. The follow-up status-documentation commit also passed Actions [41479168418](https://github.com/matrix12345695-afk/-/actions/runs/41479168418).
- [x] Exact-head Actions 41451589826 passed 27/27 test files. The independent main workflow result is now verified.
- [ ] These are source/CI checks only. Hosted Floot parity, browser acceptance, provider-signed buyer delivery, entitlement provisioning and commercial release remain unverified.

# InvoiceGuard status

## C645 verification — 2026-11-02
- [x] PR #4 merged to main at 6202f2884377be830b98e7d45488e844e1782364.
- [x] Exact-head Node 22 regression Actions 41451589826 passed; 27/27 test files PASS, including strict malformed-quote parser cases and localized EN/RU/UZ/ES/DE/FR/PT error-state tests.
- [x] Read back csv-core.js, csv-live.js, tests/csv-core.test.js and tests/csv-live-errors.test.js from main.
- [x] Parser rejects quotes inside unquoted values and non-whitespace text after a closing quote; it preserves physical line accounting through LF/CRLF/CR multiline values and accepts harmless surrounding whitespace.
- [x] Exact-head CI and independent post-merge main CI are verified. Floot publish, hosted browser acceptance, buyer entitlement and commercial release are not claimed.


## C643 verification — 2026-11-02
- [x] [PR #2](https://github.com/matrix12345695-afk/-/pull/2) merged to `main` at `2287941e6630b1d1c61d5d2b7d5971747d7ca48a`.
- [x] Exact-head Node 22 regression [Actions 41433732453](https://github.com/matrix12345695-afk/-/actions/runs/41433732453) passed; **26/26 test files PASS**, including the new storage-denied locale/status VM test.
- [x] Independent post-merge main [Actions 41434016961](https://github.com/matrix12345695-afk/-/actions/runs/41434016961) passed on the exact merge commit; **26/26 test files PASS**. Source and test were read back from main.
- [x] Fixed the status module's closing-brace syntax defect and made language resolution safe when browser localStorage is denied; active app locale is preserved, with document-language/English fallback.
- [ ] This is source/CI verification only. No Floot publish, hosted browser acceptance, live payment, buyer entitlement, or commercial release is claimed.

## Product
InvoiceGuard is a pre-payment invoice audit tool for small businesses and bookkeeping teams. It focuses on catching costly mistakes before money leaves the account, rather than competing as a generic OCR product.

## Floot / Paddle reconciliation
- [x] Public Floot InvoiceGuard project located and reconciled as a separate hosted prototype surface; GitHub `main` remains the source of truth for product/audit logic.
- [x] Paddle sandbox client-side token is configured in Floot without exposing it in source.
- [x] InvoiceGuard Pro sandbox price opens Paddle Checkout successfully from the Floot preview.
- [x] Paddle checkout action localized for EN/RU/UZ/ES/DE/FR/PT in the Floot prototype.
- [x] Sandbox checkout success URL now returns to a verified `/welcome` route in Floot.
- [x] Floot built-in analytics configured in privacy-conscious `memory` mode: session identity stays in memory only and is not persisted to device storage. Public Floot build republished after this change.
- [x] Floot activation instrumentation records `audit_completed` and `audit_results_exported` with aggregate counts, audit source and language only; invoice/vendor/file contents are not included. Typecheck passed and the public Floot build was republished after instrumentation.
- [x] Floot findings CSV export now localizes generated column headers, severity and finding text for EN/RU/UZ/ES/DE/FR/PT instead of leaking English into non-English exports; Floot typecheck passed and the public build was republished.
- [x] Privacy-safe Pro demand feedback added in EN/RU/UZ/ES/DE/FR/PT: one-click yes/maybe/not-yet responses emit only answer category and UI language through memory-only analytics; no invoice or contact data is collected. Floot typecheck passed and the public build was republished.
- [x] Floot now has a persistent Light/Dark/System theme control localized for EN/RU/UZ/ES/DE/FR/PT, an accounting-focused dark palette, and theme-safe upload surfaces. Floot typecheck and theme tests pass; public build verified published at `https://invoiceguard.floot.app`.
- [x] Public Floot project metadata now carries concise SMB pre-payment audit positioning for link/share/host surfaces; republish started after metadata update and public status remained verified.
- [x] Hosted audit-core drift is explicitly documented in `FLOOT_RECONCILIATION.md`; the Floot prototype must not be represented as equivalent to hardened GitHub `main` until its deployed audit path is reconciled and retested.
- [ ] Do not treat the Floot checkout prototype as production entitlement/provisioning. Server-side webhook verification and account entitlement require a Paddle webhook secret and a deliberate account/access model.
- [ ] Do not activate live payments until owner-only Paddle verification/KYC/domain approval is complete.

## Done
- [x] ProfitKit preserved on branch archive/profitkit
- [x] InvoiceGuard positioning and landing page
- [x] Browser-local CSV invoice upload
- [x] Hardened CSV parsing, international accounting numbers, duplicate normalization/cross-upload history, arithmetic/tax/currency/date/missing-field rules with regression coverage
- [x] Accountant-friendly findings, severity semantics, duplicate evidence, clean CSV/findings exports and pre-payment approval summary
- [x] Seven-language EN/RU/UZ/ES/DE/FR/PT localization across static UI, dynamic findings, generated copy and exports with automated parity checks
- [x] First-run onboarding and sample-data path with responsive Light/Dark styling
- [x] Accessible empty/loading/error/success audit workflow state; controlled malformed and empty CSV failures leave loading and enter localized error state
- [x] Light/Dark theme foundation with persistent preference and regression coverage
- [x] Mobile audit layout keeps findings horizontally scrollable, stacks dense controls and preserves touch targets with regression coverage
- [x] Dependency-free npm test/smoke runner and GitHub Actions regression workflow
- [x] Privacy/security documentation

## Roadmap to sellable MVP
Work strictly top to bottom unless a blocking regression requires an earlier fix.

### Phase 1 — Input reliability
- [x] Hardened live CSV core: BOM, delimiter detection, multiline quotes, escaped quotes, malformed rows and width mismatch
- [x] International number parsing and localized parser errors

### Phase 2 — Regression safety
- [x] CSV, duplicate, arithmetic, tax, currency, missing-field/date and export fixtures
- [x] Repeatable repository test command and CI-safe smoke runner

### Phase 3 — Audit quality
- [x] Payment-blocking/review severity policy
- [x] Duplicate evidence and previous-audit context
- [x] Currency/date sanity and configurable required-field policy
- [x] Accountant guidance for why findings matter and what to verify

### Phase 4 — Accountant-ready output
- [x] Concise approval summary, evidence settings/source/session, clean multilingual CSV and printable report

### Phase 5 — Complete localization (NOW)
- [x] Automated audit of visible/generated/exported strings and helper modules across EN/RU/UZ/ES/DE/FR/PT
- [ ] Verify EN/RU/UZ/ES/DE/FR/PT manually across empty, demo, error and results states

### Phase 6 — Product polish
- [x] Polish first-run onboarding and sample-data path
- [x] Add clear empty/loading/error/success states, including controlled CSV failure transitions
- [x] Finish mobile/table overflow behavior
- [ ] Accessibility pass: labels, keyboard flow, focus states, contrast and status announcements. Semantic relationships/status announcements and OS high-contrast/forced-colors support now have regression coverage; manual keyboard/contrast verification remains.
- [ ] FAQ/trust/privacy/conversion copy pass to Spreadsheet Doctor quality. Added responsive Light/Dark trust and FAQ surface with EN/RU/UZ/ES/DE/FR/PT copy covering local processing, human payment control, supported files and local duplicate history; broader conversion-copy review remains.
- [x] Remove placeholder/premature MVP wording from the primary audit surface; the localized badge now emphasizes private browser processing instead of product-development status, with a seven-language regression guard.

### Phase 7 — Commercial validation readiness
- [x] Add privacy-safe usage analytics without exposed secrets: Floot built-in analytics uses memory-only session identity, avoiding persistent analytics storage on the visitor device.
- [x] Define measurable activation event: `audit_completed` measures a successful non-empty audit and `audit_results_exported` measures the stronger results-export activation; payloads contain only aggregate counts, source (`sample`/`upload`) and UI language.
- [x] Add feedback/willingness-to-pay capture without activating payments: localized one-click Pro demand feedback records only answer category and UI language via memory-only analytics.
- [ ] Validate pricing and Pro feature demand with users
- [ ] Keep target Pro hypothesis ($29/month) provisional until validation

### Phase 8 — Release
- [ ] Run full smoke/regression pass on supported browsers/screen sizes
- [ ] Verify no mixed-language UI on all seven languages
- [ ] Verify sample and representative real-world CSV exports
- [ ] Deploy public MVP when hosting tools permit
- [ ] Verify the deployed build, not just the source repository
- [x] Freeze a release checklist and known limitations in STATUS.md. `RELEASE_CHECKLIST.md` is the release gate; current hosted limitation is that Floot remains a prototype with a smaller audit core than GitHub `main`.

## Frozen known limitations before sellable release
- The public Floot surface is **not yet audit-rule equivalent** to hardened GitHub `main`; it currently has a smaller in-page parser/auditor. Treat it as a hosted prototype until reconciliation and deployed regression verification are complete.
- CSV is the supported invoice input for the MVP. PDF/image ingestion is intentionally deferred until after validation.
- Cross-upload history is browser-local in the hardened GitHub build; there is no team/backend account history yet.
- The $29/month Pro price and Pro feature set are hypotheses pending customer validation.
- Paddle is sandbox-only. There is no production entitlement/account provisioning, and live activation remains owner-only.
- Manual seven-language, keyboard/contrast, supported-browser/screen-size and representative real-world CSV verification are still release gates even where automated regressions exist.

### Later, only after MVP validation
- [ ] PDF/image invoice ingestion
- [ ] Saved team history/backend accounts if customers require them
- [ ] Batch document workflows
- [ ] Payment integration only after product validation

## Definition of "ready for owner"
The technical MVP is ready to hand back only when the public build is verified, seven-language flows have no mixed-language defects, representative CSV edge cases pass, core audit rules have regression coverage, accountant exports are usable, mobile/accessibility smoke checks pass, and remaining tasks require owner-only commercial actions rather than product engineering.

## Owner-only actions — do not perform autonomously
- Payment activation or merchant onboarding
- KYC/banking details
- Secret/API-key entry
- Paid domain purchase/transfer
- Legal/tax/account ownership decisions

## Commercial direction
Free: limited CSV audit and downloadable findings.
Target Pro hypothesis: $29/month for saved audit history, batch documents, custom rules, vendor history, approval workflow and richer exports. Validate before payment activation.

## Recurring build rule
Choose the highest-value unfinished improvement in the roadmap that makes the tool safer, more useful, easier to validate, or more sellable. Keep main deployable. Never revert to ProfitKit. Never touch owner-only KYC, banking, secrets or paid domain actions.
