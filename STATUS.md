# InvoiceGuard status

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
- [ ] Add feedback/willingness-to-pay capture without activating payments
- [ ] Validate pricing and Pro feature demand with users
- [ ] Keep target Pro hypothesis ($29/month) provisional until validation

### Phase 8 — Release
- [ ] Run full smoke/regression pass on supported browsers/screen sizes
- [ ] Verify no mixed-language UI on all seven languages
- [ ] Verify sample and representative real-world CSV exports
- [ ] Deploy public MVP when hosting tools permit
- [ ] Verify the deployed build, not just the source repository
- [ ] Freeze a release checklist and known limitations in STATUS.md

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
