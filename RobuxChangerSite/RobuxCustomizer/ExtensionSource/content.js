let targetRobux = "10,000,000";

chrome.storage.sync.get(["customRobux"], (data) => {
  if (data.customRobux) {
    targetRobux = data.customRobux;
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "update") {
    targetRobux = request.value;
    applyChange();
  }
});

function applyChange() {
  const navAmount = document.getElementById("nav-robux-amount");
  if (navAmount && navAmount.textContent !== targetRobux) {
    navAmount.textContent = targetRobux;
  }

  const balanceElements = document.querySelectorAll(".robux-balance, .nav-robux-balance");
  balanceElements.forEach((el) => {
    if (el.textContent !== targetRobux) {
      el.textContent = targetRobux;
    }
  });
}

setInterval(applyChange, 500);