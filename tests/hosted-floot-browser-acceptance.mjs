import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const target = new URL(
  process.env.INVOICEGUARD_HOSTED_URL || "https://invoiceguard.floot.app/",
);
const privateMarker = "QUALISIFT_HOSTED_PRIVATE_MARKER";
const hostileVendor = '=HYPERLINK("https://example.invalid","' + privateMarker + '")';
const csv = [
  "Invoice No,Supplier,Invoice Date,Net Amount,VAT,Amount Due,Currency Code",
  'INV-001,"Northstar Supply",2026-11-01,100.00,10.00,110.00,USD',
  'INV-002,"' + hostileVendor.replaceAll('"', '""') + '",2026-11-02,200.00,20.00,220.00,USD',
  'INV-002,"' + hostileVendor.replaceAll('"', '""') + '",2026-11-03,200.00,20.00,220.00,USD',
].join("\r\n");

const leakedRequests = [];
const downloadNames = [];
const strictCrLf = (value) =>
  value.includes("\r\n") && !/(^|[^\r])\n/.test(value);

async function captureDownload(page, button) {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    button.click(),
  ]);
  const path = await download.path();
  assert.ok(path, "Browser download should be available");
  const bytes = await readFile(path);
  return {
    filename: download.suggestedFilename(),
    bytes,
    text: bytes.toString("utf8"),
  };
}

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

  const response = await page.goto(target.href, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  assert.ok(
    response?.ok(),
    "Published InvoiceGuard did not load: HTTP " + response?.status(),
  );
  assert.match(await page.title(), /InvoiceGuard/i);

  const fileInput = page.locator('input[type="file"]').first();
  assert.ok((await fileInput.count()) > 0, "Hosted build must expose a CSV file input");
  await fileInput.setInputFiles({
    name: "qualisift-hosted-private-sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(csv, "utf8"),
  });

  const findingsEnButton = page.getByRole("button", {
    name: "Export findings CSV",
    exact: true,
  });
  await findingsEnButton.waitFor({ state: "visible", timeout: 30_000 });
  const table = page.locator("table").first();
  await table.waitFor({ state: "visible", timeout: 15_000 });
  const findingRows = await table.locator("tbody tr").count();
  const tableText = await table.innerText();
  assert.ok(findingRows >= 1, "Hosted audit should show at least one finding");
  assert.match(tableText, /INV-002/);
  assert.match(tableText, /duplicate/i);

  const findingsEn = await captureDownload(page, findingsEnButton);
  const findingsEnSafe =
    findingsEn.text.includes("'=HYPERLINK(") &&
    !findingsEn.text.includes('"=HYPERLINK(');

  const languageSelect = page.locator("select").first();
  assert.ok((await languageSelect.count()) > 0, "Hosted build must expose a language selector");
  await languageSelect.selectOption("ru");

  const findingsRu = await captureDownload(
    page,
    page.getByRole("button", { name: "Скачать CSV с результатами", exact: true }),
  );
  const cleanRu = await captureDownload(
    page,
    page.getByRole("button", { name: "Скачать очищенный CSV", exact: true }),
  );
  const summaryRu = await captureDownload(
    page,
    page.getByRole("button", { name: "Скачать сводку перед оплатой", exact: true }),
  );

  const findingsRuSafe =
    findingsRu.text.includes("'=HYPERLINK(") &&
    !findingsRu.text.includes('"=HYPERLINK(');
  const cleanSafe =
    cleanRu.text.includes("'=HYPERLINK(") &&
    !cleanRu.text.includes('"=HYPERLINK(');
  const findingsEnBom = findingsEn.text.startsWith("\uFEFF");
  const findingsRuBom = findingsRu.text.startsWith("\uFEFF");
  const cleanBom = cleanRu.text.startsWith("\uFEFF");
  const summaryBom = summaryRu.text.startsWith("\uFEFF");
  const findingsEnCrlf = strictCrLf(findingsEn.text);
  const findingsRuCrlf = strictCrLf(findingsRu.text);
  const cleanCrlf = strictCrLf(cleanRu.text);
  const findingsRuLocalized =
    findingsRu.text.split(/\r?\n/, 1)[0].toLocaleLowerCase("ru-RU").includes("строка");
  const summaryTitle = summaryRu.text.includes("INVOICEGUARD — ПРОВЕРКА ПЕРЕД ОПЛАТОЙ");
  const summaryCount = summaryRu.text.includes("Проверено счетов: 3");
  const summaryHasEvidence = summaryRu.text.includes(privateMarker);
  const findingsEnHasEvidence = findingsEn.text.includes(privateMarker);
  const findingsRuHasEvidence = findingsRu.text.includes(privateMarker);
  const cleanHasEvidence = cleanRu.text.includes(privateMarker);

  await page.waitForTimeout(150);
  const failures = [];
  if (!findingsEnBom) failures.push("English findings CSV is missing UTF-8 BOM");
  if (!findingsRuBom) failures.push("Russian findings CSV is missing UTF-8 BOM");
  if (!cleanBom) failures.push("Clean-invoice CSV is missing UTF-8 BOM");
  if (!summaryBom) failures.push("Payment-review TXT is missing UTF-8 BOM");
  if (!findingsEnCrlf) failures.push("English findings CSV is not strict CRLF");
  if (!findingsRuCrlf) failures.push("Russian findings CSV is not strict CRLF");
  if (!cleanCrlf) failures.push("Clean-invoice CSV is not strict CRLF");
  if (!findingsEnSafe) failures.push("English findings CSV leaves formula-like cells executable");
  if (!findingsRuSafe) failures.push("Russian findings CSV leaves formula-like cells executable");
  if (!cleanSafe) failures.push("Clean-invoice CSV leaves formula-like cells executable");
  if (!findingsRuLocalized) failures.push("Russian findings headers are not localized");
  if (findingsEn.filename !== "invoiceguard-findings-en.csv") failures.push("English findings filename is not localized");
  if (findingsRu.filename !== "invoiceguard-findings-ru.csv") failures.push("Russian findings filename is not localized");
  if (cleanRu.filename !== "invoiceguard-clean-invoices.csv") failures.push("Clean-invoice filename is unexpected");
  if (!/payment-review-ru\.txt$/i.test(summaryRu.filename)) failures.push("Payment-review filename is not localized");
  if (!findingsEnHasEvidence || !findingsRuHasEvidence || !cleanHasEvidence || !summaryHasEvidence) {
    failures.push("One or more exports omit the uploaded synthetic evidence row");
  }
  if (!summaryTitle || !summaryCount) failures.push("Russian payment-review summary content is incomplete");
  if (downloadNames.length !== 4) failures.push("Expected exactly four downloads, received " + downloadNames.length);
  if (leakedRequests.length) failures.push("Synthetic invoice content appeared in a request URL or POST body");

  console.log(JSON.stringify({
    result: failures.length ? "FAIL" : "PASS",
    target: target.origin,
    uploadedRows: 3,
    findingRows,
    downloads: downloadNames,
    checks: {
      findingsEnBom, findingsRuBom, cleanBom, summaryBom,
      findingsEnCrlf, findingsRuCrlf, cleanCrlf,
      findingsEnSafe, findingsRuSafe, cleanSafe,
      findingsRuLocalized, summaryTitle, summaryCount,
      findingsEnHasEvidence, findingsRuHasEvidence, cleanHasEvidence, summaryHasEvidence,
      syntheticInvoiceDataSentToServer: leakedRequests.length > 0,
    },
    failures,
  }));

  assert.deepEqual(failures, [], failures.join("; "));
  await context.close();
} finally {
  await browser.close();
}
