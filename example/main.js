const { app, BrowserWindow } = require("electron");
const path = require("path");
const { R2rBridgeMain } = require("../dist/rr_main");

const createWindow = () => {
  // Create the browser window.
  const clientWin = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Client",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload_client.js"),
    },
  });

  // 加载 index.html
  clientWin.loadFile("./example/index_client.html");

  // 打开开发工具
  clientWin.webContents.openDevTools();

  const serviceWin = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Service",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload_service.js"),
    },
  });

  serviceWin.loadFile("./example/index_service.html");

  serviceWin.webContents.openDevTools();

  return [clientWin, serviceWin];
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  const [cw, sw] = createWindow();

  /// 主进程注册
  R2rBridgeMain.init(cw, sw);

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
