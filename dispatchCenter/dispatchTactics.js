/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const path = require("path");
const [lib, ChildExec, creater] = [require(path.join(__dirname, "..", "lib")), require('child_process'), require(path.join(__dirname, "appCreater"))];

let app, dialog, BrowserWindow;

module.exports.initDispatchTactics = electron => {
    app = electron.app;
    dialog = electron.dialog;
    BrowserWindow = electron.BrowserWindow;
    cache = new Map();
    return Promise.resolve(true);
};

module.exports.showWindow = param => {
    let window = lib.windowHelper.getWindow(param);
    if (window) {
        window.show();
        return Promise.resolve(true);
    }
    return Promise.reject(new Error("No such this window or window is not created!"));
};

module.exports.closeWindow = () => {
    try {
        BrowserWindow.getFocusedWindow().hide();
        return Promise.resolve({name: "closeWindow", value: true});
    } catch (err) {
        return Promise.resolve({name: "closeWindow", value: err});
    }
};

module.exports.saveWebPage = dataPath => {
    let {data,ov,uiCtrl,out} = dataPath;
    creater.savePage(data,ov,uiCtrl,out);
    return Promise.resolve({name : "saveWebPage", value : true});
};

module.exports.miniWindow = () => {
    try {
        BrowserWindow.getFocusedWindow().minimize();
        return Promise.resolve({name: "miniWindow", value: true});
    } catch (err) {
        return Promise.resolve({name: "miniWindow", value: err});
    }
};

module.exports.openMsgWindow = param => {
    let {url,title} = param;
    if (!url)
        return Promise.reject(new Error("No such this msg information"));
    lib.windowHelper.createMsgNoticeWindow({url, title});
    return Promise.resolve(true);
};

module.exports.openFrameWindow = param => {
    let {url,title} = param;
    if (!url)
        return Promise.reject(new Error("No such this msg information"));
    lib.windowHelper.createContextFrameWindow({url, title});
    return Promise.resolve(true);
};

module.exports.openMainWindow = param => {
    let {url,title} = param;
    if (!url)
        return Promise.reject(new Error("No such this msg information"));
    lib.windowHelper.createMainFrameWindow({url, title});
    return Promise.resolve(true);
};

module.exports.openFileDialog = param => {
    let {filters} = param;
    try {
        let filePath = dialog.showOpenDialog({
            properties: ['openFile'],
            filters
        });
        return Promise.resolve({name: "openFileDialog", value: filePath[0]});
    } catch (err) {
        return Promise.reject({name: "openFileDialog", value: err});
    }

};

module.exports.openBAT = path => new Promise((resolve, reject) => {
    ChildExec.exec(path, (err, stdout, stderr) => {
        if (err) reject(err);
        if (stderr) reject(stderr.toString("utf8"));
        resolve(stdout.toString("utf8"));
    });
});