# Floot reconciliation

Last hosted verification: 2026-10-06; GitHub source reconciled: 2026-11-03

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

## Current GitHub source-of-truth state — 2026-11-03

GitHub main commit `f0f0e7489e09c88970cd61a0f1290b63cee16e07` is the current verified source-of-truth state. InvoiceGuard PR #13 added strict negative-expression handling to the clean CSV export; exact PR Actions run #218 and post-merge main run #219 both passed **29/29 regression files**. The source preserves valid localized negative amounts while neutralizing arithmetic/formula-like values such as `-1+CMD()`.

This is GitHub source/CI evidence only. The hosted Floot artifact was not read, edited or republished; hosted source parity remains unverified.

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

The current Floot file/build action allowance is exhausted until `2026-11-04 03:00 Asia/Tashkent` (latest confirmed in the C666 workspace check). Until a fresh post-reset tool call succeeds, no additional hosted code change, test result, checkpoint, or publication should be claimed. Do not pay to bypass the cap.

## Intentional payment boundary

Do not call Floot Paddle checkout production entitlement. Live payments remain blocked on owner-only provider verification/KYC/banking/domain decisions plus a deliberate server-side webhook/account entitlement model. No secrets should be committed or copied into this repository.
