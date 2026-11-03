import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const target = new URL(
  process.env.INVOICEGUARD_PUBLIC_URL || "https://invoiceguard.floot.app",
);
const privateMarker = "QUALISIFT_C679_PRIVATE_MARKER";
const hostileVendor = `=HYPERLINK("https://example.invalid","${privateMarker}")`;
const csv = [
  "invoice_number,vendor,date,subtotal,tax,total,currency",
  `INV-001,"${hostileVendor.replaceAll('"', '""')}",2026-11-01,100.00,10.00,110.00,USD`,
  `INV-002,"${hostileVendor.replaceAll('"', '""')}",2026-11-02,100.00,10.00,110.00,USD`,
  `INV-002,"${hostileVendor.replaceAll('"', '""')}",2026-11-03,100.00,10.00,110.00,USD`,
].join("\r\n");

const leakedRequests = [];
const downloadNames = [];
const usesCrLfOnly = (value) =>
  value.includes("\r\n") && !/(^|[^\r])\n/.test(value);
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    acceptDownloads: true,
    locale: "en-US",
    extraHTTPHeaders: { DNT: "1" },
  });
  const page = await context.newPage();
  page.on("download", (download) => downloadNames.push(download.suggestedFilename()));
  page.on("request", (request) => {
    const body =
      request.postData() ||
      request.postDataBuffer()?.toString("utf8") ||
      "";
    if (request.url().includes(privateMarker) || body.includes(privateMarker)) {
      leakedRequests.push({ method: request.method(), url: request.url() });
    }
  });
  page.on("dialog", (dialog) => dialog.accept());

  const response = await page.goto(target.href, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  assert.ok(response?.ok(), `InvoiceGuard public preview did not load: HTTP ${response?.status()}`);
  assert.match(await page.title(), /InvoiceGuard/i);

  const fileInput = page.locator('input[type="file"]').first();
  assert.ok((await fileInput.count()) > 0, "The published preview must expose a CSV file input");
  await fileInput.setInputFiles({
    name: "qualisift-c679-private-sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(csv, "utf8"),
  });

  const findingsButton = page.getByRole("button", { name: /Export findings CSV/i });
  await findingsButton.waitFor({ state: "visible", timeout: 30_000 });
  const table = page.locator("table").first();
  await table.waitFor({ state: "visible", timeout: 15_000 });
  const rows = await table.locator("tr").count();
  assert.ok(rows >= 3, `Expected a header and duplicate findings, received ${rows} table rows`);
  const tableText = await table.innerText();
  assert.match(tableText, /INV-002/);
  assert.match(tableText, /duplicate invoice/i);

  const [findingsDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    findingsButton.click(),
  ]);
  const findingsPath = await findingsDownload.path();
  assert.ok(findingsPath, "English findings CSV download should be available");
  const findingsCsv = await readFile(findingsPath, "utf8");
  const findingsBomPresent = findingsCsv.startsWith("\uFEFF");
  const findingsUsesCrLf = usesCrLfOnly(findingsCsv);
  const findingsFormulaSafe =
    findingsCsv.includes("'=HYPERLINK(") && !findingsCsv.includes('"=HYPERLINK(');
  const findingsFilenameLocalized = /-en\.csv$/i.test(findingsDownload.suggestedFilename());
  const findingsContainsMarker = findingsCsv.includes(privateMarker);

  const languageSelect = page.locator("select").first();
  assert.ok((await languageSelect.count()) > 0, "The public preview should expose its language selector");
  await languageSelect.selectOption("ru");

  const findingsButtons = page.locator(".export-actions button");
  const russianFindingsButton = (await findingsButtons.count()) > 0
    ? findingsButtons.last()
    : page.getByRole("button", { name: /CSV/i }).last();
  await russianFindingsButton.waitFor({ state: "visible", timeout: 10_000 });
  const [russianDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    russianFindingsButton.click(),
  ]);
  const russianPath = await russianDownload.path();
  assert.ok(russianPath, "Russian findings CSV download should be available");
  const russianCsv = await readFile(russianPath, "utf8");
  const russianBomPresent = russianCsv.startsWith("\uFEFF");
  const russianUsesCrLf = usesCrLfOnly(russianCsv);
  const russianHeaderSnippet = russianCsv.split(/\r?\n/, 1)[0] ?? "";
  const russianHeaderLocalized = russianCsv.toLocaleLowerCase("ru-RU").includes("строка");
  const russianFilenameLocalized = /-ru\.csv$/i.test(russianDownload.suggestedFilename());
  const russianFormulaSafe =
    russianCsv.includes("'=HYPERLINK(") && !russianCsv.includes('"=HYPERLINK(');
  const russianContainsMarker = russianCsv.includes(privateMarker);

  const cleanButton = page.getByRole("button", {
    name: /clean.*CSV|CSV.*clean|очищ.*CSV|CSV.*очищ/i,
  }).first();
  const summaryButton = page.getByRole("button", {
    name: /summary|сводк|payment review|провер.*оплат/i,
  }).first();
  const cleanExportAvailable =
    (await cleanButton.count()) === 1 && await cleanButton.isVisible() && await cleanButton.isEnabled();
  const summaryExportAvailable =
    (await summaryButton.count()) === 1 && await summaryButton.isVisible() && await summaryButton.isEnabled();

  let cleanExport = null;
  if (cleanExportAvailable) {
    const [cleanDownload] = await Promise.all([
      page.waitForEvent("download", { timeout: 15_000 }),
      cleanButton.click(),
    ]);
    const cleanPath = await cleanDownload.path();
    assert.ok(cleanPath, "Clean-invoice CSV download should be available");
    const cleanCsv = await readFile(cleanPath, "utf8");
    cleanExport = {
      filename: cleanDownload.suggestedFilename(),
      bom: cleanCsv.startsWith("\uFEFF"),
      crlf: usesCrLfOnly(cleanCsv),
      formulaSafe: cleanCsv.includes('"\'=HYPERLINK(') && !cleanCsv.includes('"=HYPERLINK('),
      containsPrivateMarker: cleanCsv.includes(privateMarker),
    };
  }

  let summaryExport = null;
  if (summaryExportAvailable) {
    const [summaryDownload] = await Promise.all([
      page.waitForEvent("download", { timeout: 15_000 }),
      summaryButton.click(),
    ]);
    const summaryPath = await summaryDownload.path();
    assert.ok(summaryPath, "Payment-review summary download should be available");
    const summaryText = await readFile(summaryPath, "utf8");
    summaryExport = {
      filename: summaryDownload.suggestedFilename(),
      bom: summaryText.startsWith("\uFEFF"),
      titlePresent: summaryText.includes("INVOICEGUARD — ПРОВЕРКА ПЕРЕД ОПЛАТОЙ"),
      reviewedCountPresent: summaryText.includes("Проверено счетов: 3"),
      containsPrivateMarker: summaryText.includes(privateMarker),
    };
  }

  const failures = [];
  if (!findingsFormulaSafe) failures.push("English findings CSV leaves formula-like vendor text executable");
  if (!findingsBomPresent) failures.push("English findings CSV is missing the UTF-8 BOM");
  if (!findingsUsesCrLf) failures.push("English findings CSV must use CRLF without bare LF line endings");
  if (!findingsFilenameLocalized) failures.push("English findings CSV filename must end in -en.csv");
  if (!findingsContainsMarker) failures.push("English findings CSV is missing the uploaded local sample row");
  if (!russianFormulaSafe) failures.push("Russian findings CSV leaves formula-like vendor text executable");
  if (!russianBomPresent) failures.push("Russian findings CSV is missing the UTF-8 BOM");
  if (!russianUsesCrLf) failures.push("Russian findings CSV must use CRLF without bare LF line endings");
  if (!russianHeaderLocalized) failures.push("Russian findings CSV headers are not localized");
  if (!russianFilenameLocalized) failures.push("Russian findings CSV filename must end in -ru.csv");
  if (!russianContainsMarker) failures.push("Russian findings CSV is missing the uploaded local sample row");
  if (!cleanExportAvailable) failures.push("Clean-invoice CSV export is not available");
  if (!summaryExportAvailable) failures.push("Summary export is not available");
  if (!cleanExport?.bom) failures.push("Clean-invoice CSV is missing the UTF-8 BOM");
  if (!cleanExport?.crlf) failures.push("Clean-invoice CSV must use strict CRLF");
  if (!cleanExport?.formulaSafe) failures.push("Clean-invoice CSV leaves formula-like vendor text executable");
  if (!cleanExport?.containsPrivateMarker) failures.push("Clean-invoice CSV is missing the uploaded local sample row");
  if (cleanExport && cleanExport.filename !== "invoiceguard-clean-invoices.csv") failures.push("Clean-invoice CSV filename is unexpected");
  if (!summaryExport?.bom) failures.push("Payment-review summary is missing the UTF-8 BOM");
  if (!summaryExport?.titlePresent || !summaryExport?.reviewedCountPresent) failures.push("Payment-review summary content is incomplete");
  if (!summaryExport?.containsPrivateMarker) failures.push("Payment-review summary is missing the reviewed local sample evidence");
  if (!/payment-review-ru\.txt$/i.test(summaryExport?.filename || "")) failures.push("Payment-review summary filename is not localized");
  if (downloadNames.length !== 4) failures.push(`Expected exactly four downloads, received ${downloadNames.length}`);
  if (leakedRequests.length) failures.push("Synthetic invoice content appeared in a request URL or POST body");

  console.log(JSON.stringify({
    result: failures.length ? "FAIL" : "PASS",
    target: target.origin,
    uploadedRows: 3,
    findingsTableRows: rows,
    downloads: downloadNames,
    findings: {
      en: { bom: findingsBomPresent, crlf: findingsUsesCrLf, formulaSafe: findingsFormulaSafe, filenameLocalized: findingsFilenameLocalized, containsMarker: findingsContainsMarker },
      ru: { bom: russianBomPresent, crlf: russianUsesCrLf, formulaSafe: russianFormulaSafe, filenameLocalized: russianFilenameLocalized, headerLocalized: russianHeaderLocalized, containsMarker: russianContainsMarker, header: russianHeaderSnippet },
    },
    cleanExportAvailable,
    cleanExport,
    summaryExportAvailable,
    summaryExport,
    syntheticInvoiceDataSentToServer: leakedRequests.length > 0,
    dnt: true,
    failures,
  }));

  assert.deepEqual(failures, [], failures.join("; "));
  await context.close();
} finally {
  await browser.close();
}
