(function (root) {
  "use strict";

  function downloadBlob(blob, filename, dependencies) {
    const deps = dependencies || {};
    const doc = deps.document || root.document || (typeof document !== "undefined" ? document : null);
    const urlApi = deps.URL || root.URL || (typeof URL !== "undefined" ? URL : null);
    const schedule = deps.setTimeout || root.setTimeout || (typeof setTimeout === "function" ? setTimeout : null);

    if (
      !doc ||
      !doc.body ||
      typeof doc.createElement !== "function" ||
      !urlApi ||
      typeof urlApi.createObjectURL !== "function" ||
      typeof urlApi.revokeObjectURL !== "function" ||
      typeof schedule !== "function"
    ) {
      throw new Error("Browser download is unavailable.");
    }

    const objectUrl = urlApi.createObjectURL(blob);
    let anchor = null;
    let attached = false;
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;

      if (attached && anchor) {
        try {
          doc.body.removeChild(anchor);
        } catch {
          // Revoking the object URL is still required if DOM cleanup fails.
        }
        attached = false;
      }

      try {
        urlApi.revokeObjectURL(objectUrl);
      } catch {
        // Cleanup is best-effort and must not mask the original download error.
      }
    };

    try {
      anchor = doc.createElement("a");
      anchor.href = objectUrl;
      anchor.download = String(filename || "");
      doc.body.appendChild(anchor);
      attached = true;
      anchor.click();

      try {
        schedule(cleanup, 0);
      } catch {
        cleanup();
      }

      return true;
    } catch (error) {
      cleanup();
      throw error;
    }
  }

  root.InvoiceGuardDownload = Object.freeze({ downloadBlob });
})(typeof window !== "undefined" ? window : globalThis);
