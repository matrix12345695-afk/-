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
  await page.locator("#file").waitFor({ state: "attached", timeout: 15_000 });

  await page.locator("#file").setInputFiles({
    name: "qualisift-c671-private-sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(csv, "utf8"),
  });

  await page.locator("#results").waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(
    () => document.querySelectorAll("#findings tr").length > 0,
    null,
    { timeout: 15_000 },
  );
  assert.equal((await page.locator("#count").textContent())?.trim(), "3");
  assert.ok((await page.locator("#findings tr").count()) > 0);

  const [cleanDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    page.locator("#downloadClean").click(),
  ]);
  assert.equal(cleanDownload.suggestedFilename(), "invoiceguard-clean-invoices.csv");
  const cleanPath = await cleanDownload.path();
  assert.ok(cleanPath, "clean CSV download should be available to the browser runner");
  const cleanCsv = await readFile(cleanPath, "utf8");
  assert.ok(cleanCsv.startsWith("\uFEFF"), "clean CSV should retain its UTF-8 BOM");
  assert.ok(cleanCsv.includes("'=HYPERLINK("), "clean CSV should neutralize formula-like vendor text");
  assert.ok(cleanCsv.includes(privateMarker), "synthetic marker should remain in the local export");

  const [findingsDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    page.locator("#download").click(),
  ]);
  assert.equal(findingsDownload.suggestedFilename(), "invoiceguard-findings-en.csv");
  const findingsPath = await findingsDownload.path();
  assert.ok(findingsPath, "findings CSV download should be available to the browser runner");
  const findingsCsv = await readFile(findingsPath, "utf8");
  assert.ok(findingsCsv.startsWith("\uFEFF"), "findings CSV should retain its UTF-8 BOM");
  assert.ok(findingsCsv.includes("'=HYPERLINK("), "findings CSV should neutralize formula-like vendor text");
  assert.ok(findingsCsv.includes(privateMarker), "findings CSV should preserve the synthetic evidence");

  await page.locator("#language").selectOption("ru");
  const [russianDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15_000 }),
    page.locator("#download").click(),
  ]);
  assert.equal(russianDownload.suggestedFilename(), "invoiceguard-findings-ru.csv");
  const russianPath = await russianDownload.path();
  assert.ok(russianPath, "Russian findings CSV download should be available");
  const russianCsv = await readFile(russianPath, "utf8");
  assert.ok(russianCsv.startsWith("\uFEFF"));
  assert.ok(russianCsv.includes('"строка"'), "Russian export should use localized headers");
  assert.ok(russianCsv.includes("'=HYPERLINK("));

  assert.deepEqual(
    leakedRequests,
    [],
    "the synthetic private marker must never appear in a request URL or POST body",
  );

  console.log(
    JSON.stringify({
      result: "PASS",
      target: target.origin,
      uploadedRows: 3,
      findingsRows: await page.locator("#findings tr").count(),
      downloads: [
        cleanDownload.suggestedFilename(),
        findingsDownload.suggestedFilename(),
        russianDownload.suggestedFilename(),
      ],
      formulaInjectionNeutralized: true,
      syntheticWorkbookDataSentToServer: false,
      dnt: true,
    }),
  );
  await context.close();
} finally {
  await browser.close();
}
