let targetRobux = null;

// Fetch saved value on startup
chrome.storage.sync.get(["customRobux"], (data) => {
  if (data.customRobux !== undefined && data.customRobux !== "") {
    targetRobux = data.customRobux;
    applyChange();
  }
});

// Receive update directly from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "update" && request.value !== undefined) {
    targetRobux = request.value;
    applyChange();
    sendResponse({ status: "success" });
  }
});

function applyChange() {
  if (!targetRobux) return;

  // 1. Direct ID check
  const navAmount = document.getElementById("nav-robux-amount");
  if (navAmount && navAmount.textContent !== targetRobux) {
    navAmount.textContent = targetRobux;
  }

  // 2. Query selector check for standard Roblox navbar structure
  const robuxContainers = document.querySelectorAll("#nav-robux-container, .nav-robux-container, #nav-robux-balance");
  robuxContainers.forEach((container) => {
    // Find any span inside the container that holds the balance text
    const span = container.querySelector("span") || container;
    if (span && span.textContent !== targetRobux) {
      span.textContent = targetRobux;
    }
  });
}

// Run frequently to beat Roblox's internal React updates
setInterval(applyChange, 100);
