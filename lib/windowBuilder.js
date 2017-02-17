/**
 * Created by afterloe on 8/2/2016.
 */
const [path, Electron] = [require("path"), require("electron")];

const {BrowserWindow, nativeImage} = Electron;
const config = require(path.join(__dirname, "..", "configuration"));

let msgNoticeWindow, contextFrameWindow, mainFrameWindow, screenWidth, screenHeight, windowIcon;

module.exports.setScreen = electronScreen => {
    let {width,height} = electronScreen.getPrimaryDisplay().workAreaSize;
    screenWidth = width;
    screenHeight = height;
};
module.exports.setWindowIcon = _path =>  _path ? windowIcon = _path : windowIcon = path.join(__dirname, "..", "public", config.icon);

function createMsgNoticeWindow(_param) {
    if (msgNoticeWindow) {
        msgNoticeWindow.loadURL(_param.url);
        msgNoticeWindow.setTitle(_param.title);
        if (!msgNoticeWindow.isVisible()) msgNoticeWindow.show();
        else msgNoticeWindow.focus();
    } else {
        let [msgConfig,frameWindow] = [config.frame];
        if (!msgConfig || !msgConfig.msgNoticeWindow) throw new Error("read config failed!");
        msgConfig = msgConfig.msgNoticeWindow;
        if (undefined === msgConfig.width || "auto" === msgConfig.width) msgConfig.width = Math.ceil(screenWidth * 0.15) > 300 ? Math.ceil(screenWidth * 0.15) : 300;
        if (undefined === msgConfig.height || "auto" === msgConfig.height) msgConfig.height = Math.ceil(screenHeight * 0.20) > 200 ? Math.ceil(screenHeight * 0.20) : 200;
        if (undefined === msgConfig.x || "auto" === msgConfig.x) msgConfig.x = Math.ceil(screenWidth - msgConfig.width);
        if (undefined === msgConfig.y || "auto" === msgConfig.y) msgConfig.y = Math.ceil(screenHeight - msgConfig.height);
        msgConfig.icon = windowIcon;
        msgConfig.title = `${msgConfig.title} ${_param.title}`;
        frameWindow = new BrowserWindow(msgConfig);
        if (msgConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
            msgNoticeWindow = null;
        });
        msgNoticeWindow = frameWindow;
    }

    return msgNoticeWindow;
};

function createContextFrameWindow(_param) {
    if (contextFrameWindow) {
        contextFrameWindow.loadURL(_param.url);
        contextFrameWindow.setTitle(_param.title);
        if (!contextFrameWindow.isVisible()) contextFrameWindow.show();
        else contextFrameWindow.focus();
    } else {
        let [ctxConfig,frameWindow] = [config.frame];
        if (!ctxConfig || !ctxConfig.contextFrameWindow) throw new Error("read config failed!");
        ctxConfig = ctxConfig.contextFrameWindow;
        if (undefined === ctxConfig.width || "auto" === ctxConfig.width) ctxConfig.width = Math.ceil(screenWidth * 0.70) > 1280 ? Math.ceil(screenWidth * 0.70) : 1280;
        if (undefined === ctxConfig.height || "auto" === ctxConfig.height) ctxConfig.height = Math.ceil(screenHeight * 0.85) > 760 ? Math.ceil(screenHeight * 0.85) : 760;
        ctxConfig.icon = windowIcon;
        ctxConfig.title = `${ctxConfig.title} ${_param.title}`;
        frameWindow = new BrowserWindow(ctxConfig);
        if (ctxConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
            contextFrameWindow = null;
        });
        contextFrameWindow = frameWindow;
    }

    return contextFrameWindow;
};

function createMainFrameWindow(_param) {
    if (mainFrameWindow) {
        mainFrameWindow.loadURL(_param.url);
        mainFrameWindow.setTitle(_param.title);
        if (!mainFrameWindow.isVisible()) mainFrameWindow.show();
        else mainFrameWindow.focus();
    } else {
        let [mainConfig,frameWindow] = [config.frame];
        if (!mainConfig || !mainConfig.mainFrameWindow) throw new Error("read config failed!");
        mainConfig = mainConfig.mainFrameWindow;
        if (undefined === mainConfig.width || "auto" === mainConfig.width) mainConfig.width = Math.ceil(screenWidth * 0.20) > 390 ? Math.ceil(screenWidth * 0.20) : 390;
        if (undefined === mainConfig.height || "auto" === mainConfig.height) mainConfig.height = Math.ceil(screenHeight * 0.55) > 600 ? Math.ceil(screenHeight * 0.55) : 600;
        if (undefined === mainConfig.x || "auto" === mainConfig.x) mainConfig.x = Math.ceil(screenWidth - mainConfig.width);
        if (undefined === mainConfig.y || "auto" === mainConfig.y) mainConfig.y = Math.ceil(screenHeight - mainConfig.height);
        mainConfig.icon = nativeImage.createFromPath(`${__dirname}/../sources/${mainConfig.icon}`);
        mainConfig.icon = windowIcon;
        frameWindow = new BrowserWindow(mainConfig);
        if (mainConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
            mainFrameWindow = null;
        });
        mainFrameWindow = frameWindow;
    }

    return mainFrameWindow;
};

module.exports.createMainFrameWindow = createMainFrameWindow;
module.exports.createMsgNoticeWindow = createMsgNoticeWindow;
module.exports.createContextFrameWindow = createContextFrameWindow;

function getMainFrameWindow(windowName) {
    return "mainFrameWindow" === windowName ? mainFrameWindow : null;
};

function getCtxFrameWindow(windowName) {
    return "contextFrameWindow" === windowName ? contextFrameWindow : getMainFrameWindow(windowName);
};

function getMsgNoticeWindow(windowName) {
    return "msgNoticeWindow" === windowName ? msgNoticeWindow : getCtxFrameWindow(windowName);
};

module.exports.getWindow = windowName => {
    let {name} = param; //  msgNoticeWindow, contextFrameWindow, mainFrameWindow
    return getMsgNoticeWindow(name);
};
