/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [path, EventEmitter] = [require("path"), require('events')];
const controllerPath = path.join(__dirname, "..", "controller");
// 导入 工具包，服务包，控制包
const [Temp, Utilities, Service, SourceCtrl, ServiceCtrl, ChangeModelCtrl, OptionCtrl, UICtrl, FunCtrl, EditCtxCtrl, ShowResultCtrl] = [
    require(path.join(__dirname, "..", "templates")), require(path.join(controllerPath, "utilities")), require(path.join(__dirname, "..", "service")),
    require(path.join(controllerPath, "sourceCtrl")), require(path.join(controllerPath, "serverCtrl")), require(path.join(controllerPath, "changeModelCtrl")),
    require(path.join(controllerPath, "optionCtrl")), require(path.join(controllerPath, "UICtrl")), require(path.join(controllerPath, "funCtrl")),
    require(path.join(controllerPath, "editCtxCtrl")), require(path.join(controllerPath, "showResultCtrl"))];

// 继承事件对象，拓展自定义事件
class DropEvent extends EventEmitter {
}

const dropEmitter = new DropEvent();

// 拓展监听对象 监听不同的事件名来触发不同的事件
Object.prototype.observe = (eventName, callback) => {
    dropEmitter.on(eventName, object => {
        callback.call(this, object);
    });
};

/**
 * 拖动UI控件时触发的事件
 *
 * @param ev
 * @param ctrl
 */
function dragUICtrl(ev, ctrl) {
    let ctrlName = ctrl.getAttribute("data-ctrlType");
    ev.dataTransfer.setData("dropObject", JSON.stringify({
        objectType: "ctrl",
        objectValue: ctrlName
    }));
};

/**
 * 拖动BOM结构到Tree开始
 *
 * @param ev
 * @param bom
 */
function dragBOMTree(ev, bom) {
    ev.dataTransfer.setData("dropObject", JSON.stringify({
        objectType: "bom"
    }));
}

/**
 * 拖动选项控件时触发的事件
 *
 * @param ev
 * @param option
 */
function dragOption(ev, option) {
    let optionName = option.getAttribute("data-optionType"),
        partType = option.getAttribute("data-modelType");
    ev.dataTransfer.setData("dropObject", JSON.stringify({
        objectType: "option",
        objectValue: optionName,
        partType
    }));
};

/**
 * 方法拖动
 *
 * @param ev
 * @param fun
 */
function dragFunction(ev, fun) {
    let functionName = fun.getAttribute("data-function-name");
    ev.dataTransfer.setData("dropObject", JSON.stringify({
        objectType: "function",
        objectValue: functionName
    }));
};

/**
 * 拖动经过编辑区的事情
 *
 * @param ev
 * @param bom
 */
function allowDrop(ev, bom) {
    ev.preventDefault();
    bom.style["border-color"] = "rgba(32, 31, 61, 1.0)";
};

/**
 * 拖离编辑区的事件
 *
 * @param ev
 * @param bom
 */
function allowLeave(ev, bom) {
    ev.preventDefault();
    bom.style["border-color"] = "#BEC0C2";
}

/**
 * 当拖拽对象放置到编辑区触发的事件
 *
 * @param ev
 */
let drop = (ev, bom) => {
    let dropObject = ev.dataTransfer.getData("dropObject");
    bom.style["border-color"] = "#BEC0C2";
    try {
        dropObject = JSON.parse(dropObject);
        if ("ctrl" === dropObject.objectType)
            dropEmitter.emit("dropCtrlInEditView", dropObject);
        else
            throw new Error("no such this map");
    } catch (e) {
        console.log(e);
        return;
    }
};

/**
 * Tree 对象放置
 *
 * @param ev
 */
function dropTree(ev, tree) {
    try {
        let dropObject = ev.dataTransfer.getData("dropObject"), id = tree.getAttribute("data-tab-id")
            , partType = tree.getAttribute("data-tab-partType");
        dropObject = JSON.parse(dropObject);
        dropObject.ctrlId = id;
        dropObject.partType = partType;
        if ("bom" === dropObject.objectType)
            dropEmitter.emit("dropBomInTreeCtrl");
        else if ("ctrl" === dropObject.objectType)
            dropEmitter.emit("dropSubCtrlInTreeCtrl", dropObject);
        else
            throw new Error("no such this map");
    } catch (e) {
        console.log(e);
        return;
    }
    ev.stopPropagation(); //    阻止事件冒泡到上层
};

/**
 * 给控件绑定服务数据
 *
 * @param ev
 * @param ctrl
 */
function bindServer(ev, ctrl) {
    try {
        let dropObject = ev.dataTransfer.getData("dropObject"), id = ctrl.getAttribute("data-ctrl-id");
        dropObject = JSON.parse(dropObject);
        dropObject.ctrlId = id;
        if ("option" === dropObject.objectType)
            dropEmitter.emit("dropServerInCtrl", dropObject);
        else if ("function" === dropObject.objectType)
            dropEmitter.emit("executeFunctionByCtrl", dropObject);
        else
            throw new Error("no such this map");
    } catch (err) {
        console.log(err);
    }
    ev.stopPropagation(); //    阻止事件冒泡到上层
}

/**
 * 给Tree 绑定服务数据
 *
 * @param ev
 * @param ctrl
 */
