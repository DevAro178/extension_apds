const isLoaded = () => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const loadingElement = document.querySelector("#loading");
      if (loadingElement && loadingElement.style.display === "none") {
        clearInterval(intervalId);
        resolve(true);
      }
    }, 500);
  });
};

const insertItem = (table, customElement) => {
  const lists = table.querySelectorAll("tr td ul");
  lists.forEach((ul) => {
    const newElement = customElement.cloneNode(true);

    newElement.addEventListener("click", () => {
      const threadIdElement = ul.parentNode.parentNode.querySelector(
        "span[data-legacy-thread-id]"
      );
      if (threadIdElement) {
        const threadId = threadIdElement.getAttribute("data-legacy-thread-id");
        console.log("Thread ID:", threadId);
        alert(`Thread ID: ${threadId}`);
      } else {
        console.warn("No element with data-legacy-thread-id found.");
      }
    });
    ul.insertBefore(newElement, ul.firstChild);
  });
};

const findTable = (element) => {
  const tables = element.querySelectorAll("table");
  const customElement = document.createElement("li");
  customElement.className = "bqX brq";
  customElement.setAttribute("data-tooltip", "Check Email");

  tables.forEach((table) => {
    insertItem(table, customElement);
  });
};

isLoaded().then((loaded) => {
  if (loaded) {
    console.log("Loading element is hidden. Proceeding...");
    const tabPanelDivs = document.querySelectorAll('div[role="tabpanel"]');
    if (tabPanelDivs.length > 0) {
      // findTable(tabPanelDivs[0]);
      tabPanelDivs.forEach((element) => {
        findTable(element);
      });
    } else {
      console.warn("No tabpanel div found.");
    }
  }
});
