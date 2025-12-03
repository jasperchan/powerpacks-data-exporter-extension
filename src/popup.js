const browser = globalThis.browser || globalThis.chrome;

const statusEl = document.getElementById("status");
const progressEl = document.getElementById("progress");
const downloadBtn = document.getElementById("downloadBtn");

function setStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function setProgress(message) {
  progressEl.textContent = message;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Listen for progress updates from background
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "progress") {
    if (message.status === "fetching") {
      setStatus(`Fetching ${message.type} items...`, "info");
    } else if (message.current && message.total) {
      setProgress(
        `${message.type}: Page ${message.current}/${message.total} (${message.items} items)`
      );
    }
  }
});

downloadBtn.addEventListener("click", async () => {
  downloadBtn.disabled = true;
  setProgress("");

  try {
    // First check if we're on the right domain
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.url?.startsWith("https://powerpacks.gamestop.com")) {
      setStatus("Please navigate to powerpacks.gamestop.com first.", "error");
      downloadBtn.disabled = false;
      return;
    }

    setStatus("Checking authentication...", "info");

    const response = await browser.runtime.sendMessage({
      action: "fetchCollections",
    });

    if (!response.success) {
      setStatus(response.error, "error");
      downloadBtn.disabled = false;
      return;
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    const filename = `powerpacks-collection-${timestamp}.txt`;

    downloadFile(response.data, filename);
    setStatus(`Downloaded ${response.count} items!`, "success");
    setProgress("");
  } catch (error) {
    console.error("Error:", error);
    setStatus(`Error: ${error.message}`, "error");
  } finally {
    downloadBtn.disabled = false;
  }
});

// Check initial state
(async () => {
  try {
    const hasCookie = await browser.runtime.sendMessage({
      action: "checkCookie",
    });
    if (hasCookie) {
      setStatus("Ready to export your collection.", "info");
    } else {
      setStatus(
        "Please log in to https://powerpacks.gamestop.com first.",
        "error"
      );
    }
  } catch (error) {
    // Ignore - might not be on the right page
  }
})();
