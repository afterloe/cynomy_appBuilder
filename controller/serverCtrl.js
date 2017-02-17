/**
 * Created by afterloe on 2016/8/5.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */

function push(obj, _model) {
    let [type,level,model] = ["产品类型", "BOM", "机型"];
    if (_model !== obj[model]) return;
    if (0 === this.length) Array.prototype.push.call(this, {type: obj[type], level: obj[level]});
    if (!Array.prototype.find.call(this, (o => o["type"] === obj[type] && o["level"] === obj[level]))) {
        Array.prototype.push.call(this, {type: obj[type], level: obj[level]});
    }
};

function buildBomTree(arr, model) {
    let bom = new Array();
    arr.map(part => {
        push.call(bom, part, model);
    });
    this.bom = bom;
};

function Interception(name) {
    if ("string" === typeof name && name.length > 24) {
        this.source = "..." + name.slice(name.length - 18);
    }
};

module.exports.use = app => {
    app.controller("serviceCtrl", ["$scope", "$rootScope", "$uibModal", "$dataService", ($scope, $rootScope, $uibModal, $dataService) => {
        $rootScope.$on("readyData", () => {
            $scope.readyChange = true;
            $scope.model = $dataService.getSelectModel();
            let dataObject = $dataService.getData();
            buildBomTree.call($scope, dataObject.data, $dataService.getSelectModel());
            Interception.call($scope, dataObject.name);
            $dataService.setModelBOM($scope.bom);
            dataObject = null;
        });
        $scope.obtainOptions = part => {
            $scope.bom.map(p => p.isClick = false);
            part.isClick = true;
            $rootScope.$broadcast("showPartOptions", part);
        };

        // 切换机型
        $scope.changeModel = () => {
            let modalInstance = $uibModal.open({
                animation: true,    // 开启模态框展开动画
                template: Temp.getTemplate("changeModel"), // 绑定模态框 HTML
                size: "sm",
                controller: 'changeModelCtrl' // 绑定模态框控制器
            });

            // 当模态框关闭的时候传回选择的内容
            modalInstance.result.then(model => {
                $scope.model = model;
                $dataService.selectModel(model);
                buildBomTree.call($scope, $dataService.getData().data, model);
                $rootScope.$broadcast("showPartOptions");
            }, () => {
                console.log(`${new Date} -- close modal's window`); // 否则的打印日志
            });
        };
    }]);
};