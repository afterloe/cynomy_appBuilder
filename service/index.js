/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const path = require("path");

const [modelService, ctrlService, functionService, dataService, editService] = [require(path.join(__dirname, "modelService")), require(path.join(__dirname, "ctrlService")), require(path.join(__dirname, "functionService")), require(path.join(__dirname, "dataService")), require(path.join(__dirname, "editService"))];

// 给传入的APP注入数据服务
function use(app) {
    // 机型，提供机型相关数据的服务
    app.service("$modelService", modelService);
    // 控件，提供控件相关数据的服务
    app.service("$ctrlService", ctrlService);
    // 属性，提供属性相关数据的服务
    app.service("$functionService", functionService);
    // 数据源，提供数据源相关的服务
    app.service("$dataService", dataService);
    // 编辑区，提供数据服务
    app.service("$editService", editService);
}

module.exports = {
    use
};