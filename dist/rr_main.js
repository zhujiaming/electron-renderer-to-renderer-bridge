"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2rBridgeMain = void 0;
var electron_1 = require("electron");
var channelName = "R2rBridge:getPort";
var R2rBridgeMain = /** @class */ (function () {
    function R2rBridgeMain() {
    }
    R2rBridgeMain.init = function (window1, window2) {
        R2rBridgeMain.check(window1, window2);
        electron_1.ipcMain.on(channelName, function (event) {
            var _a = new electron_1.MessageChannelMain(), port1 = _a.port1, port2 = _a.port2;
            var t = event.sender.id;
            var vs = [window1.webContents.id, window2.webContents.id];
            if (vs.indexOf(t) >= 0) {
                window1.webContents.postMessage(channelName + "-reply", null, [port1]);
                window2.webContents.postMessage(channelName + "-reply", null, [port2]);
            }
            else {
                throw new Error("window can not support port!");
            }
        });
    };
    R2rBridgeMain.check = function (window1, window2) {
        // TOOD check window is alive
    };
    return R2rBridgeMain;
}());
exports.R2rBridgeMain = R2rBridgeMain;
