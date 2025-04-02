if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    alert("Hello World");
  });
} else {
  // DOM is already loaded
  alert("Hello World");
}
