### C713 — 2026-11-05 15:05 Asia/Tashkent | QualiSift ecosystem coordination refresh
- [x] Recovered the current owned GitHub inventory and confirmed the active commercial products are InvoiceGuard (`matrix12345695-afk/-`) and Spreadsheet Doctor (`matrix12345695-afk/spreadsheet-doctor`); no dedicated owned QualiSift Platform repository is currently accessible.
- [x] Re-read InvoiceGuard C712/C707/C685 evidence and confirmed PR #16 remains open because the hosted Floot preview still fails the four-download parity gate.
- [x] Re-read Spreadsheet Doctor C699/C698 evidence and confirmed its production beta is technically hardened while manual device QA and owner-controlled provider purchase/refund/entitlement remain open.
- [x] Verified the existing QualiSift AI Shopify product is ACTIVE at USD 39 one-time.
- [x] Checked recent Gmail for Paddle/InvoiceGuard: no newer direct seller-support reply than 2026-10-22 was found; newer Paddle mail is marketing only.
- [x] Added `MASTER_PLAN.md` as the provisional QualiSift ecosystem coordination log. Product source remains isolated in its existing repository.
- [ ] Dedicated `QualiSift-Platform` repository creation remains pending because repository-creation access is not exposed by the current GitHub connector.

**Next:** after the Floot action reset, reconcile InvoiceGuard hosted preview files with GitHub `main`, fix only the missing hosted parity, rerun the four-download public browser gate, and keep PR #16 unmerged until the gate is green.

### C712 — 2026-11-05 09:00 Asia/Tashkent | Post-reset Floot preview verification
- [x] Recovered and confirmed the InvoiceGuard Floot project after the recorded 03:00 action-cap reset.
- [x] Floot TypeScript check: **clean**.
- [x] Floot Jasmine tests: **34/34 passed** across two batches (20 + 13); the second batch explicitly included useDebounce and useMediaQuery hook specs.
- [x] Read back current preview files: pages/_index.tsx, helpers/invoiceExports.tsx, helpers/csvExportSafety.tsx, helpers/invoiceDownload.tsx, and the associated parser/export/security tests. Current preview code covers formula-safe CSV cells, BOM + strict CRLF CSV output, localized findings headers, clean-invoice export, payment-review summary and download cleanup.
- [x] Added helpers/invoiceAudit.tsx and helpers/invoiceAudit.spec.tsx; the page now uses the shared audit helper for arithmetic tolerance, tax, currency allow-list, strict date/future-date, negative-tax, required-field and duplicate checks. RU/UZ/ES/DE/FR/PT finding translations were added.
- [x] Floot restore point created: InvoiceGuard audit rules parity (842b3fe0-c14d-4302-a10b-d5802ce4fa90).
- [ ] Current-preview browser acceptance is still open; this non-interactive run did not have an open Floot editor browser session to execute the DOM-level upload/download test.
- [ ] Public URL remains https://invoiceguard.floot.app, published 2026-10-06 10:15 UTC. The old public-preview run https://github.com/matrix12345695-afk/-/actions/runs/41719922197 failed 18 parity assertions; no publish was performed.
- [ ] Do not mark InvoiceGuard sale-ready until current-preview browser acceptance, audit-core parity and a separately verified public release pass.
- Paddle review: latest direct seller-support reply remains 2026-10-22; owner must re-upload https://leadforge-ai.floot.app for manual review. Not performed autonomously.

### C707 verification update — after documentation merge

