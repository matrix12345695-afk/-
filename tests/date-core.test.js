const assert=require('assert');
const {parseInvoiceDate,classifyInvoiceDate}=require('../date-core.js');

assert.strictEqual(parseInvoiceDate('2026-10-03').status,'ok');
assert.strictEqual(parseInvoiceDate('2026-02-30').status,'invalid','impossible ISO dates must fail');
assert.strictEqual(parseInvoiceDate('03/04/2026').status,'ambiguous','locale-ambiguous numeric dates must never be guessed');
assert.strictEqual(parseInvoiceDate('03.04.2026').status,'ambiguous','dot-separated ambiguous dates must be reviewed');
assert.strictEqual(parseInvoiceDate('13/04/2026').normalized,'2026-04-13','day-first order is provable when first component exceeds 12');
assert.strictEqual(parseInvoiceDate('04/13/2026').normalized,'2026-04-13','month-first order is provable when second component exceeds 12');
assert.strictEqual(parseInvoiceDate('31/02/2026').status,'invalid','impossible provable dates must fail');
assert.strictEqual(parseInvoiceDate('').status,'missing');
assert.strictEqual(parseInvoiceDate('next Friday').status,'invalid','natural-language dates must not depend on browser locale');

const now=new Date('2026-10-03T12:00:00Z');
assert.strictEqual(classifyInvoiceDate('2026-10-04',now).status,'ok','one-day processing grace remains allowed');
assert.strictEqual(classifyInvoiceDate('2026-10-05',now).status,'future','dates beyond grace must be reviewed');

console.log('locale-safe date core regression: ok');
