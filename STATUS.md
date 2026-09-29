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
- [x] Cross-upload duplicate detection using browser-local history
- [x] Local history clear control
- [x] Missing invoice/vendor/date/currency checks
- [x] Invalid/non-positive total detection
- [x] Subtotal + tax vs total arithmetic check
- [x] Findings table with severity
- [x] At-risk value summary
- [x] Downloadable findings CSV with invoice date and duplicate context
- [x] Built-in sample audit using human-friendly headers
- [x] Responsive UI
- [x] Normalized accountant-friendly invoice CSV export

## Next
- [x] Add explicit mapping UI for unknown columns
- [x] Add configurable audit rules and tolerances
- [ ] Add PDF/image invoice ingestion
- [x] Add accountant-friendly clean export
- [x] Add privacy/security documentation
- [ ] Deploy public MVP
- [ ] Add usage analytics
- [ ] Add audit summary export for approval/review
- [ ] Validate willingness-to-pay and pricing
- [ ] Connect payments only after product validation

## Commercial direction
Free: limited CSV audit and downloadable findings.
Target Pro: $29/month for saved audit history, batch documents, custom rules, vendor history, approval workflow and richer exports.

## Recurring build rule
Choose the highest-value unfinished improvement that makes the tool safer, more useful, easier to validate, or more sellable. Keep main deployable. Never touch owner-only KYC, banking, secrets or paid domain actions.
