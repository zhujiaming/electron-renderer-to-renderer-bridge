const { R2rBridgeRenderer } = require("../dist/rr_renderer");

async function callService() {
  const port = await R2rBridgeRenderer.getClientPort();
  port.postMessage("hello service,wait reply");
  port.onmessage = (ev) => {
    console.log("[service reply]:", ev.data);
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }

  callService();
});

window.addEventListener("close", (e) => {
  R2rBridgeRenderer.close();
});