- [x] InvoiceGuard documentation PR [#20](https://github.com/matrix12345695-afk/-/pull/20) merged at `60dbf511133b42eaee77aca892c62a7e0da273e4`; `STATUS.md`, `FLOOT_RECONCILIATION.md` and `RELEASE_CHECKLIST.md` were read back from `main`.
- [x] Follow-up regression [41913233049](https://github.com/matrix12345695-afk/-/actions/runs/41913233049) completed successfully; its raw log reports **31/31 regression files**. This is a newer run than PR #19's historical exact-head run [41759496282](https://github.com/matrix12345695-afk/-/actions/runs/41759496282), whose log reported **30/30**. Both runs passed; the counts are run-specific, not contradictory.
- [ ] Hosted preview remains unchanged and unaccepted: public run [41719922197](https://github.com/matrix12345695-afk/-/actions/runs/41719922197) still fails 18 parity assertions. No Floot edit or publish has occurred before the 03:00 action-cap reset.

### C707 — 2026-11-05 02:02 Asia/Tashkent | Source evidence corrected; hosted parity still blocked

- [x] Restored InvoiceGuard repository `matrix12345695-afk/-`, checked `main`, PR #16 and merged PR #19, and re-read the source status.
- [x] Confirmed PR [#19](https://github.com/matrix12345695-afk/-/pull/19) merged at `ee887fbd59831a9f80fc2d76937c534c219cae3a`.
- [x] Inspected exact-head regression run [41759496282](https://github.com/matrix12345695-afk/-/actions/runs/41759496282): job completed successfully; the raw log reports **30/30 regression files passed**. This corrects the PR description's earlier 31/31 count.
- [x] Inspected local-source browser run [41759496314](https://github.com/matrix12345695-afk/-/actions/runs/41759496314): Chromium acceptance completed successfully, including local upload, four exports and privacy boundary checks.
- [x] Re-read `index.html`, `findings-export-i18n.js`, `clean-export-live.js`, `summary-i18n.js` and `download-utils.js` from `main`. The source contains findings CSV (EN/RU), clean-invoice CSV and payment-review summary export paths; the shared download helper is loaded from source.
- [x] Re-read the failed public-preview job [41719922197](https://github.com/matrix12345695-afk/-/actions/runs/41719922197): upload and duplicate findings work, but only two findings downloads appear; the hosted build lacks safe formula neutralization, UTF-8 BOM, strict CRLF, localized filenames and the clean/summary exports. The 18 hosted assertions remain failed.
- [ ] PR [#16](https://github.com/matrix12345695-afk/-/pull/16) remains open and unmerged until the hosted preview passes the four-download acceptance gate.
- [ ] Floot file/build action cap resets at **2026-11-05 03:00 Asia/Tashkent**. No quota bypass or publish attempted before reset.
- [ ] No checkout, Paddle, KYC, banking, Shopify buyer-file or customer-data action performed.

**Next:** after 03:00, inspect the InvoiceGuard Floot project and live preview, compare every runtime asset with GitHub `main`, apply only the missing source changes, then rerun all 18 public-preview assertions. Do not publish until the hosted gate passes.

---

### C685 — shared browser download lifecycle | 2026-11-04
- [x] Added a shared, dependency-free download helper for InvoiceGuard CSV/TXT exports. It attaches the temporary anchor before click, removes it after the browser has accepted the download, and revokes the object URL on success or failure.
- [x] Routed findings CSV, clean-invoice CSV and payment-review TXT through the same lifecycle without changing their payloads, filenames, localization, BOM or line-ending contracts.
- [x] Added lifecycle regressions for successful ordering, anchor creation/attachment failure, click failure, timer failure and DOM-removal failure.
- [x] Exact-head GitHub Actions regression [41759496282](https://github.com/matrix12345695-afk/-/actions/runs/41759496282) passed (raw log: 30/30 regression files); local-source Chromium acceptance [41759496314](https://github.com/matrix12345695-afk/-/actions/runs/41759496314) passed before PR #19 merge.
- [ ] Floot hosted parity remains a separate release gate. No publish, live payment, KYC, banking, Paddle domain or Shopify buyer-file action was performed.
- **Next:** reconcile the published Floot project with GitHub main after the 2026-11-05 03:00 Asia/Tashkent action-cap reset; keep the hosted four-download gate open until all 18 assertions pass.

---

### C671 public Floot preview browser acceptance — 2026-11-03 22:24 Asia/Tashkent
- [x] Added a test-only Chromium acceptance path in [PR #16](https://github.com/matrix12345695-afk/-/pull/16). It uploads a synthetic three-invoice CSV containing a formula-like vendor value, verifies duplicate findings, downloads EN/RU findings CSVs, and checks that the synthetic marker is absent from request URLs and POST bodies.
- [x] The live preview at `https://invoiceguard.floot.app` accepted the synthetic CSV, reviewed 3 invoices and displayed 2 duplicate findings. The browser privacy check passed: no synthetic invoice marker was sent to the server, with Do Not Track enabled.
- [ ] Hosted Floot findings CSV is not in parity with GitHub `main`: the raw `=HYPERLINK(...)` vendor value remains executable in both EN and RU exports. Exact public browser run [41683698225](https://github.com/matrix12345695-afk/-/actions/runs/41683698225) reports `findingsFormulaSafe=false` and `russianFormulaSafe=false`.
- [ ] Hosted findings CSV has no UTF-8 BOM and uses LF rather than CRLF. Russian headers are localized, but both language exports use the same `invoiceguard-findings.csv` filename.
- [ ] The public preview exposes findings CSV only; clean-invoice CSV and summary exports are absent. Its published Floot release still has no source digest/file count, so exact source parity is unproven.
- [x] The existing GitHub unit/regression suite passed in run [41683698225](https://github.com/matrix12345695-afk/-/actions/runs/41683698225); the separate public-preview acceptance job failed on the hosted formula-injection finding. [PR #16](https://github.com/matrix12345695-afk/-/pull/16) remains open and intentionally unmerged.
- [ ] No Floot edit or publish was attempted because the daily file/build action cap remains until **2026-11-04 03:00 Asia/Tashkent**. No checkout, payment mode, merchant or customer-data action was taken.

**Next:** after the Floot action cap resets, compare the hosted InvoiceGuard project with GitHub `main`, apply the shared formula-cell sanitizer to the hosted findings export, add Excel-compatible BOM/CRLF, restore clean and summary exports, then rerun the public browser gate. Do not publish until the hosted gate is green.

---

### C668 findings CSV formula-injection hardening — 2026-11-03 19:02 Asia/Tashkent
- [x] Source review found that `findings-export-i18n.js` quoted user-derived cells but did not neutralize spreadsheet formula prefixes in invoice, vendor, finding or amount values.
- [x] Reused `InvoiceGuardCleanExport.safeCell` for every findings CSV cell; export now fails closed if the shared sanitizer is unavailable.
- [x] Added `tests/findings-export-security.test.js` for `=`, `@`, `+`, negative arithmetic payloads, valid negative amounts and missing-helper behavior. Updated both existing export VM harnesses to load the shared sanitizer in the same order as production.
- [x] Merged [PR #15](https://github.com/matrix12345695-afk/-/pull/15) at `6d97127a7fd6786c338df4d4275c168c440bf126`.
- [x] Exact PR-head Actions [41650773468](https://github.com/matrix12345695-afk/-/actions/runs/41650773468) and post-merge main Actions [41650914250](https://github.com/matrix12345695-afk/-/actions/runs/41650914250) both passed; inspected logs confirm **30/30 regression files**, including the new findings-export security test.
- [ ] This is GitHub source/CI evidence only. Hosted Floot parity and real public upload → audit → clean/findings export browser acceptance remain open; no hosted build or deployment changed.

### C667 CSV formula-injection hardening — 2026-11-03 17:58 Asia/Tashkent
- [x] Source review found that the clean invoice CSV export treated any value beginning with a minus sign followed by a digit as a safe negative amount; arithmetic payloads such as `-1+CMD()` could therefore pass through unescaped.
- [x] Hardened `clean-export.js`: the existing strict accounting-number parser now distinguishes valid negative monetary literals from non-numeric negative expressions. Formula-like expressions are prefixed with an apostrophe; valid Western/European grouped negative amounts remain unchanged. Leading whitespace, Unicode whitespace, tabs and BOM-aware formula prefixes are covered.
- [x] Merged [PR #13](https://github.com/matrix12345695-afk/-/pull/13) at `f0f0e7489e09c88970cd61a0f1290b63cee16e07`.
- [x] Exact PR Actions [41641047743](https://github.com/matrix12345695-afk/-/actions/runs/41641047743) and post-merge main Actions [41641114224](https://github.com/matrix12345695-afk/-/actions/runs/41641114224) both passed; inspected logs confirm **29/29 regression files**.
- [ ] This is source/CI security evidence only. Hosted Floot source parity and real public upload → audit → clean/findings export browser acceptance remain open; no hosted build or deployment changed.

### C666 InvoiceGuard parser-error UX regression — 2026-11-03 16:58 Asia/Tashkent
- [x] Source review found that `csv-live.js` showed a specific localized parser alert and set the accessible error state, after which `app.js` also showed a redundant generic “no rows” alert.
- [x] Merged [PR #11](https://github.com/matrix12345695-afk/-/pull/11) at `3ff8c258`, then refined the guard in [PR #12](https://github.com/matrix12345695-afk/-/pull/12) at `22b75b0aa016d62fee1de9e507f172c5a6157950`. A dedicated per-load flag is reset before each parse and set only when a specific localized parser/duplicate-header alert is shown; empty/header-only input retains generic no-rows guidance.
- [x] `tests/parser-error-alert.test.js` covers specific parser errors, empty/header-only guidance and stale-flag reset. `tests/csv-live-errors.test.js` covers the flag across malformed quotes, duplicate headers and header-only input.
- [x] Exact-head Node 22 Actions [41633777723](https://github.com/matrix12345695-afk/-/actions/runs/41633777723) passed; log confirms **29/29 regression files**.
- [x] Independent post-merge main Actions [41633855288](https://github.com/matrix12345695-afk/-/actions/runs/41633855288) passed on the final merge commit; log confirms **29/29 regression files** and executes the new regressions.
- [ ] Hosted Floot source parity, public upload/audit/export browser acceptance, buyer entitlement and commercial release remain separate open gates. These are source/VM tests, not browser acceptance.
- **Next:** after the recorded Floot action-cap reset, compare the hosted parser with GitHub `main` and run synthetic CSV upload/audit/export acceptance before any publish.

### C661 post-merge CI verification — 2026-11-03 12:04 Asia/Tashkent
- [x] Confirmed the C658 amount-parser code commit `6eebd386` has successful main Actions [41576029492](https://github.com/matrix12345695-afk/-/actions/runs/41576029492).
- [x] Confirmed the subsequent main status commit `f06cf7d` has successful Actions [41576141873](https://github.com/matrix12345695-afk/-/actions/runs/41576141873); inspected logs confirm **28/28 regression files PASS** and **39 numeric parser cases PASS**.
- [x] The C661 status-documentation commit `8bf37d4` also passed main Actions [41594706157](https://github.com/matrix12345695-afk/-/actions/runs/41594706157), with 28/28 regression files PASS.
- [ ] This closes only the GitHub source/CI gate. Floot hosted parity, public CSV upload/audit/export acceptance, buyer entitlement and commercial release remain open.
- **Next:** after the Floot action cap resets, compare the hosted parser with GitHub main and run synthetic CSV upload/audit/export acceptance before any publish.

### C658 InvoiceGuard accounting-number integrity — 2026-11-03
- [x] Found a financial-integrity defect in the previous converter: arbitrary characters and misplaced signs were stripped before parsing, allowing malformed source text to become a different amount.
- [x] Replaced permissive cleanup with fail-closed syntax validation. One currency symbol is accepted only at the start/end; supported decimal/grouping formats, spaces/apostrophes, accounting parentheses and a leading sign remain supported.
- [x] Embedded alphabetic text, multiple/misplaced currency symbols, malformed signs, repeated separators and invalid grouping now return `NaN` and stop the audit from silently changing the amount.
- [x] Expanded `tests/number-core.test.js` to 39 cases. [PR #9](https://github.com/matrix12345695-afk/-/pull/9) merged to `main` at `6eebd386202480be903792e2d0dd91bab39b069a`.
- [x] Exact PR Actions [41575925060](https://github.com/matrix12345695-afk/-/actions/runs/41575925060) passed **28/28 test files**; logs confirm `number-core: 39 regression cases passed`.
- [x] Independent post-merge main Actions [41576141873](https://github.com/matrix12345695-afk/-/actions/runs/41576141873) passed on main commit `f06cf7d`; inspected logs confirm **28/28 test files PASS** and `number-core: 39 regression cases passed`.
- [ ] Hosted Floot parity, public browser acceptance and commercial release remain open.
- **Next:** reconcile the hosted InvoiceGuard parser with this source after the Floot quota reset; do not publish until upload/audit/export evidence passes.

### C654 InvoiceGuard duplicate-header safety — 2026-11-03 05:02 Asia/Tashkent
- [x] Found and fixed a data-integrity defect: multiple CSV headers resolving to the same canonical invoice field (e.g. `total` and `amount_due`, or a custom mapping to an existing field) previously allowed later columns to overwrite earlier values.
- [x] `csv-live.js` now rejects duplicate canonical mappings before audit, marks the audit state as error, and shows localized `DUPLICATE_HEADER` copy in EN/RU/UZ/ES/DE/FR/PT.
- [x] Added seven-language regression coverage in `tests/csv-live-errors.test.js`.
- [x] [PR #8](https://github.com/matrix12345695-afk/-/pull/8) merged to `main` at `64ad3f567e99771ed8baaf0ce97ee06dace9af02`.
- [x] Exact PR Actions [41550408269](https://github.com/matrix12345695-afk/-/actions/runs/41550408269) and post-merge main Actions [41550459345](https://github.com/matrix12345695-afk/-/actions/runs/41550459345) both SUCCESS: **28/28 test files PASS**. Changed source and regression test were read back from main.
- [ ] Hosted Floot and public production browser acceptance remain separate release gates; this GitHub merge did not publish or alter checkout.
- **Next:** continue hosted parser parity and representative CSV upload/export browser acceptance after Floot quota reset.

### C653 hosted CSV amount hardening — 2026-11-03 03:57 Asia/Tashkent
- [x] Fixed financial CSV coercion in the hosted Floot InvoiceGuard parser: arbitrary letters and malformed separators can no longer be stripped into a different numeric value.
- [x] Currency symbols are allowed only at amount boundaries; malformed non-empty subtotal/tax/total cells now produce localized `INVALID_NUMBER` and stop the audit.
- [x] Added regression coverage for currency symbols, comma/dot decimal conventions, alphabetic contamination and malformed grouping.
- [x] Floot typecheck clean; targeted parser suite 1/1 PASS; full hosted suite 31/31 spec files PASS (20 + 11 batches, including both hook specs).
- [x] Floot restore checkpoint: `d11beca5-4015-4aa1-8488-39b16723dde8`.
- [ ] Browser screenshot, file upload/export smoke and production source parity remain unverified because no Floot editor/preview window is open. Production was not published; live URL remains on the 2026-10-06 release.
- [ ] Paddle seller-support still requires owner re-submission of `https://leadforge-ai.floot.app`; latest direct reply remains 2026-10-22.
- **Next:** browser smoke after preview tab is opened; then source-parity review before any publish.

### C652 hosted InvoiceGuard CSV hardening — 2026-11-03 03:02 Asia/Tashkent
- [x] Floot hosted project readback: added a dedicated strict CSV parser helper and 10 regression cases; page now rejects malformed quote placement, inconsistent row widths, unsupported file extensions and files above 10 MB, with localized EN/RU/UZ/ES/DE/FR/PT errors.
- [x] Floot typecheck clean; **31/31 spec files passed** across explicit batches.
- [x] Created restore checkpoint `1ab7c858-26b6-4d42-9acb-762121356ac6`.
- [ ] No Floot browser tab was open, so desktop/mobile screenshot and live upload/export smoke remain blocked. No publish was performed; production still points to the 2026-10-06 release with no source digest/file count.
- [ ] GitHub main and the hosted auth/Paddle prototype are separate source surfaces; source parity is not established. Paddle latest direct reply remains 2026-10-22 and domain re-submission remains owner-controlled.
- **Next:** preview browser smoke and source-parity decision before publish; then Spreadsheet Doctor production XLSX acceptance.

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


- Remaining UI parity: user-editable tolerance, max-tax and currency allow-list controls are not yet exposed; current preview uses safe defaults and existing required-field controls.


### C874 — 2026-11-13 | InvoiceGuard commercial contract merged

- [x] Recovered the current InvoiceGuard source state, PR #25, current preview evidence and fresh Paddle mailbox state before integration.
- [x] Verified PR #25 was limited to `tests/commercial-contract.mjs` and `package.json`, adding a deterministic UI/commercial contract without changing payment mode or runtime audit behavior.
- [x] Executed the contract in Node 22.23.4 against the current fetched source snapshot: **PASS** for the required commercial controls, 11 local script files, seven locales, browser-local/no-signup privacy contract and default `test`/`smoke` wiring.
- [x] PR #25 was mergeable and was squash-merged to `main` at `eca0849cb0a5c26d241a4145ad5490a590143bd3`.
- [x] This merge is source-level hardening only. It does **not** establish hosted four-export parity, native PostgreSQL/Kysely acceptance, live payment readiness or sale-ready status.
- [ ] Hosted four-export byte/network parity remains open.
- [ ] Native Kysely/PostgreSQL acceptance against the isolated QA target remains open.
- [ ] Manual browser/device/accessibility acceptance remains open.
- [ ] Paddle owner-controlled re-upload remains pending; no live payments, KYC, banking, secrets or owner-only action performed.

**Next:** use a browser-capable preview session to execute the InvoiceGuard four-export hosted acceptance; in parallel, obtain a credential-enabled isolated QA runtime for native Kysely persistence. Do not publish or mark sale-ready from source/VM evidence alone.
