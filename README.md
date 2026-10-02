# InvoiceGuard

InvoiceGuard is a browser-first pre-payment invoice audit product for small businesses and bookkeeping teams. It helps catch duplicate invoices, missing critical fields, suspicious totals, tax/currency issues and other payment-review risks before money leaves the account.

## Current product
- Browser-local CSV invoice audit
- Hardened CSV and accounting-number parsing
- Duplicate detection within a file and across local audit history
- Arithmetic, tax, currency, date and missing-field checks
- Accountant-friendly findings, clean invoice export and approval summary
- EN/RU/UZ/ES/DE/FR/PT localization foundation
- No invoice data upload required for the current CSV workflow

## Development
`main` is the source of truth for InvoiceGuard. See `STATUS.md` for the ordered sellable-MVP roadmap and current engineering state.

The previous ProfitKit project is intentionally preserved on the `archive/profitkit` branch and must not replace InvoiceGuard on `main`.

## Commercial safety
Pricing is a validation hypothesis only. Payment activation, KYC, banking details, secret entry and paid-domain actions are owner-only and are not performed autonomously.
