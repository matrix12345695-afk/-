# Floot reconciliation

Last verified: 2026-10-06

GitHub `main` remains the source of truth for InvoiceGuard product and audit logic. The public Floot project is a hosted prototype surface and must not replace the hardened GitHub audit core.

## Verified hosted state

- Public URL: https://invoiceguard.floot.app
- Floot publish status: published and public.
- Built-in analytics mode: `memory`.
- Floot TypeScript typecheck: clean.
- Floot test suite: `helpers/themeMode.spec.tsx` passes.
- Hook regressions explicitly run: `helpers/useMediaQuery.spec.tsx` and `helpers/useDebounce.spec.tsx` both pass.
- Project design guidance now matches the implemented Light/Dark/System theme instead of the stale `Light-only` instruction.

## Source-of-truth release state

GitHub commit `1ea161dadb1e3a2c4366a67bf32c006445da8c0a` added the release verification checklist. GitHub Actions `InvoiceGuard regression` run #160 completed successfully for that exact commit.

## Intentional boundary

Do not call Floot Paddle checkout production entitlement. Live payments remain blocked on owner-only provider verification/KYC/banking/domain decisions plus a deliberate server-side webhook/account entitlement model. No secrets should be committed or copied into this repository.
