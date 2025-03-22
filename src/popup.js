document.getElementById("signin").addEventListener("click", () => {
  //   chrome.runtime.sendMessage({ action: "signin" });
  chrome.runtime.sendMessage({ message: "login" }, function (response) {
    if (response === "success") window.close();
  });
});

// // Listen for storage updates
// chrome.storage.local.get(["user", "emails"], (data) => {
//   if (data.user) {
//     document.getElementById("user-info").innerHTML = `
//         <h2>Welcome, ${data.user.email}</h2>
//       `;
//   }
//   if (data.emails) {
//     document.getElementById("emails").innerHTML = `
//         <h3>Your Emails:</h3>
//         <ul>
//           ${data.emails.map((email) => `<li>${email.id}</li>`).join("")}
//         </ul>
//       `;
//   }
// });
