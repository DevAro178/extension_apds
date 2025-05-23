const ElementIdentifier = "uniqueRandomClassNameisHere";

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

const insertItem = (table, customElement) => {
  const lists = table.querySelectorAll("tr td ul");
  lists.forEach((ul) => {
    if (ul.getElementsByClassName(ElementIdentifier).length === 0) {
      const newElement = customElement.cloneNode(true);
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
