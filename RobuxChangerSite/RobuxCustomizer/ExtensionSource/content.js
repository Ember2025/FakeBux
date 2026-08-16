let targetRobux = null;

// Fetch saved value on startup
chrome.storage.sync.get(["customRobux"], (data) => {
  if (data.customRobux !== undefined && data.customRobux !== "") {
    targetRobux = data.customRobux;
    applyOverlay();
  }
});

// Receive update directly from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "update" && request.value !== undefined) {
    targetRobux = request.value;
    applyOverlay();
    sendResponse({ status: "success" });
  }
});

function applyOverlay() {
  if (!targetRobux) return;

  // 1. Direct ID check
  const realAmount = document.getElementById("nav-robux-amount");
  if (!realAmount) return; // FIXED: Added exclamation mark here!

  // Hide the original text without breaking the layout
  realAmount.style.opacity = "0";
  realAmount.style.pointerEvents = "none";

  // 2. Check if fake overlay element already exists
  let fakeElement = document.getElementById("custom-robux-overlay");

  if (!fakeElement) {
    fakeElement = document.createElement("span");
    fakeElement.id = "custom-robux-overlay";
    fakeElement.style.position = "absolute";
    fakeElement.style.left = "0";
    fakeElement.style.top = "0";
    fakeElement.style.color = "#ffffff";
    fakeElement.style.fontWeight = "bold";
    fakeElement.style.fontSize = window.getComputedStyle(realAmount).fontSize;

    // Ensure parent container supports absolute positioning
    if (realAmount.parentElement) {
      realAmount.parentElement.style.position = "relative";
      realAmount.parentElement.appendChild(fakeElement);
    }
  }

  // 3. Update the overlay text
  if (fakeElement.textContent !== targetRobux) {
    fakeElement.textContent = targetRobux;
  }
}

// Keep checking in case Roblox re-renders the DOM
setInterval(applyOverlay, 200);
