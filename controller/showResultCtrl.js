/**
 * Created by afterloe on 2016/8/10.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
module.exports.use = app => {
    app.controller("showResultCtrl", ($scope, $uibModalInstance, value) => {
        $scope.title = value.name ? value.name : "未选择方案";
        let tree = value.result;
        if(!tree || !tree instanceof Array) tree = new Array({name : "错误", value : "未选择方案"});
        let result = new Array();
        tree.map(tab => {
            result.push({
                name : tab.label,
                value : JSON.stringify(tab.value)
            });
        });
        $scope.result = result;
        $scope.ok = () => {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    });
};