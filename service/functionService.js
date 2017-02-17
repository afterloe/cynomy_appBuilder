/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
let attributes = ["getAttributesByOption", "getValuesByOption", "bindEventForOption", "cancelEventForOption"];

function executeGetValuesByOption(functionName, ctrl) {
    if ("getValuesByOption" === functionName) {
        return ctrl;
    }
};

function executeGetAttributesByOption(functionName, ctrl) {
    if ("getAttributesByOption" === functionName) {
        return ctrl;
    }
    return executeGetValuesByOption(functionName, ctrl);
};

function execute(functionName, ctrl) {
    if (!ctrl.partType) {
        ctrl.labels = ["请先绑定Server再执行方法"];
        ctrl.datas = [["请先绑定Server再执行方法"]];
        return ctrl;
    }
    return executeGetAttributesByOption(functionName, ctrl);
};

module.exports = function () {
    return {
        getFunctionList: () => attributes,
        execute
    }
};