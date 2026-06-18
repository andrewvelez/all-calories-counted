
const status = document.querySelector("#status");

/**
 * @param {string} message
 */
function setStatus(message) {
  if (status) {
    status.textContent = message ?? "";
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    setStatus("Service workers are not supported in this browser.");
    return;
  }

  try {
    await navigator.serviceWorker.register("/sw.js");
    setStatus("Service worker registered. This app is PWA-ready.");
  } catch (error) {
    console.error(error);
    setStatus("Service worker registration failed. See the console for details.");
  }
}

window.addEventListener("load", registerServiceWorker);
