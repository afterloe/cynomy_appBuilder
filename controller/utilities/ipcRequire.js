/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const ipc = require('electron').ipcRenderer;
const COMMAND = "system";

let callbackMap = new Map();

ipc.on("executeInfo", (event, param) => {
    if (param.length > 0) {
        param = param[0];
        let arr = callbackMap.get(param.name);
        if (arr) arr.map(fn => fn.execute.call(null, param.value));
        callbackMap.delete(param.name);
    }
});

function saveWebPage(data,ov,uiCtrl,out) {
    ipc.send(COMMAND, {
        tacticBlock: "saveWebPage",
        _param : {
            data,ov,uiCtrl,out
        }
    });
};

function closeWindow() {
    ipc.send(COMMAND, {
        tacticBlock: "closeWindow"
    });
}

function miniWindow() {
    ipc.send(COMMAND, {
        tacticBlock: "miniWindow"
    });
}

function push(obj) {
    this.push(obj);
}

function openFileDialog(param) { // model_openFile
    let {arg,callback} = param;
    let _arr = callbackMap.get("openFileDialog");
    if (!_arr) _arr = new Array();
    push.call(_arr,callback);
    callbackMap.set("openFileDialog", _arr);
    ipc.send(COMMAND, {
        tacticBlock: "openFileDialog",
        _param: arg
    });
}

module.exports = {closeWindow, miniWindow, openFileDialog, saveWebPage};