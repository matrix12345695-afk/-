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
- [x] Responsive UI
- [x] Normalized accountant-friendly invoice CSV export
- [x] Seven-language selector and persistent localization foundation (EN/RU/UZ/ES/DE/FR/PT)
- [x] Complete static UI dictionaries for EN/RU/UZ/ES/DE/FR/PT with no English fallback required for the current data-i18n surface
- [x] Dynamic audit findings, severities, validation alerts and local status messages localized in EN/RU/UZ/ES/DE/FR/PT
- [x] Findings CSV exports use the active language for severities and finding descriptions
- [x] Switching language now refreshes already-rendered dynamic findings and at-risk values immediately
- [x] Audit summary export labels, headings, dates and high-severity findings localized in EN/RU/UZ/ES/DE/FR/PT
- [x] Audit summary text export includes UTF-8 BOM for reliable multilingual opening in desktop tools

## Next
- [ ] Audit every remaining visible/generated string for mixed-language edge cases
- [ ] Harden CSV parsing for multiline quoted cells, BOMs, delimiters and malformed rows
- [ ] Add focused regression fixtures for duplicate normalization, arithmetic/tax/currency/date/missing-field rules and cross-upload history
- [x] Add explicit mapping UI for unknown columns
- [x] Add configurable audit rules and tolerances
- [ ] Add PDF/image invoice ingestion
- [x] Add accountant-friendly clean export
- [x] Add privacy/security documentation
- [ ] Deploy public MVP
- [ ] Add usage analytics
- [x] Add audit summary export for approval/review
- [ ] Validate willingness-to-pay and pricing
- [ ] Connect payments only after product validation

## Commercial direction
Free: limited CSV audit and downloadable findings.
Target Pro: $29/month for saved audit history, batch documents, custom rules, vendor history, approval workflow and richer exports.

## Recurring build rule
Choose the highest-value unfinished improvement that makes the tool safer, more useful, easier to validate, or more sellable. Keep main deployable. Never touch owner-only KYC, banking, secrets or paid domain actions.
