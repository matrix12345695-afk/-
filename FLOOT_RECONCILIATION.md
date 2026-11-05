### C712 post-reset Floot preview verification — 2026-11-05 09:00 Asia/Tashkent

- **Current Floot preview:** mcp__Floot__typecheck returned clean; mcp__Floot__run_tests passed all 34/34 Jasmine spec files across two batches (20 + 13). The second batch includes the two hook specs.
- **Current preview implementation readback:** the page imports the shared invoiceExports and invoiceDownload helpers; invoiceExports uses the shared formula-safe cell sanitizer and emits UTF-8 BOM + strict CRLF for CSV. Its tests cover localized findings, clean-invoice CSV and payment-review TXT. The download helper tests cover anchor lifecycle and URL cleanup.
- **Audit-core parity improvement:** added helpers/invoiceAudit.tsx and helpers/invoiceAudit.spec.tsx; pages/_index.tsx now uses the helper. It covers 0.02 arithmetic tolerance, 30% tax threshold, default currency allow-list with normalization, strict/ambiguous/future date handling, negative tax, required-field policy and local duplicate history. Seven-language messages were added for the new findings. Floot checkpoint: 842b3fe0-c14d-4302-a10b-d5802ce4fa90.
- **Remaining UI parity:** the preview does not yet expose user-editable tolerance, max-tax or currency allow-list controls; it uses defaults plus the existing required-field controls.
- **Important scope:** these are current unpublished preview results. No current-preview browser DOM/upload/download acceptance was run because no Floot editor browser session was open in this non-interactive cycle.
- **Public release:** https://invoiceguard.floot.app remains published from 2026-10-06 10:15 UTC; the publish snapshot has no source digest or source file count. Public browser run https://github.com/matrix12345695-afk/-/actions/runs/41719922197 remains failed with 18 parity assertions. No new publish was performed.
- **Paddle:** latest direct seller-support response remains 2026-10-22 and requests owner re-upload of https://leadforge-ai.floot.app; no newer direct seller-support reply was found through 2026-11-05. This owner action remains pending.
- **Next:** browser-accept the current Floot preview, then reconcile remaining audit-core drift against GitHub main. Keep production publish and all payment activation closed until the exact public artifact passes acceptance.

### C707 verification update — after documentation merge

