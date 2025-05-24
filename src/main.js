const ElementIdentifier = "uniqueRandomClassNameisHere";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in main.js:", message);
  if (message.action === "classifiedEmailResponse") {
    const element = document.getElementById(message.message_id);

    if (!!element) {
      if (message.data.status === "success") {
        const parent = element.parentNode?.parentNode?.parentNode;
        if (parent) {
          if (message.data.classified === "spam") {
            parent.style.backgroundColor = "#ffa8a8";
            parent.style.color = "white";
            chrome.storage.local.set({ [message.message_id]: "spam" });
          } else if (message.data.classified === "legitimate") {
            parent.style.backgroundColor = "#b2f2bb";
            parent.style.color = "white";
            chrome.storage.local.set({ [message.message_id]: "legitimate" });
          } else {
            alert("Something went wrong");
          }
        }
        sendResponse({ success: true, element: element.outerHTML });
      } else {
        alert("Something went wrong");
        sendResponse({ success: false, error: "Classification failed" });
      }
    } else {
      sendResponse({ success: false, error: "Element not found" });
    }

    return true;
  }
});

const isLoaded = () => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const loadingElement = document.querySelector("#loading");
      if (loadingElement && loadingElement.style.display === "none") {
        loadingElement.dataset.DomManipulated = true;
        clearInterval(intervalId);
        resolve(true);
      }
    }, 500);
  });
};
const labelEmail = (message_id) => {
  chrome.storage.local.get([message_id], (result) => {
    const classification = result[message_id];
    const element = document.getElementById(message_id);

    if (element) {
      const parent = element.parentNode?.parentNode?.parentNode;

      if (parent) {
        if (classification === "spam") {
          parent.style.backgroundColor = "#ffa8a8"; // red
        } else if (classification === "legitimate") {
          parent.style.backgroundColor = "#b2f2bb"; // green
        }
      }
    }
  });
};

const insertItem = (table, customElement) => {
  const lists = table.querySelectorAll("tr td ul");
  lists.forEach((ul) => {
    if (ul.getElementsByClassName(ElementIdentifier).length === 0) {
      const newElement = customElement.cloneNode(true);
      const parentThreadIdElement = ul.parentNode.parentNode.querySelector(
        "span[data-legacy-thread-id]"
      );
      if (parentThreadIdElement) {
        const threadId = parentThreadIdElement.getAttribute(
          "data-legacy-thread-id"
        );
        newElement.setAttribute("id", String(threadId));
        labelEmail(threadId);
      }
      newElement.addEventListener("click", () => {
        const threadIdElement = ul.parentNode.parentNode.querySelector(
          "span[data-legacy-thread-id]"
        );
        if (threadIdElement) {
          const threadId = threadIdElement.getAttribute(
            "data-legacy-thread-id"
          );
          chrome.runtime.sendMessage({
            action: "THREAD_ID",
            threadId: threadId,
          });
        } else {
          console.warn("No element with data-legacy-thread-id found.");
        }
      });
      ul.insertBefore(newElement, ul.firstChild);
    }
  });
};

const findTable = (element) => {
  const tables = element.querySelectorAll("table");
  const customElement = document.createElement("li");
  customElement.className = `bqX brq ${ElementIdentifier}`;
  customElement.setAttribute("data-tooltip", "Check Email");

  tables.forEach((table) => {
    insertItem(table, customElement);
  });
};

chrome.storage.local.get("isAuthenticated", (result) => {
  if (result.isAuthenticated) {
    isLoaded().then((loaded) => {
      if (loaded) {
        setInterval(() => {
          const tabPanelDivs = document.querySelectorAll(
            'div[role="tabpanel"]'
          );
          if (tabPanelDivs.length > 0) {
            tabPanelDivs.forEach((element) => {
              if (element.style.display != "none") findTable(element);
            });
          } else {
            console.warn("No tabpanel div found.");
          }
        }, 500);
      }
    });
  }
});
