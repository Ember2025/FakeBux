let targetRobux = "10,000,000";

// Retrieve custom value from local chrome storage
chrome.storage.sync.get(["customRobux"], (data) => {
  if (data.customRobux !== undefined) {
    targetRobux = data.customRobux;
    applyChange();
  }
});

// Real-time listener when user clicks Apply Change
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "update") {
    targetRobux = request.value;
    applyChange();
    sendResponse({ status: "done" });
  }
});

function applyChange() {
  if (targetRobux === null || targetRobux === undefined) return;

  // Search for all variations of Roblox Robux text containers
  const selectors = [
    "#nav-robux-amount",
    ".nav-robux-amount",
    "#nav-robux-balance",
    ".robux-balance",
    "[id*='nav-robux']",
    "[class*='nav-robux']"
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el && el.textContent !== targetRobux) {
        el.textContent = targetRobux;
      }
    });
  });
}

// Loop to override Roblox dynamic UI re-renders
setInterval(applyChange, 250);
