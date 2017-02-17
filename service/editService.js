/**
 * Created by afterloe on 8/6/2016.
 */
let editList = new Array(), treeSubEditList;

function buildButton(ctrlKey, ctrl) {
    if ("Button-UICtrl" === ctrlKey) {
        return ctrl;
    }
    return null;
};

function buildTable(ctrlKey, ctrl) {
    if ("Table-UICtrl" === ctrlKey) {
        ctrl.labels = ["请拖入选项-属性1", "请拖入选项-属性2"];
        ctrl.datas = [["请拖入选项", "请拖入选项"], ["请拖入选项", "请拖入选项"]];
        return ctrl;
    }
    return buildButton(ctrlKey, ctrl);
};

function buildLabel(ctrlKey, ctrl) {
    if ("Label-UICtrl" === ctrlKey) {
        return ctrl;
    }
    return buildTable(ctrlKey, ctrl);
};

function buildTree(ctrlKey, ctrl) {
    if ("Tree-UICtrl" === ctrlKey) {
        ctrl.tabList = [{
            id: 0,
            label: "请拖入选项 或 其他控件",
            level: 0
        }, {
            id: 1,
            label: "请拖入选项 或 其他控件",
            level: 1
        }, {
            id: 2,
            label: "请拖入选项 或 其他控件",
            level: 1
        }];
        return ctrl;
    }
    return buildLabel(ctrlKey, ctrl);
};

function buildRadioButton(ctrlKey, ctrl) {
    if ("Radio-Button-UICtrl-horizontal" === ctrlKey || "Radio-Button-UICtrl-vertical" === ctrlKey) {
        ctrl.data = [{
            name: "请拖入选项",
            value: "请拖入选项"
        }];
        return ctrl;
    }
    return buildTree(ctrlKey, ctrl);
};

function buildCheckBox(ctrlKey, ctrl) {
    if ("CheckBox-UICtrl-horizontal" === ctrlKey || "CheckBox-UICtrl-vertical" === ctrlKey) {
        ctrl.data = [{
            name: "请拖入选项",
            value: "请拖入选项"
        }];
        return ctrl;
    }
    return buildRadioButton(ctrlKey, ctrl);
};

function buildDropList(ctrlKey, ctrl) {
    ctrl.value = "请拖入选项";
    if ("DropList-UICtrl" === ctrlKey) {
        ctrl.data = ["请拖入选项"];
        return ctrl;
    }
    return buildCheckBox(ctrlKey, ctrl);
};

function buildCtrl(ctrlKey, ctrl) {
    ctrl.label = "请拖入选项";
    ctrl.synopsis = "请拖入选项";
    if ("Text-Field-UICtrl" === ctrlKey) {
        ctrl.value = "";
        return ctrl;
    }
    return buildDropList(ctrlKey, ctrl);
};

function pushItem(ctrlKey) {
    let ctrl = new Object();
    ctrl.id = editList.length;
    ctrl.type = ctrlKey;
    ctrl.parent = "root";
    let editCtrl = buildCtrl(ctrlKey, ctrl);
    if (null !== editCtrl)
        editList.push(editCtrl);
    return editList;
};

// TODO
function reBuildButton(ctrl, object) {
    if ("Button-UICtrl" === ctrl.type) {
        return ctrl;
    }
    return null;
};

function reBuildTable(ctrl, object) {
    if ("Table-UICtrl" === ctrl.type) {
        ctrl.value = "";
        ctrl.labels = ["拖入方法绑定表头"];
        ctrl.datas = [["拖入方法绑定内容"]];
        return ctrl;
    }
    return reBuildButton(ctrl, object);
};

function reBuildLabel(ctrl, object) {
    if ("Label-UICtrl" === ctrl.type) {
        return ctrl;
    }
    return reBuildTable(ctrl, object);
};

function reBuildRadioButton(ctrl, object) {
    if ("Radio-Button-UICtrl-horizontal" === ctrl.type || "Radio-Button-UICtrl-vertical" === ctrl.type) {
        let data = new Array();
        object.values.map(obj => data.push({name: obj, value: false}));
        ctrl.data = data;
        return ctrl;
    }
    return reBuildLabel(ctrl, object);
};

