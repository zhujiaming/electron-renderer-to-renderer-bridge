"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2rBridgeRenderer = void 0;
var electron_1 = require("electron");
var channelName = "R2rBridge:getPort";
var R2rBridgeRenderer = /** @class */ (function () {
    function R2rBridgeRenderer() {
    }
    R2rBridgeRenderer._getPortFromCache = function (handleId) {
        if (handleId && this.portMap.has(handleId)) {
            return this.portMap.get(handleId);
        }
        else {
            return null;
        }
    };
    R2rBridgeRenderer.getClientPort = function (handleId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!handleId) {
                handleId = "default";
            }
            var port = _this._getPortFromCache(handleId);
            if (port) {
                resolve(port);
                return;
            }
            var timeout = setTimeout(function () {
                reject("timeout");
            }, 1000);
            //   const _channelName = `${channelName}-client`;
            electron_1.ipcRenderer.send(channelName);
            electron_1.ipcRenderer.once(channelName + "-reply", function (event) {
                console.log(channelName + "-reply", event);
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                var port = event.ports[0];
                _this.portMap.set(handleId, port);
                resolve(port);
            });
        });
    };
    R2rBridgeRenderer.getServicePort = function (handleId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!handleId) {
                handleId = "default";
            }
            var port = _this._getPortFromCache(handleId);
            if (port) {
                resolve(port);
                return;
            }
            electron_1.ipcRenderer.once(channelName + "-reply", function (event) {
                console.log(channelName + "-reply", event);
                var port = event.ports[0];
                _this.portMap.set(handleId, port);
                resolve(port);
            });
        });
    };
    R2rBridgeRenderer.close = function (port) {
        if (port == null) {
            this.portMap.forEach(function (k, v) {
                v.close();
            });
            this.portMap.clear();
        }
        else {
            var key = null;
            this.portMap.forEach(function (k, v) {
                if (port === v) {
                    key = v;
                }
            });
            if (key) {
                this.portMap.delete(key);
            }
        }
    };
    R2rBridgeRenderer.portMap = new Map();
    return R2rBridgeRenderer;
}());
exports.R2rBridgeRenderer = R2rBridgeRenderer;
