/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [Electron, path] = [require("electron"), require("path")];
const CONFIG = require(path.join(__dirname, "..", "configuration"));

let appTray;

class MenuObject {
    constructor(itemName, itemClick) {
        this.itemName = itemName;
        this.itemClick = itemClick;
    }

    formatOut() {
        let _self = this;
        return {label: _self.itemName, click: _self.itemClick};
    }
}

/**
 *  构建托盘单击菜单
 */
function readyMenu() {
    let menu = new Array();
    menu.push(new MenuObject("显示主页面", (menuItem, browserWindow) => {
        console.log("显示主页面");
    }).formatOut());
    menu.push(new MenuObject("锁定界面", (menuItem, browserWindow) => {
        console.log("锁定界面");
    }).formatOut());
    menu.push(new MenuObject("设置", (menuItem, browserWindow) => {
        console.log("设置");
    }).formatOut());
    menu.push(new MenuObject("退出", (menuItem, browserWindow) => {
        Electron.app.quit();
    }).formatOut());

    return menu;
};

module.exports.createTray = (config) => {
    let {icon, title, callback} = config;
    appTray = icon ? new Electron.Tray(icon) : new Electron.Tray(path.join(__dirname, "..", "public", CONFIG.icon));
    appTray.setToolTip(title ? title : CONFIG.name);
    appTray.setContextMenu(Electron.Menu.buildFromTemplate(readyMenu()));
    if (callback && callback.call)
        appTray.on("click", callback);
};