function reBuildCheckBox(ctrl, object) {
    if ("CheckBox-UICtrl-horizontal" === ctrl.type || "CheckBox-UICtrl-vertical" === ctrl.type) {
        let data = new Array();
        object.values.map(obj => data.push({name: obj, value: false}));
        ctrl.data = data;
        return ctrl;
    }
    return reBuildRadioButton(ctrl, object);
};

function reBuildDropList(ctrl, object) {
    ctrl.value = object.values[0];
    if ("DropList-UICtrl" === ctrl.type) {
        ctrl.data = object.values;
        return ctrl;
    }
    return reBuildCheckBox(ctrl, object);
};

function reBuildCtrl(ctrl, object) {
    ctrl.label = object.labelName;
    ctrl.synopsis = null;
    if ("Text-Field-UICtrl" === ctrl.type) {
        ctrl.value = object.values[0];
        return ctrl;
    }
    return reBuildDropList(ctrl, object);
};

//  替换ctrl中的数据
function updateCtrl(ctrl, ...args) {
    let [values, labelName, synopsis, labels, datas] = args;
    if (!values || !values instanceof Array) values = new Array();
    return reBuildCtrl(ctrl, {values, labelName, synopsis, labels, datas});
};

// Tree 添加子控件列表
function appendCtrlForTab(ctrlKey, ctrlId, partType) {
    let tab = this[ctrlId];
    if (!tab.subCtrlList) tab.subCtrlList = new Array();
    let ctrl = new Object();
    ctrl.id = tab.subCtrlList.length;
    ctrl.type = ctrlKey;
    ctrl.tabId = ctrlId;
    ctrl.parent = "Tree-UICtrl";
    ctrl.partType = partType;
    let editCtrl = buildCtrl(ctrlKey, ctrl);
    tab.subCtrlList.push(editCtrl);
    this[ctrlId] = tab;
};

// 给Tree组件 指定的Tab 添加控件
function pushCtrlInTree(ctrlCfg) {
    let {objectValue,ctrlId,partType} = ctrlCfg;
    if ("string" === typeof ctrlId) ctrlId = Number.parseInt(ctrlId);
    editList.forEach(ctrl => {
        if ("Tree-UICtrl" !== ctrl.type) return;
        appendCtrlForTab.call(ctrl.tabList, objectValue, ctrlId, partType);
    });
    return editList
};

// 给Tree组件 添加bom结构
function bindBOMInTreeCtrl(bom) {
    if (bom && bom.data instanceof Array)
        editList.forEach(ctrl => {
            if ("Tree-UICtrl" !== ctrl.type) return;
            treeSubEditList = new Array();
            bom.data.map((part, id) => {
                treeSubEditList.push({id: id, label: part.type, level: part.level});
            });
            ctrl.tabList = treeSubEditList;
        });
    return editList;
};

function getEditList() {
    return {data: editList, name: "ctrlList"};
};

function updateTree(parent, subCtrl) {
    if ("Tree-UICtrl" === parent) {
        editList.map(ctrl => {
            if ("Tree-UICtrl" !== ctrl.type) return;
            try {
                ctrl.tabList[subCtrl.tabId]["subCtrlList"][subCtrl.id] = subCtrl;
            } catch (err) {
                console.log(err);
            }
        });
        return;
    }
    return null;
};

function updateRoot(parent, ctrl) {
    if ("root" === parent) {
        try {
            editList[ctrl.id] = ctrl
        } catch (err) {
            console.log(err);
        }
        return;
    }
    return updateTree(parent, ctrl)
};

function updateByUser(ctrl) {
    let {parent} = ctrl;
    return updateRoot(parent, ctrl);
};

module.exports = function () {
    return {
        push: pushItem,
        update: updateCtrl,
        bindBOMInTreeCtrl,
        updateByUser,
        pushCtrlInTree,
        getEditList
    }
};