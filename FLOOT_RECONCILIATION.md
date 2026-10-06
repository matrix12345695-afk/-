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

## Source-of-truth release state

GitHub commit `e33cac1b0690c887accae1f014faf393f30a7889` records the reconciliation state. GitHub Actions `InvoiceGuard regression` run #161 completed successfully for that exact commit.

## Audit-core drift found during reconciliation

The current Floot prototype still contains a deliberately smaller in-page CSV parser/auditor. It does **not** yet mirror all hardened GitHub `main` behavior such as multiline CSV handling, international accounting-number parsing, normalized/cross-upload duplicate history, configurable required fields, and the full date/currency/rule evidence model.

Therefore:

- do not advertise the Floot prototype as audit-rule equivalent to GitHub `main`;
- do not port new audit rules independently into Floot, because that would create two competing sources of truth;
- before calling the hosted build the sellable MVP, reconcile Floot to the hardened GitHub audit core (or publish the GitHub build through an appropriate host) and rerun representative CSV + seven-language + mobile/theme verification against the deployed artifact.

## Intentional payment boundary

Do not call Floot Paddle checkout production entitlement. Live payments remain blocked on owner-only provider verification/KYC/banking/domain decisions plus a deliberate server-side webhook/account entitlement model. No secrets should be committed or copied into this repository.
