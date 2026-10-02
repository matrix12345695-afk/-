(function(root){
  'use strict';

  const PAYMENT_BLOCKING = new Set([
    'missingNo',
    'missingVendor',
    'missingCurrency',
    'currencyNotAllowed',
    'invalidTotal',
    'badMath',
    'negativeTax',
    'pastDuplicate',
    'duplicate',
  ]);

  const REVIEW_REQUIRED = new Set([
    'missingDate',
    'invalidDate',
    'futureDate',
    'taxRate',
  ]);

  function severityForFinding(msgKey, fallback='Medium') {
    if (PAYMENT_BLOCKING.has(msgKey)) return 'High';
    if (REVIEW_REQUIRED.has(msgKey)) return 'Medium';
    return fallback;
  }

  function applySeverityPolicy(findings) {
    return (findings || []).map((finding) => ({
      ...finding,
      severity: severityForFinding(finding.msgKey, finding.severity),
    }));
  }

  const api = { severityForFinding, applySeverityPolicy };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.InvoiceGuardSeverityPolicy = api;

  // Keep the legacy audit engine small while enforcing one explicit policy at
  // the product boundary. High means stop payment; Medium means review.
  if (root && typeof root.audit === 'function') {
    const baseAudit = root.audit;
    root.audit = function(rows) {
      return applySeverityPolicy(baseAudit(rows));
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
