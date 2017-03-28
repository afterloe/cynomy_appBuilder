/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
let ctrlList = [
    {
        icon: "glyphicon glyphicon-list-alt",
        key: "Table-UICtrl",
        name: "Data Table"
    }, {
        icon: "glyphicon glyphicon-check",
        key: "Radio-Button-UICtrl-horizontal",
        name: "Radio Button"
    }, {
        icon: "glyphicon glyphicon-list",
        key: "DropList-UICtrl",
        name: "DropList"
    }, {
        icon: "glyphicon glyphicon-indent-left",
        key: "Tree-UICtrl",
        name: "Tree"
    }, {
        icon: "glyphicon glyphicon-italic",
        key: "Text-Field-UICtrl",
        name: "Text Field"
    }, {
        icon: "glyphicon glyphicon-ok",
        key: "CheckBox-UICtrl-horizontal",
        name: "CheckBox"
    }, {
        icon: "glyphicon glyphicon-tag",
        key: "Label-UICtrl",
        name: "Label"
    }, {
        icon: "glyphicon glyphicon-sound-stereo",
        key: "Button-UICtrl",
        name: "Button"
    }, {
        icon: "glyphicon glyphicon-superscript",
        key: "Button-TextArea",
        name: "TextArea"
    }, {
        icon: "glyphicon glyphicon-console",
        key: "Button-TextField",
        name: "TextField"
    }];

let buttonList = [
    {
        isClick: true,
        icon: "glyphicon-edit",
        value: "设计",
        key: "design"
    }, {
        isClick: false,
        icon: "glyphicon-leaf",
        value: "浏览界面",
        key: "view"
    }, {
        isClick: false,
        icon: "glyphicon-floppy-disk",
        value: "保存",
        key: "save"
    }, {
        isClick: false,
        icon: "glyphicon-warning-sign",
        value: "取消编辑",
        key: "cancel"
    }
];

function getAttributeValueList(ctrl) {
    let arr = new Array();
    if (ctrl instanceof Object) {
        let keys = Object.keys(ctrl);
        keys.map(key => arr.push({key, value: ctrl[key]}));
    }
    return arr;
};

module.exports = function () {
    return {
        getCtrlList: () => ctrlList,
        getAttributesList: () => [],
        getAttributeValueList,
        getIndexButtonList: () => buttonList
    };
};
