# Floot reconciliation

Last verified: 2026-10-06

GitHub `main` remains the source of truth for InvoiceGuard product and audit logic. The public Floot project is a hosted prototype surface and must not replace the hardened GitHub audit core.

## Verified hosted state

- Public URL: https://invoiceguard.floot.app
- Floot publish status: published and public.
- Built-in analytics mode: `memory`.
- Floot TypeScript typecheck: clean at the latest verified product checkpoint.
- Floot test suite: `helpers/themeMode.spec.tsx` passes.
- Hook regressions explicitly run: `helpers/useMediaQuery.spec.tsx` and `helpers/useDebounce.spec.tsx` both pass.
- Project design guidance matches the implemented Light/Dark/System theme instead of the stale `Light-only` instruction.
- Hosted CSV parsing was hardened on 2026-10-06 to strip UTF-8 BOM, detect comma/semicolon/tab delimiters, preserve quoted multiline fields and escaped quotes, and parse common international accounting-number formats. Floot typecheck was clean and the public build was republished after this change.

## Source-of-truth release state

GitHub commit `fd79f3fc8e999ba855fae9863463f9e11c65d68b` is the last fully verified source-of-truth state before this reconciliation note; GitHub Actions `InvoiceGuard regression` run #163 completed successfully for that exact commit.

## Audit-core drift found during reconciliation

The Floot parser now covers several important CSV-input behaviors from hardened GitHub `main`, but the hosted auditor still does **not** mirror the full source-of-truth behavior. Remaining drift includes normalized/cross-upload duplicate history, configurable required fields, and the full date/currency/rule evidence model.

Therefore:

- do not advertise the Floot prototype as audit-rule equivalent to GitHub `main`;
- keep GitHub `main` authoritative for audit semantics while closing hosted drift in safe, testable increments;
- before calling the hosted build the sellable MVP, reconcile the remaining audit behavior and rerun representative CSV + seven-language + mobile/theme verification against the deployed artifact.

## Intentional payment boundary

Do not call Floot Paddle checkout production entitlement. Live payments remain blocked on owner-only provider verification/KYC/banking/domain decisions plus a deliberate server-side webhook/account entitlement model. No secrets should be committed or copied into this repository.
