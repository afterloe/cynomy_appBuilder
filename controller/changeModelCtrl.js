/**
 * Created by afterloe on 2017/3/27.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
module.exports.use = app => {
    app.controller("changeModelCtrl", ["$scope", "$uibModalInstance", "$modelService", ($scope, $uibModalInstance,$modelService) => {
        let list = $modelService.getModelList();
        $scope.modelType = {
            selected: list[0],
            options: list
        };

        $scope.ok = () => {
            $uibModalInstance.close($scope.modelType.selected);
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
};
