// Load after app.js so existing audit logic resolves the hardened parser at call time.
if(window.InvoiceGuardNumbers?.parseAccountingNumber){
  num=window.InvoiceGuardNumbers.parseAccountingNumber;
}