function bindTreeSubTabServer(ev, ctrl) {
    try {
        let dropObject = ev.dataTransfer.getData("dropObject"), id = ctrl.getAttribute("data-ctrl-id")
            , tabId = ctrl.getAttribute("data-tab-id");
        dropObject = JSON.parse(dropObject);
        dropObject.ctrlId = id;
        dropObject.tabId = tabId;
        if ("option" === dropObject.objectType)
            dropEmitter.emit("bindTreeSubTabServer", dropObject);
        else if ("function" === dropObject.objectType)
            dropEmitter.emit("executeFunctionByTreeSubCtrl", dropObject);
        else
            throw new Error("no such this map");
        ev.stopPropagation(); // 阻止事件冒泡
    } catch (err) {
        console.log(err);
    }
}

let CreatorApp = angular.module('creatorApp', ['ngAnimate', 'ui.bootstrap']);

/**
 * 给app注册服务
 */
Service.use(CreatorApp);

/**
 * 主控制器
 */
CreatorApp.controller("creatorAppCtrl", ['$scope', '$uibModal', "$dataService", "$rootScope", "$ctrlService", "$editService", ($scope, $uibModal, $dataService, $rootScope, $ctrlService, $editService) => {
    $scope.head_html = "file://" + path.join(__dirname, "..", "views", "head.html"); // 绑定头部html
    $scope.closeWindow = Utilities.reader.closeWindow; // 绑定关闭窗口事件
    $scope.minWindow = Utilities.reader.miniWindow; // 绑定最小化窗口事件
    $scope.buttonList = $ctrlService.getIndexButtonList(); // 获取首页button列表
    $scope.status = "design";
    let ableHeight = window.document.body.scrollHeight - 130; // 计算窗口可用高度

    // 执行按钮方法
    function execute(functionKey) {
        if ("view" === functionKey) {
            $scope.status = "view";
            $rootScope.$broadcast("enableExecuteExamination");
        } else if ("design" === functionKey) {
            $scope.status = "design";
            $rootScope.$broadcast("disableExecuteExamination");
        } else if ("save" === functionKey) {
            $rootScope.$broadcast("saveProgram");
        } else if ("cancel" === functionKey) {

        }
    };

    $scope.executeButton = (key, button) => {
        $scope.buttonList.map(btn => btn.isClick = false);
        button.isClick = true;
        execute(key);
    };

    /**
     *  下面三个方法是 设定指定编辑区域的高度
     */
    $scope.left_edit = {
        height: Math.floor(ableHeight / 2) + 2 + "px"
    };
    $scope.center_edit = {
        height: ableHeight + 9 + "px"
    };
    $scope.right_edit = {
        height: Math.floor(ableHeight / 3) + "px"
    };

    // 组装拖动事件触发机制
    Object.observe("dropCtrlInEditView", ctrl => {
        $rootScope.$broadcast("dropCtrlInEditView", ctrl);
    });
    Object.observe("dropServerInCtrl", server => {
        $rootScope.$broadcast("dropServerInCtrl", server);
    });
    Object.observe("bindTreeSubTabServer", server => {
        $rootScope.$broadcast("bindTreeSubTabServer", server);
    });
    Object.observe("dropSubCtrlInTreeCtrl", subCtrl => {
        $rootScope.$broadcast("dropSubCtrlInTreeCtrl", subCtrl);
    });
    Object.observe("dropBomInTreeCtrl", bom => {
        $rootScope.$broadcast("dropBomInTreeCtrl", bom);
    });
    Object.observe("executeFunctionByCtrl", fun => {
        $rootScope.$broadcast("executeFunctionByCtrl", fun);
    });
    Object.observe("executeFunctionByTreeSubCtrl", fun => {
        $rootScope.$broadcast("executeFunctionByTreeSubCtrl", fun);
    });

    // 显示选配结果
    $scope.outPutResult = () => {
        let {data} = $editService.getEditList(), result;
        if (!data) return;
        data.map(ctrl => {
            if (ctrl.type == "Tree-UICtrl")
                result = ctrl.tabList;
        });

        $uibModal.open({
            animation: true,    // 开启模态框展开动画
            template: Temp.getTemplate("showResult"), // 绑定模态框 HTML
            controller: 'showResultCtrl', // 绑定模态框控制器
            resolve: {
                value: () => ({result, name: "选型结果"})
            }
        }).result.then(() => {

            }, () => {
                console.log(`${new Date} -- close modal's window`); // 否则的打印日志
            });
    };

    // 返回 设计
    $scope.backDesign = () => {
        $scope.status = "design";
        $rootScope.$broadcast("disableExecuteExamination");
        $scope.buttonList.map(btn => btn.key === "design" ? btn.isClick = true : btn.isClick = false);
    };

    // 绑定导入数据源 事件
    $scope.importSource = () => {
        let modalInstance = $uibModal.open({
            animation: true,    // 开启模态框展开动画
            template: Temp.getTemplate("requireSource"), // 绑定模态框 HTML
            controller: 'requrieCtrl' // 绑定模态框控制器
        });

        // 当模态框关闭的时候传回选择的内容
        modalInstance.result.then(result => {
            let {path,model} = result;
            $dataService.buildSource(path); // 通知数据服务 从指定的位置刷新数据
            $dataService.selectModel(model); // 存储选择的数据模型
            $rootScope.$broadcast("readyData");
        }, () => {
            console.log(`${new Date} -- close modal's window`); // 否则的打印日志
        });
    };
}]);

// 给传入的APP 注入 控制器
SourceCtrl.use(CreatorApp);
ServiceCtrl.use(CreatorApp);
ChangeModelCtrl.use(CreatorApp);
OptionCtrl.use(CreatorApp);
UICtrl.use(CreatorApp);
FunCtrl.use(CreatorApp);
EditCtxCtrl.use(CreatorApp);
ShowResultCtrl.use(CreatorApp);