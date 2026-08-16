let targetRobux = "10,000,000";

// Load saved custom number on page start
chrome.storage.sync.get(["customRobux"], (data) => {
  if (data.customRobux) {
    targetRobux = data.customRobux;
    applyChange();
  }
});

// Listen for live updates from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "update") {
    targetRobux = request.value;
    applyChange();
    sendResponse({ status: "success" });
  }
});

function applyChange() {
  if (!targetRobux) return;

  // Header navigation bar counter
  const navAmount = document.getElementById("nav-robux-amount");
  if (navAmount) {
    navAmount.textContent = targetRobux;
  }

  // Any additional Robux text elements on the page
  const balanceElements = document.querySelectorAll(".robux-balance, .nav-robux-balance");
  balanceElements.forEach((el) => {
    el.textContent = targetRobux;
  });
}

// Continuous check for dynamic page re-renders
setInterval(applyChange, 500);
