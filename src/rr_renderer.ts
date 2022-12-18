import { ipcRenderer } from "electron";

const channelName = `R2rBridge:getPort`;
export class R2rBridgeRenderer {
  private static portMap = new Map();
  private static _getPortFromCache(handleId: string): any {
    if (handleId && this.portMap.has(handleId)) {
      return this.portMap.get(handleId);
    } else {
      return null;
    }
  }
  static getClientPort(handleId?: string) {
    return new Promise<MessagePort>((resolve, reject) => {
      if (!handleId) {
        handleId = "default";
      }

      let port = this._getPortFromCache(handleId);
      if (port) {
        resolve(port);
        return;
      }
      let timeout: any = setTimeout(() => {
        reject("timeout");
      }, 1000);
      //   const _channelName = `${channelName}-client`;
      ipcRenderer.send(channelName);
      ipcRenderer.once(channelName + "-reply", (event) => {
        console.log(channelName + "-reply", event);
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        const [port] = event.ports;
        this.portMap.set(handleId, port);
        resolve(port);
      });
    });
  }

  static getServicePort(handleId?: string) {
    return new Promise<MessagePort>((resolve, reject) => {
      if (!handleId) {
        handleId = "default";
      }
      let port = this._getPortFromCache(handleId);
      if (port) {
        resolve(port);
        return;
      }
      ipcRenderer.once(channelName + "-reply", (event) => {
        console.log(channelName + "-reply", event);
        const [port] = event.ports;
        this.portMap.set(handleId, port);
        resolve(port);
      });
    });
  }

  static close(port?: MessagePort) {
    if (port == null) {
      this.portMap.forEach((k, v) => {
        v.close();
      });
      this.portMap.clear();
    } else {
      var key = null;
      this.portMap.forEach((k, v) => {
        if (port === v) {
          key = v;
        }
      });
      if (key) {
        this.portMap.delete(key);
      }
    }
  }
}
