# InvoiceGuard Privacy & Security

## Current MVP
InvoiceGuard currently processes uploaded CSV files in the user's browser. The CSV audit does not require a cloud upload or account.

The browser may keep audit rules and a limited invoice history in localStorage so repeated vendor and invoice-number combinations can be detected across audits. Users can remove invoice history with the Clear local history control or clear site data in their browser.

Findings and normalized CSV exports are generated in the browser and downloaded to the user's device.

## Important boundaries
InvoiceGuard findings are decision support and should be reviewed before payment. Users should only process files they are authorized to access.

Future PDF or image processing must document its real processing and retention model before it is marketed as private. Before a commercial public launch, the deployed product should publish a privacy policy that matches its actual architecture and provide a real support contact.
