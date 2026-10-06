# QualiSift Master Build Plan

_Last updated: 2026-10-07 (Asia/Tashkent)_

## Mission
Build QualiSift into a unified commercial software ecosystem rather than a collection of isolated tools. The target system includes a branded catalog, SaaS products, AI-assisted workflows, licensing/payments, a shared customer experience, white-label/agency offers, analytics, documentation, and launch assets.

## Operating rules
- Work from existing products first; do not rebuild working engines without a reason.
- Every work cycle must end with a concrete, verifiable result.
- Run appropriate tests/build/smoke checks before claiming completion.
- Keep this file and product STATUS files updated after meaningful work.
- When blocked by an external review, quota, or owner-only action, record the blocker and switch to an independent task.
- Do not activate live payments, complete KYC, change banking details, expose secrets, buy domains, or perform irreversible owner-only actions autonomously.

## Current product inventory

### InvoiceGuard
Status: **closest to sellable MVP**.

Already verified from `STATUS.md`:
- hardened CSV invoice audit core
- duplicate/arithmetic/tax/currency/date/missing-field rules
- accountant-friendly findings and exports
- EN/RU/UZ/ES/DE/FR/PT localization and automated parity checks
- first-run onboarding and sample-data path
- responsive Light/Dark UI
- mobile states and accessibility regression coverage
- privacy/security documentation
- privacy-conscious activation analytics
- Paddle sandbox checkout prototype
- public Floot prototype at `https://invoiceguard.floot.app`

Remaining release gates:
- manually verify all seven languages across key states
- finish manual keyboard/contrast/accessibility verification
- finish conversion-copy pass
- reconcile public Floot audit core with hardened GitHub main
- full browser/screen-size smoke/regression pass
- representative CSV export verification
- verify deployed build after reconciliation
- production entitlements/webhook secret/account model remain later commercial work

### Spreadsheet Doctor
Status: **mature product candidate, audit in progress**.

Observed repository structure:
- private repository `matrix12345695-afk/spreadsheet-doctor`
- app/server structure, migrations, public assets, tests/e2e, Playwright config, GitHub workflow support, security docs
- no root `STATUS.md` found during initial audit; create product status after deeper inspection

### QualiSift AI
Status: **commercial/Paddle review track**.
- Existing Paddle review/status monitoring has been consolidated into the single Master Build cycle.
- Check new Paddle correspondence during each cycle and perform safe reversible fixes when requested.

## Phase 1 — Week 1: Audit and foundation
- [x] Consolidate project automations into one hourly QualiSift Master Build cycle.
- [x] Start GitHub audit of InvoiceGuard and Spreadsheet Doctor.
- [x] Establish this master plan as the durable project log.
- [ ] Complete repository/product inventory across all existing commercial candidates.
- [ ] Create a per-product readiness score: product, UX, tests, hosting, payments, docs, marketing, blockers.
- [ ] Finish InvoiceGuard release blockers that do not require owner-only actions.
- [ ] Complete Spreadsheet Doctor technical/commercial audit and create its status file.
- [ ] Identify/inspect current QualiSift AI source and hosting surface.
- [ ] Define QualiSift product architecture and naming system.
- [ ] Define shared visual/design system.
- [ ] Establish central QualiSift website/catalog architecture.
- [ ] Plan shared account, licensing, downloads, versioning, onboarding and support surfaces.
- [ ] Prepare Home, Catalog, Product, Pricing, FAQ, Docs, Trust, Privacy, Terms and Support structure.

## Phase 2 — Week 2: First products and SaaS
Target first commercial lineup:
- [ ] Spreadsheet Doctor / Excel Cleaner
- [ ] Merge & Split
- [ ] Data Quality Analyzer
- [ ] Inventory / Stock Analyzer
- [ ] Report Builder
- [ ] Business Toolkit bundle

