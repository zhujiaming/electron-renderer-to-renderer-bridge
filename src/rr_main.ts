import { BrowserWindow, ipcMain, MessageChannelMain } from "electron";
const channelName = `R2rBridge:getPort`;
export class R2rBridgeMain {
  static init(window1: BrowserWindow, window2: BrowserWindow) {
    R2rBridgeMain.check(window1, window2);
    ipcMain.on(channelName, (event) => {
      const { port1, port2 } = new MessageChannelMain();
      let t = event.sender.id;
      let vs = [window1.webContents.id, window2.webContents.id];
      if (vs.indexOf(t) >= 0) {
        window1.webContents.postMessage(channelName + "-reply", null, [port1]);
        window2.webContents.postMessage(channelName + "-reply", null, [port2]);
      } else {
        throw new Error("window can not support port!");
      }
    });
  }
  private static check(window1: BrowserWindow, window2: BrowserWindow) {
    // TOOD check window is alive
  }
}
