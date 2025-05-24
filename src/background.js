chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "USER_LOGIN") {
      const { action, ...data } = message;
      chrome.storage.local.get(null, (existingData) => {
        const updatedData = {};

        // Replace only the keys that already exist in storage
        for (const key in data) {
          // if (key in existingData) {
          updatedData[key] = data[key];
          // }
        }

        // Explicitly set isAuthenticated regardless
        updatedData.isAuthenticated = true;

        chrome.storage.local.set(updatedData, () => {
          chrome.runtime.sendMessage({
            action: "UPDATE_POPUP",
            name: data.name,
          });
        });
      });

      sendResponse({ success: true, message: "User Logged In!" });
    } else if (message.action === "USER_LOGOUT") {
      chrome.storage.local.remove(["isAuthenticated", "access_token", "name"]);
      sendResponse({ success: true, message: "User Logged Out!" });
    }
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "THREAD_ID") {
    sendMessageToBackend(message.threadId);
  }
});

let sendMessageToBackend = (message_id) => {
  chrome.storage.local.get("access_token", (result) => {
    if (result.access_token) {
      console.log(result.access_token, message_id);

      const backend_url = "localhost";
      fetch(`http://${backend_url}:8000/api/spam-classifier/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${result.access_token}`,
        },
        body: JSON.stringify({ message_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response:", data);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "classifiedEmailResponse", data, message_id },
                (response) => {
                  if (chrome.runtime.lastError) {
                    console.error(
                      "Message failed:",
                      chrome.runtime.lastError.message
                    );
                  } else {
                    console.log("Response from main.js:", response);
                  }
                }
              );
            } else {
              console.error("No active tab found.");
            }
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  });
  // fetch("https://jsonplaceholder.typicode.com/posts/1")
  //   .then((response) => response.json())
  //   .then((data) => console.log("Response:", data))
  //   .catch((error) => console.error("Error:", error));
};