For every product:
- [ ] production-ready core workflow
- [ ] demo/trial/sample path
- [ ] export/output flow
- [ ] error/loading/empty/success states
- [ ] responsive UX
- [ ] RU/EN minimum localization
- [ ] documentation
- [ ] commercial product page
- [ ] pricing tier
- [ ] screenshots/mockups
- [ ] test/build/smoke baseline

Shared SaaS target where appropriate:
`Upload -> Analyze -> Fix/Review -> Export`

## Phase 3 — Week 3: AI, payments, licenses, white label
- [ ] Add useful AI explanations for formulas/data-quality findings.
- [ ] Add anomaly detection and report summaries where justified.
- [ ] Add invoice/stock issue explanations where justified.
- [ ] Complete Paddle sandbox checkout architecture.
- [ ] Complete safe server-side webhook/entitlement design when secrets/account model are available.
- [ ] Define Free / Pro / Business / Bundle / Agency tiers.
- [ ] Add purchase/entitlement history model.
- [ ] Add safe licensing model for desktop/download products.
- [ ] Build White Label / Agency model: logo, colors, naming, tenant/client branding.
- [ ] Prepare Agency license and resale documentation.
- [ ] Build admin surface for products, versions, users, licenses/entitlements, errors, downloads and analytics.

## Phase 4 — Week 4: QA, packaging and launch
- [ ] Cross-browser QA.
- [ ] Mobile/desktop QA.
- [ ] Localization QA.
- [ ] Light/Dark QA where applicable.
- [ ] Upload/export/auth/sandbox-checkout QA.
- [ ] Accessibility and security-basics review.
- [ ] Desktop packaging/installers where useful.
- [ ] Version/About/update flow.
- [ ] Final unified catalog.
- [ ] Product screenshots and mockups.
- [ ] Demo video scripts/assets.
- [ ] Product Hunt launch package.
- [ ] AppSumo-ready package.
- [ ] Gumroad/Codester-ready package where appropriate.
- [ ] SEO landing pages.
- [ ] Funnel analytics: visits -> trial -> activation -> purchase -> retention.
- [ ] Support flow, release notes and launch checklist.

## Pricing architecture hypothesis
- Low-ticket utility: $9–19
- Full tool: $29–79
- Pro/Business: $99–199 or subscription where justified
- SaaS: approximately $9–39/month depending on value
- Bundle: approximately $79–129 initial hypothesis
- Agency / White Label: approximately $299–999+ depending on scope

These are hypotheses until validated with actual users and conversion data.

## Priority order
1. InvoiceGuard release readiness
2. Spreadsheet Doctor / Excel Cleaner
3. QualiSift AI / Paddle review requirements
4. Merge & Split
5. Data Quality Analyzer
6. Inventory / Stock Analyzer
7. Report Builder
8. Business Toolkit bundle
9. Shared accounts/licensing/admin
10. AI layer
11. White Label / Agency
12. niche products: Telegram business automation, restaurant/retail inventory, SAP/warehouse analyzers

## Progress log

### Cycle 0 — Consolidation and kickoff
- Disabled four overlapping project-related automations covering InvoiceGuard and Paddle project monitoring.
- Kept the unrelated Dongfeng EV watch separate.
- Created the single hourly `QualiSift Master Build` automation.
- Confirmed admin access to `matrix12345695-afk/spreadsheet-doctor` and `matrix12345695-afk/-`.
- Audited InvoiceGuard `STATUS.md`; identified it as the closest product to a sellable MVP.
- Audited Spreadsheet Doctor repository root; confirmed mature app/test/server structure and absence of root `STATUS.md`.
- Created this central master plan.

### Next cycle
1. Deep-audit Spreadsheet Doctor README/package/test/deploy state and create its STATUS file.
2. Inspect latest InvoiceGuard commit/tests and choose the highest-value safe release blocker.
3. Locate QualiSift AI source/hosting and record it in inventory.
4. Check Paddle correspondence for new requirements; if none, continue product engineering.
