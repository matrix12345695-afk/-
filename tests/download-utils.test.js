const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("download-utils.js", "utf8");

function createHarness(overrides = {}) {
  const events = [];
  let scheduled;
  const anchor = {
    href: "",
    download: "",
    click() {
      events.push("click");
      if (overrides.click) overrides.click();
    },
  };
  const document = {
    createElement(tag) {
      assert.equal(tag, "a");
      events.push("create-anchor");
      if (overrides.createElement) return overrides.createElement(anchor);
      return anchor;
    },
    body: {
      appendChild(node) {
        events.push("append");
        if (overrides.appendChild) overrides.appendChild(node);
      },
      removeChild(node) {
        events.push("remove");
        if (overrides.removeChild) overrides.removeChild(node);
      },
    },
  };
  const urlApi = {
    createObjectURL(blob) {
      events.push("create-url");
      if (overrides.createObjectURL) return overrides.createObjectURL(blob);
      return "blob:test";
    },
    revokeObjectURL(url) {
      events.push("revoke:" + url);
      if (overrides.revokeObjectURL) overrides.revokeObjectURL(url);
    },
  };
  const schedule = (callback, delay) => {
    events.push("schedule:" + delay);
    if (overrides.setTimeout) return overrides.setTimeout(callback, delay);
    scheduled = callback;
    return 1;
  };
  const window = {};
  const context = { window, document, URL: urlApi, setTimeout: schedule };
  vm.runInNewContext(source, context, { filename: "download-utils.js" });

  return {
    api: window.InvoiceGuardDownload,
    anchor,
    events,
    runScheduled() {
      if (scheduled) scheduled();
    },
  };
}

{
  const harness = createHarness();
  const blob = { type: "text/csv" };
  assert.equal(harness.api.downloadBlob(blob, "invoiceguard-test.csv"), true);
  assert.equal(harness.anchor.href, "blob:test");
  assert.equal(harness.anchor.download, "invoiceguard-test.csv");
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "append",
    "click",
    "schedule:0",
  ]);
  harness.runScheduled();
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "append",
    "click",
    "schedule:0",
    "remove",
    "revoke:blob:test",
  ]);
}

{
  const harness = createHarness({
    click() {
      throw new Error("click failed");
    },
  });
  assert.throws(
    () => harness.api.downloadBlob({}, "failed.csv"),
    /click failed/,
  );
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "append",
    "click",
    "remove",
    "revoke:blob:test",
  ]);
}

{
  const harness = createHarness({
    createElement() {
      throw new Error("anchor creation failed");
    },
  });
  assert.throws(
    () => harness.api.downloadBlob({}, "failed.csv"),
    /anchor creation failed/,
  );
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "revoke:blob:test",
  ]);
}

{
  const harness = createHarness({
    appendChild() {
      throw new Error("anchor attachment failed");
    },
  });
  assert.throws(
    () => harness.api.downloadBlob({}, "failed.csv"),
    /anchor attachment failed/,
  );
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "append",
    "revoke:blob:test",
  ]);
}

{
  const harness = createHarness({
    setTimeout() {
      throw new Error("timer unavailable");
    },
  });
  assert.equal(harness.api.downloadBlob({}, "fallback.csv"), true);
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "append",
    "click",
    "schedule:0",
    "remove",
    "revoke:blob:test",
  ]);
}

{
  const harness = createHarness({
    removeChild() {
      throw new Error("DOM removal failed");
    },
  });
  assert.equal(harness.api.downloadBlob({}, "cleanup.csv"), true);
  assert.doesNotThrow(() => harness.runScheduled());
  assert.deepEqual(harness.events, [
    "create-url",
    "create-anchor",
    "append",
    "click",
    "schedule:0",
    "remove",
    "revoke:blob:test",
  ]);
}

console.log("InvoiceGuard download lifecycle tests passed");
