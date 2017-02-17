/**
 * Created by afterloe on 8/6/2016.
 */
const path = require("path"), fs = require("fs");

function replaceTypeCtrl(ctrlId, subCtrl, ctrlKey, subId) {
    try {
        if ("string" === typeof subId) subId = Number.parseInt(subId);
        let ctrl = this.find(c => ctrlKey === c.type),
            tab = ctrl.tabList[subId];
        tab.subCtrlList[ctrlId] = subCtrl;
    } catch (err) {
        return null;
    }
};

function replaceCtrl(ctrlId, ctrl, ctrlKey, subId) {
    if ("string" === typeof ctrlId) ctrlId = Number.parseInt(ctrlId);
    return ctrlKey ? replaceTypeCtrl.call(this, ctrlId, ctrl, ctrlKey, subId) : this[ctrlId] = ctrl;
};

function getTypeCtrl(ctrlKey, ctrlId, subId) {
    try {
        if ("string" === typeof subId) subId = Number.parseInt(subId);
        let ctrl = this.find(c => ctrlKey === c.type),
            tab = ctrl.tabList[subId];
        return tab.subCtrlList[ctrlId];
    } catch (err) {
        return null;
    }
};

function getCtrl(ctrlId, ctrlKey, subId) {
    if (!ctrlId) return;
    if ("string" === typeof ctrlId) ctrlId = Number.parseInt(ctrlId);
    return ctrlKey ? getTypeCtrl.call(this, ctrlKey, ctrlId, subId) : this[ctrlId];
};

