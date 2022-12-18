const { R2rBridgeRenderer } = require("../dist/rr_renderer");

async function waitClient() {
  const port = await R2rBridgeRenderer.getServicePort();
  port.onmessage = (ev) => {
    console.log("[from client message]:", ev.data);
    port.postMessage("this message is from service!");
  };
  port.start();
}

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
  waitClient();
});

window.addEventListener("close", (e) => {
  R2rBridgeRenderer.close();
});
