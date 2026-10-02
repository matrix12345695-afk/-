# InvoiceGuard status

## Product
InvoiceGuard is a pre-payment invoice audit tool for small businesses and bookkeeping teams. It focuses on catching costly mistakes before money leaves the account, rather than competing as a generic OCR product.

## Done
- [x] ProfitKit preserved on branch archive/profitkit
- [x] InvoiceGuard positioning and landing page
- [x] Browser-local CSV invoice upload
- [x] CSV parser with quoted field support
- [x] Automatic mapping for common invoice column names
- [x] Duplicate invoice-number detection per vendor
- [x] Duplicate matching hardened for case, whitespace, punctuation and Unicode formatting differences in vendor/invoice identifiers
- [x] Cross-upload duplicate detection using browser-local history
- [x] Local history clear control
- [x] Missing invoice/vendor/date/currency checks
- [x] Invalid and unexpectedly future invoice-date checks
- [x] Invalid/non-positive total detection
- [x] Subtotal + tax vs total arithmetic check
- [x] Findings table with severity
- [x] At-risk value summary
- [x] Downloadable findings CSV with invoice date and duplicate context
- [x] Built-in sample audit using human-friendly headers
- [x] Responsive UI foundation
- [x] Normalized accountant-friendly invoice CSV export
- [x] Seven-language selector and persistent localization foundation (EN/RU/UZ/ES/DE/FR/PT)
- [x] Complete static UI dictionaries for EN/RU/UZ/ES/DE/FR/PT with no English fallback required for the current data-i18n surface
- [x] Dynamic audit findings, severities, validation alerts and local status messages localized in EN/RU/UZ/ES/DE/FR/PT
- [x] Findings CSV exports use the active language for severities and finding descriptions
- [x] Switching language refreshes already-rendered dynamic findings and at-risk values immediately
- [x] Audit summary export labels, headings, dates and high-severity findings localized in EN/RU/UZ/ES/DE/FR/PT
- [x] Audit summary text export includes UTF-8 BOM for reliable multilingual opening in desktop tools
- [x] Explicit mapping UI for unknown columns
- [x] Configurable audit rules and tolerances
- [x] Privacy/security documentation
- [x] Audit summary export for approval/review
- [x] Added isolated hardened CSV core with BOM stripping, comma/semicolon/tab detection, multiline quoted fields, escaped quotes and strict malformed-row errors
- [x] Added focused CSV core regression fixtures for BOM, delimiter detection, multiline fields, escaped quotes, unclosed quotes and row-width mismatch
- [x] Integrated hardened CSV core into the live upload/audit path while preserving existing mapping/audit/export flow
- [x] Localized hardened-parser safety errors in EN/RU/UZ/ES/DE/FR/PT
- [x] Localized CSV mapping display, canonical accounting field labels and unknown-column mapping options in EN/RU/UZ/ES/DE/FR/PT
- [x] Hardened international accounting-number parser supports decimal comma/dot, thousands separators, NBSP/narrow spaces, apostrophes, currency symbols and accounting negatives
- [x] Added focused accounting-number regression coverage for international formats and invalid values
- [x] Added production-path duplicate normalization/cross-upload regression coverage
- [x] Added production audit regression coverage for arithmetic tolerance, tax thresholds/negative tax, currency allow-list and localized accounting numbers
- [x] Added production audit regression coverage for missing required fields and invoice-date validation
- [x] Added multilingual findings/approval export regression coverage
- [x] Added dependency-free `npm test` / `npm run smoke` runner and GitHub Actions regression workflow
- [x] Formalized severity semantics: High = stop payment, Medium = accountant review; missing/unsupported currency is payment-blocking
- [x] Added deterministic duplicate-evidence context core + regression coverage for same-file first/current occurrence and previous-audit evidence
- [x] Wired deterministic duplicate evidence into live audit finding objects for downstream rendering/export
- [x] Surface duplicate evidence in visible findings and existing exports with localized EN/RU/UZ/ES/DE/FR/PT labels

## Roadmap to sellable MVP
Work strictly top to bottom unless a blocking regression requires an earlier fix.

### Phase 1 — Input reliability
- [x] Integrate hardened csv-core.js into the live upload/audit path without regressing mapping or exports
- [x] Implement state-machine CSV core supporting multiline quoted cells
- [x] Strip UTF-8 BOM safely in hardened core
- [x] Auto-detect comma, semicolon and tab delimiters in hardened core
- [x] Preserve escaped quotes and embedded delimiters/newlines inside quoted cells in hardened core
- [x] Detect malformed/unclosed quoted records in hardened core
- [x] Detect row-width mismatches in hardened core instead of silently shifting columns
- [x] Re-check number parsing for decimal comma/thousands separators
- [x] Localize parser error presentation once live integration is complete

### Phase 2 — Regression safety
- [x] Add focused fixtures/tests for CSV parser edge cases
- [x] Add duplicate normalization fixtures: case, punctuation, whitespace, Unicode and cross-upload history
- [x] Add arithmetic tolerance fixtures
- [x] Add tax threshold/negative tax fixtures
- [x] Add currency allow-list fixtures
- [x] Add missing-field and date fixtures
- [x] Add export regression checks
- [x] Add a repeatable repository test command/CI-safe smoke runner

### Phase 3 — Audit quality (NOW)
- [x] Review severity policy so high-risk means payment-blocking and medium means review
- [x] Add duplicate context: first occurrence/current occurrence and previous-audit context, visible in findings and existing exports
- [ ] Improve suspicious currency checks and currency normalization
- [ ] Improve date sanity checks without locale ambiguity
- [ ] Add configurable required-field policy
- [ ] Make every finding explain why it matters and what the accountant should verify

### Phase 4 — Accountant-ready output
- [ ] Improve approval summary into a concise payment-review artifact
- [ ] Include audit settings/tolerances and source filename in evidence exports
- [ ] Add deterministic audit timestamp/session identifier
- [ ] Improve clean CSV export formatting and multilingual spreadsheet compatibility
- [ ] Add printable report view before considering PDF generation

### Phase 5 — Complete localization
- [ ] Audit every remaining visible/generated string for mixed-language edge cases
- [x] Localize mapping UI labels/options and parser error messages
- [ ] Localize export headers where appropriate while keeping machine-readable clean CSV stable
- [ ] Verify EN/RU/UZ/ES/DE/FR/PT manually across empty, demo, error and results states

### Phase 6 — Product polish
- [ ] Polish first-run onboarding and sample-data path
- [ ] Add clear empty/loading/error/success states
- [ ] Finish mobile/table overflow behavior
- [ ] Accessibility pass: labels, keyboard flow, focus states, contrast and status announcements
- [ ] FAQ/trust/privacy/conversion copy pass to Spreadsheet Doctor quality
- [ ] Remove any placeholder or premature Pro/payment wording that reduces trust

### Phase 7 — Commercial validation readiness
- [ ] Add privacy-safe usage analytics only after choosing a provider/config that needs no exposed secret
- [ ] Define measurable activation event: successful audit with results viewed/exported
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
