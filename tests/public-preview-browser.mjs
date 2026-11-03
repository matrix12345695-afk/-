import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const target = new URL(
  process.env.INVOICEGUARD_PUBLIC_URL || "https://invoiceguard.floot.app",
);
const privateMarker = "QUALISIFT_C671_PRIVATE_MARKER";
const hostileVendor = `=HYPERLINK("https://example.invalid","${privateMarker}")`;
const csv = [
  "invoice_number,vendor,date,subtotal,tax,total,currency",
  `INV-001,"${hostileVendor.replaceAll('"', '""')}",2026-11-01,100.00,10.00,110.00,USD`,
  `INV-002,"${hostileVendor.replaceAll('"', '""')}",2026-11-02,100.00,10.00,110.00,USD`,
  `INV-002,"${hostileVendor.replaceAll('"', '""')}",2026-11-03,100.00,10.00,110.00,USD`,
].join("\r\n");

const leakedRequests = [];
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    acceptDownloads: true,
    locale: "en-US",
    extraHTTPHeaders: { DNT: "1" },
  });
  const page = await context.newPage();

  page.on("request", (request) => {
    const body =
      request.postData() ||
      request.postDataBuffer()?.toString("utf8") ||
      "";
    if (request.url().includes(privateMarker) || body.includes(privateMarker)) {
      leakedRequests.push({
        method: request.method(),
        url: request.url(),
      });
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
  assert.ok(
    (await fileInput.count()) > 0,
    "The published preview must expose a CSV file input",
  );
  await fileInput.setInputFiles({
    name: "qualisift-c671-private-sample.csv",
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
  assert.ok(findingsPath, "Findings CSV download should be available");
  const findingsCsv = await readFile(findingsPath, "utf8");
  const findingsBomPresent = findingsCsv.startsWith("\uFEFF");
  const findingsUsesCrLf = findingsCsv.includes("\r\n");
  assert.ok(findingsCsv.includes(privateMarker), "Synthetic evidence should remain in the local export");
  assert.ok(
    findingsCsv.includes("'=HYPERLINK("),
    "Public findings CSV must neutralize formula-like vendor text",
  );
  assert.ok(
    !findingsCsv.includes('"=HYPERLINK('),
    "Public findings CSV must not leave a formula-leading cell executable",
  );

  const languageSelect = page.locator("select").first();
  assert.ok((await languageSelect.count()) > 0, "The public preview should expose its language selector");
  await languageSelect.selectOption("ru");
  const russianButton = page.locator("button").filter({ hasText: /CSV/i }).first();
  await russianButton.waitFor({ state: "visible", timeout: 10_000 });
  const [russianDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    russianButton.click(),
  ]);
  const russianPath = await russianDownload.path();
  assert.ok(russianPath, "Russian findings CSV download should be available");
  const russianCsv = await readFile(russianPath, "utf8");
  const russianBomPresent = russianCsv.startsWith("\uFEFF");
  assert.ok(russianCsv.includes("строка"), "Russian findings export should localize its headers");
  assert.ok(russianCsv.includes("'=HYPERLINK("));

  const cleanExportAvailable =
    (await page.getByRole("button", { name: /clean.*CSV|CSV.*clean/i }).count()) > 0;
  const summaryExportAvailable =
    (await page.getByRole("button", { name: /summary|сводк|сводный/i }).count()) > 0;

  assert.deepEqual(
    leakedRequests,
    [],
    "The synthetic private marker must never appear in a request URL or POST body",
  );

  console.log(
    JSON.stringify({
      result: "PASS",
      target: target.origin,
      uploadedRows: 3,
      findingsTableRows: rows,
      downloads: [
        findingsDownload.suggestedFilename(),
        russianDownload.suggestedFilename(),
      ],
      formulaInjectionNeutralized: true,
      syntheticInvoiceDataSentToServer: false,
      findingsBomPresent,
      findingsUsesCrLf,
      russianBomPresent,
      dnt: true,
      cleanExportAvailable,
      summaryExportAvailable,
      note: "This smoke verifies only controls actually exposed by the published Floot preview.",
    }),
  );
  await context.close();
} finally {
  await browser.close();
}
