# Floot reconciliation

Last verified: 2026-10-06

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

## Source-of-truth release state

GitHub commit `7eb267798cf389d90ec9db505e2ec7c0b8b86204` is the current fully verified source-of-truth state. GitHub Actions `InvoiceGuard regression` run #166 completed successfully for that exact commit on 2026-10-06. This includes strengthened regression coverage for configurable required fields, including safe defaults, empty policies, unsupported-field rejection, deduplication, and protection against accidentally filtering arithmetic/duplicate findings.

## Audit-core drift found during reconciliation

The Floot parser/auditor now covers several important behaviors from hardened GitHub `main`, including multiline/international CSV parsing and normalized browser-local cross-upload duplicate history, but the hosted auditor still does **not** mirror the full source-of-truth behavior. Remaining verified drift includes configurable required fields and the full date/currency/rule evidence model.

A partial configurable-required-field implementation was started in Floot after the last published checkpoint, but it must **not** be counted as reconciled or released until the controls are wired, type/tests pass, a checkpoint is created, the app is republished, and the deployed artifact is verified.

Therefore:

- do not advertise the Floot prototype as audit-rule equivalent to GitHub `main`;
- keep GitHub `main` authoritative for audit semantics while closing hosted drift in safe, testable increments;
- before calling the hosted build the sellable MVP, reconcile the remaining audit behavior and rerun representative CSV + seven-language + mobile/theme verification against the deployed artifact.

## Current provider constraint

A fresh Floot reconciliation attempt on 2026-10-06 was refused by the provider because the account had exhausted its daily build-action allowance. Floot reported a reset at `2026-10-06T22:00:00Z`. Until a fresh post-reset tool call succeeds, no additional hosted code change, test result, checkpoint, or publication should be claimed.

## Intentional payment boundary

Do not call Floot Paddle checkout production entitlement. Live payments remain blocked on owner-only provider verification/KYC/banking/domain decisions plus a deliberate server-side webhook/account entitlement model. No secrets should be committed or copied into this repository.
