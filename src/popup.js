document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signin").addEventListener("click", function () {
    chrome.storage.local.get(null, (data) => {
      alert(`Stored JWT Token: ${data.jwt || "No token found!"}`);
      console.log("Stored JWT Token:", data);
    });
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "UPDATE_POPUP" && message.name) {
      document.querySelector(".username").innerText = message.name;
      document.querySelector(".authorized").style.display = "block";
      document.querySelector(".unauthorized").style.display = "none";
    }
  });

  // Initial check for user data
  chrome.storage.local.get(null, (data) => {
    if (data.name) {
      document.querySelector(".username").innerText = data.name;
      document.querySelector(".authorized").style.display = "block";
      document.querySelector(".unauthorized").style.display = "none";
    } else {
      document.querySelector(".authorized").style.display = "none";
      document.querySelector(".unauthorized").style.display = "block";
    }
  });
});