// 从subTab 中查询dataTable 组件，如果存在返回 dataTable的下标，否则返回 -1
function findDataTable() {
    try {
        let result = new Object();
        result.optionSet = new Array();

        this.subCtrlList.map((subCtrl, index) => {
            if ("Table-UICtrl" === subCtrl.type) {
                result.dataTableIndex = index;
            } else {
                result.optionSet.push({
                    key: "*" + subCtrl.label,
                    value: subCtrl.value
                });
            }
        });
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}

function updateTree(influencesTables) {
    this.map(ctrl => {
        if ("Tree-UICtrl" === ctrl.type) {
            influencesTables.map(it => {
                ctrl.tabList.map(tab => {
                    if (it["subscriber"] === tab.label) {
                        try {
                            tab.subCtrlList.map(subCtrl => {
                                if ("Table-UICtrl" === subCtrl.type) subCtrl.datas = it["datas"];
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
            });
        }
    });
};

module.exports.use = app => {
    app.controller("editCtxCtrl", ["$scope", "$rootScope", "$dataService", "$editService", "$functionService", ($scope, $rootScope, $dataService, $editService, $functionService) => {
        // 设置Context编辑区HTML
        $scope.editCtx = `file://` + path.join(__dirname, "..", "templates", "editContext");

        // 执行 option筛选 dataTable 事件
        $scope.executeExamination = subTab => {
            // 如果开启了异常检查执行器, 影响 tables的值
            if (!$scope.enableExecuteExamination) return;
            // 查询该SubTab下是否包含DataTable， 如果不包含DataTable 则直接return;
            let result = findDataTable.call(subTab);
            if (-1 === result.dataTableIndex) return;
            // 通过server 获取 DataTable中enable 的 data
            let datas = $dataService.findByCondition(subTab.label, result.optionSet);
            subTab["subCtrlList"][result.dataTableIndex].datas = datas;
        };

        // CheckBox 专用, 聚合选择信息
        $scope.selectValue = ctrl => {
            let value = new Array();
            ctrl.data.map(item => true === item.value ? value.push(item.name) : null);
            ctrl.value = value;
        };

        $scope.selectValue = (subCtrl, item, subTab) => {
            subCtrl.datas.map(a => a.isSelect = false);
            subCtrl.value = item;
            item.isSelect = true;
            if ($scope.enableExecuteExamination) {
                if (item instanceof Array) {
                    let value = new Object();
                    subCtrl.labels.map((label, index) => {
                        value[label] = item[index];
                    });
                    subTab.value = value;
                } else {
                    subTab.value = item;
                }
                let influencesTables = $dataService.queryInfluences(subTab);
                updateTree.call($scope.ctrlList, influencesTables);
            }
        };

        $scope.$on("saveProgram", () => {
            // 1） 保存数据模型
            fs.writeFileSync("C:/Users/Administrator/Desktop/data.tru", JSON.stringify($dataService.getData()));
            fs.writeFileSync("C:/Users/Administrator/Desktop/ov.tru", JSON.stringify($dataService.getOptionValue()));
            // 2） 保存UI控件
            fs.writeFileSync("C:/Users/Administrator/Desktop/uiCtrl.tru", JSON.stringify($editService.getEditList()));
            // 3） 将保存的数据模型和UI控件 生成app
            Utilities.reader.saveWebPage("C:/Users/Administrator/Desktop/data.tru", "C:/Users/Administrator/Desktop/ov.tru", "C:/Users/Administrator/Desktop/uiCtrl.tru", "C:/Users/Administrator/Desktop/app.html");
        });

        // 通知属性框刷新控件属性
        $scope.showAttribute = ctrl => {
            $rootScope.$broadcast("showCtrlAttributesWithValue", ctrl);
        };

        $rootScope.$on("enableExecuteExamination", () => {
            $scope.enableExecuteExamination = true;
        });

        $rootScope.$on("disableExecuteExamination", () => {
            $scope.enableExecuteExamination = false;
        });

        // 拖动子控件到 Tree控件上
        $rootScope.$on("dropSubCtrlInTreeCtrl", (event, subCtrl) => {
            $scope.ctrlList = $editService.pushCtrlInTree(subCtrl);
            $scope.$apply();
        });

        // 刷新编辑区
        $rootScope.$on("refreshEditView", () => {
            $scope.ctrlList = $editService.getEditList().data;
        });

        // 拖动BOM到 Tree控件上
        $rootScope.$on("dropBomInTreeCtrl", () => {
            let bom = $dataService.getModelBOM();
            $scope.ctrlList = $editService.bindBOMInTreeCtrl(bom);
            $scope.$apply();
        });

        // 设置添加控件事件
        $rootScope.$on("dropCtrlInEditView", (event, ctrl) => {
            $scope.ctrlList = $editService.push(ctrl.objectValue);
            $scope.$apply();
        });

        // 拖动服务到 Tree子控件上
        $rootScope.$on("bindTreeSubTabServer", (events, server) => {
            // 从传入的对象中读取 option的名字，归属于哪个part
            let {objectValue, partType, ctrlId, tabId, ctrl, key = "*"} = server;
            ctrl = getCtrl.call($scope.ctrlList, ctrlId, "Tree-UICtrl", tabId);
            key += objectValue;
            let values = $dataService.search(partType, key);
            ctrl = $editService.update(ctrl, values, objectValue);
            replaceCtrl.call($scope.ctrlList, ctrlId, ctrl, "Tree-UICtrl", tabId);
            $scope.$apply();
        });

        // 设置给控件添加服务事件
        $rootScope.$on("dropServerInCtrl", (event, server) => {
            let {objectValue, partType, ctrlId, ctrl, key = "*"} = server;
            ctrl = getCtrl.call($scope.ctrlList, ctrlId);
            key += objectValue;
            let values = $dataService.search(partType, key);
            ctrl.partType = partType;
            ctrl = $editService.update(ctrl, values, objectValue);
            replaceCtrl.call($scope.ctrlList, ctrlId, ctrl);
            $scope.$apply();
        });

        // 拖动方法到控件上执行
        $rootScope.$on("executeFunctionByCtrl", (events, fun) => {
            let {objectValue, ctrlId, ctrl} = fun;
            ctrl = getCtrl.call($scope.ctrlList, ctrlId);
            ctrl = $dataService.execute(objectValue, ctrl);
            replaceCtrl.call($scope.ctrlList, ctrlId, ctrl);
            $scope.$apply();
        });

        // 拖动方法到控件上执行
        $rootScope.$on("executeFunctionByTreeSubCtrl", (events, fun) => {
            // 从传入的对象中读取 option的名字，归属于哪个part
            let {objectValue, ctrlId, tabId, ctrl} = fun;
            console.log(objectValue);
            ctrl = getCtrl.call($scope.ctrlList, ctrlId, "Tree-UICtrl", tabId);
            ctrl = $dataService.execute(objectValue, ctrl);
            replaceCtrl.call($scope.ctrlList, ctrlId, ctrl, "Tree-UICtrl", tabId);
            $scope.$apply();
        });
    }]);
};