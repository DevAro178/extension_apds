document.getElementById("signin").addEventListener("click", function () {
  chrome.storage.local.get(null, (data) => {
    alert(`Stored JWT Token: ${data.jwt || "No token found!"}`);
    console.log("Stored JWT Token:", data);
  });
});
