/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
module.exports.use = app => {
    app.controller("requrieCtrl", ["$scope", "$uibModalInstance", "$modelService", ($scope, $uibModalInstance, $modelService) => {
        let list = $modelService.getModelList();
        // TODO
        $scope.filePath = "F:\\webStorm project\\TRU_appCenter\\选型.xlsx";
        $scope.modelType = {
            selected: list[0],
            options: list
        };

        $scope.openFile = () => {
            Utilities.reader.openFileDialog({
                callback: {
                    name: "model_openFile",
                    execute: path => {
                        $scope.filePath = path;
                        $scope.$apply();
                    }
                },
                arg: {
                    filters: [
                        {name: 'Execl 2007', extensions: ['xlsx']}
                    ]
                }
            });
        };

        $scope.ok = () => {
            $uibModalInstance.close({
                path: $scope.filePath,
                model: $scope.modelType.selected
            });
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
};