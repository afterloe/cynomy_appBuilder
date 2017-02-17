/**
 * Created by afterloe on 2016/8/10.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const path = require("path");
const fs = require("fs"), templates = require(path.join(__dirname, "../", "templates"));

module.exports.savePage = (data, ov, uiCtrl, out) => {
    uiCtrl = fs.readFileSync(uiCtrl);
    data = fs.readFileSync(data);
    ov = fs.readFileSync(ov);
    let model = templates.getTemplate("editContext");

    let app = `
<!DOCTYPE html>
<html lang="en" ng-app="mainApp">
<head>
    <meta charset="utf-8"/>
    <title>App creater</title>
</head>
<body>
<div class="container" ng-controller="mainCtrl">
    ${model}

    <div class="navbar-fixed-bottom" style="padding: 10px;">
     <input type="button" class="button btn-primary pull-right" value="输出" ng-click="outPutResult()"/>
    </div>
</div>

<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">
<script src="http://apps.bdimg.com/libs/angular.js/1.4.6/angular.min.js"></script>
<script type="text/javascript">
    let uiCtrl = ${uiCtrl};
    let DATA = ${data};
    let MODEL = DATA.name;
    DATA = DATA.data;
    let OPTIONVALUE = ${ov};
    OPTIONVALUE = OPTIONVALUE.data;
</script>
<script type="text/javascript">

function queryData(_type, key, rang) {
    let result = new Array();
    DATA.map(data => {
        let [model,type] = ["机型", "产品类型"];
        if (MODEL !== data[model] || data[type] !== _type) return;
        rang.map(value => {
            if (data[key] == value) result.push(data);
        });
    });
    return result;
}

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

function findByCondition(_type, optionSet) {
    let [model,type] = ["机型", "产品类型"], result = new Array();
    DATA.map(data => {
        let [model,type] = ["机型", "产品类型"];
        if (MODEL !== data[model] && data[type] !== _type) return;
        optionSet.map(os => {
            let key = os.key;
            if (data[key] == os.value) result.push(data);
        });
    });
    return result;
};

function queryInfluences(subTab) {
    let {label,value} = subTab;
    let result = new Array();
    OPTIONVALUE.map(ov => {
        if (ov["main"] == label && ov["attribute-main"] && value[ov["attribute-main"]] && value[ov["attribute-main"]] == ov["value"])
            result.push({
                subscriber: ov["subscriber"],
                datas: queryData(ov["subscriber"], ov["attribute-sub"], ov["rang"])
            });
    });
    return result;
}

    angular.module('mainApp', []).controller("mainCtrl",["$scope", ($scope) => {
        $scope.enableExecuteExamination = true;
        $scope.ctrlList = uiCtrl.data;

        $scope.outPutResult = () => {
            let result,show = new Array();
            uiCtrl.data.map(ctrl => {
               if (ctrl.type == "Tree-UICtrl")
                      result = ctrl.tabList;
            });
            result.map(tab => {
                    show.push({
                        name : tab.label,
                        value : JSON.stringify(tab.value)
                    });
            });
            alert(JSON.stringify(show));
        };
        $scope.executeExamination = subTab => {
            let result = findDataTable.call(subTab);
            if (-1 === result.dataTableIndex) return;
            let datas = findByCondition(subTab.label, result.optionSet);
            subTab["subCtrlList"][result.dataTableIndex].datas = datas;
        };

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
                let influencesTables = queryInfluences(subTab);
                updateTree.call($scope.ctrlList, influencesTables);
            }
        };
    }]);
</script>
</body>
</html>
`;

    fs.writeFile(out, app);
};