- [x] InvoiceGuard documentation PR [#20](https://github.com/matrix12345695-afk/-/pull/20) merged at `60dbf511133b42eaee77aca892c62a7e0da273e4`; `STATUS.md`, `FLOOT_RECONCILIATION.md` and `RELEASE_CHECKLIST.md` were read back from `main`.
- [x] Follow-up regression [41913233049](https://github.com/matrix12345695-afk/-/actions/runs/41913233049) completed successfully; its raw log reports **31/31 regression files**. This is a newer run than PR #19's historical exact-head run [41759496282](https://github.com/matrix12345695-afk/-/actions/runs/41759496282), whose log reported **30/30**. Both runs passed; the counts are run-specific, not contradictory.
- [ ] Hosted preview remains unchanged and unaccepted: public run [41719922197](https://github.com/matrix12345695-afk/-/actions/runs/41719922197) still fails 18 parity assertions. No Floot edit or publish has occurred before the 03:00 action-cap reset.

## C707 latest evidence — 2026-11-05 02:02 Asia/Tashkent

- **Hosted acceptance:** public-preview run [41719922197](https://github.com/matrix12345695-afk/-/actions/runs/41719922197) failed its 18 export-parity assertions. Upload and duplicate findings work (3 invoices, 2 duplicate findings), but only two findings CSV downloads are available; the clean-invoice CSV and payment-review summary are absent. Findings exports still expose formula-like vendor text, omit UTF-8 BOM, use LF rather than strict CRLF, and do not use localized filenames. DNT/no-network-leak check passed.
- **Source verification:** PR [#19](https://github.com/matrix12345695-afk/-/pull/19) merged at `ee887fbd59831a9f80fc2d76937c534c219cae3a`. Exact-head regression [41759496282](https://github.com/matrix12345695-afk/-/actions/runs/41759496282) succeeded; the raw job log reports **30/30 regression files**. Local Chromium source acceptance [41759496314](https://github.com/matrix12345695-afk/-/actions/runs/41759496314) succeeded with the four source exports and privacy boundary.
- **Release gate:** public-preview PR [#16](https://github.com/matrix12345695-afk/-/pull/16) remains open and unmerged. Source CI does not prove Floot parity.
- **Floot constraint:** at 02:02, the recorded file/build action cap has not yet reset; reset is **2026-11-05 03:00 Asia/Tashkent**. Do not bypass the cap or publish before the public gate passes.

# Floot reconciliation

Last hosted code verification: 2026-10-06; latest public-preview acceptance: 2026-11-04 (failed, 18 assertions); GitHub source reconciled: 2026-11-04 at ee887fbd

GitHub `main` remains the source of truth for InvoiceGuard product and audit logic. The public Floot project is a hosted prototype surface and must not replace the hardened GitHub audit core.

## Verified hosted state

- Public URL: https://invoiceguard.floot.app
- Floot publish status: published and public at the latest successful hosted verification.
- Built-in analytics mode: `memory`.
- Floot TypeScript typecheck: clean at the latest verified product checkpoint.
- Floot test suite: `helpers/themeMode.spec.tsx` passes.
- Hook regressions explicitly run: `helpers/useMediaQuery.spec.tsx` and `helpers/useDebounce.spec.tsx` both pass.
- Project design guidance matches the implemented Light/Dark/System theme instead of the stale `Light-only` instruction.
- Hosted CSV parsing was hardened on 2026-10-06 to strip UTF-8 BOM, detect comma/semicolon/tab delimiters, preserve quoted multiline fields and escaped quotes, and parse common international accounting-number formats.
- Hosted duplicate checking was hardened on 2026-10-06 to normalize vendor/invoice identifiers and compare uploads against browser-local prior-audit history. Only normalized duplicate keys are persisted locally, capped at 5,000 keys; demo/sample rows are not written to history. The previous-audit finding is localized for EN/RU/UZ/ES/DE/FR/PT. Floot typecheck was clean after this change and a production republish was started.

## GitHub source update — 2026-11-03

- InvoiceGuard PR #13 merged at `f0f0e7489e09c88970cd61a0f1290b63cee16e07` after exact-head and post-merge CI both passed **29/29 regression files**. The clean CSV export now rejects non-numeric negative expressions instead of treating every leading minus followed by a digit as a safe amount; strict accounting-number parsing preserves valid negative amounts.
- This is a GitHub source/test update only. The public Floot artifact was not read, edited or republished; its last hosted verification remains 2026-10-06 and hosted parity is still unproven.

## Current GitHub source-of-truth state — 2026-11-05

GitHub main commit `ee887fbd59831a9f80fc2d76937c534c219cae3a` is the current verified source-of-truth state. PR #19 added a shared browser download lifecycle for findings CSV, clean-invoice CSV and payment-review TXT. Exact-head regression run [41759496282](https://github.com/matrix12345695-afk/-/actions/runs/41759496282) passed; the raw log reports **30/30 regression files**. Local-source Chromium acceptance [41759496314](https://github.com/matrix12345695-afk/-/actions/runs/41759496314) passed all four downloads and privacy checks.

This is GitHub source/CI evidence only. Public Floot preview run [41719922197](https://github.com/matrix12345695-afk/-/actions/runs/41719922197) still fails 18 hosted parity assertions; hosted source parity remains unverified.

## Historical source-of-truth release state — 2026-10-06

GitHub commit `7eb267798cf389d90ec9db505e2ec7c0b8b86204` was the verified source-of-truth state at that checkpoint. GitHub Actions `InvoiceGuard regression` run #166 completed successfully for that exact commit on 2026-10-06. It included regression coverage for configurable required fields, including safe defaults, empty policies, unsupported-field rejection, deduplication, and protection against accidentally filtering arithmetic/duplicate findings.

## Audit-core drift found during reconciliation

The Floot parser/auditor now covers several important behaviors from hardened GitHub `main`, including multiline/international CSV parsing and normalized browser-local cross-upload duplicate history, but the hosted auditor still does **not** mirror the full source-of-truth behavior. Remaining verified drift includes configurable required fields and the full date/currency/rule evidence model.

A partial configurable-required-field implementation was started in Floot after the last published checkpoint, but it must **not** be counted as reconciled or released until the controls are wired, type/tests pass, a checkpoint is created, the app is republished, and the deployed artifact is verified.

Therefore:

- do not advertise the Floot prototype as audit-rule equivalent to GitHub `main`;
- keep GitHub `main` authoritative for audit semantics while closing hosted drift in safe, testable increments;
- before calling the hosted build the sellable MVP, reconcile the remaining audit behavior and rerun representative CSV + seven-language + mobile/theme verification against the deployed artifact.

## Current provider constraint

The current Floot file/build action allowance is recorded as exhausted until `2026-11-05 03:00 Asia/Tashkent` (confirmed in the C706 workspace record). At 02:02 local time the reset is still in the future; until a fresh post-reset file/build action succeeds, no hosted code change, test result, checkpoint, or publication should be claimed. Do not pay to bypass the cap.

## Intentional payment boundary

Do not call Floot Paddle checkout production entitlement. Live payments remain blocked on owner-only provider verification/KYC/banking/domain decisions plus a deliberate server-side webhook/account entitlement model. No secrets should be committed or copied into this repository.


### C712 audit-core parity continuation
- TypeScript check clean after the audit helper integration.
- All 34/34 Jasmine specs pass, including six new audit-core cases.
- Read-only DOM smoke could not run: Floot reported no user-owned Floot tab was open. Do not count this as browser acceptance.
- No production publish or payment-mode change.
