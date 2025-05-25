document.addEventListener("DOMContentLoaded", function () {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "UPDATE_POPUP" && message.name) {
      document.querySelector(".username").innerText = message.name;
      document.querySelector(".authorized").style.display = "flex";
      document.querySelector(".unauthorized").style.display = "none";
    }
  });

  // Initial check for user data
  chrome.storage.local.get(null, (data) => {
    if (data.name) {
      document.querySelector(".username").innerText = data.name;
      document.querySelector(".authorized").style.display = "flex";
      document.querySelector(".unauthorized").style.display = "none";
    } else {
      document.querySelector(".authorized").style.display = "none";
      document.querySelector(".unauthorized").style.display = "flex";
    }
  });
});
document.querySelectorAll(".redirectBtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = config.dashboard_url;
    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("Dashboard URL is not defined in the config.");
    }
  });
});
