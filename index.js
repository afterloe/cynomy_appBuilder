/**
 * create by afterloe om 8-3-2016
 *
 */
const [path, Electron] = [require("path"), require("electron")];

const [lib,IPC] = [require(path.join(__dirname, "lib")), require(path.join(__dirname, "dispatchCenter"))];

// 抓取未处理的异常
process.on('uncaughtException', err => {
    console.log(err);
});
IPC.registerIpc(Electron);

let [app, Tray] = [Electron.app, Electron.Tray];

function readyApp() {
    let {screen : electronScreen} = Electron;

    lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
    lib.windowHelper.setWindowIcon();
    lib.windowHelper.createContextFrameWindow({
        url: `file://${path.join(__dirname, "views", "index.html")}`,
        title: "jwi builder"
    });
    lib.trayHelper.createTray({
        callback: () => {
            lib.windowHelper.getWindow("contextFrameWindow").show();
        }
    });
};

app.on("ready", readyApp);

app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
});

app.on("activate", () => {
    if (null === app) readyApp();
});
