chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "USER_LOGIN") {
      const { action, ...data } = message;
      chrome.storage.local.clear(() => {
        chrome.storage.local.set({ ...data }, () => {});
      });
      sendResponse({ success: true, message: "User Logged In!" });
    } else if (message.action === "USER_LOGOUT") {
      chrome.storage.local.clear();
      sendResponse({ success: true, message: "User Logged Out!" });
    }
  }
);
