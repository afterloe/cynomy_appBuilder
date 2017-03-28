/**
 * Created by afterloe on 2017/3/27.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
module.exports.use = app => {
    app.controller("requrieCtrl", ["$scope", "$uibModalInstance", "$modelService", ($scope, $uibModalInstance, $modelService) => {
        let list = $modelService.getModelList();
        $scope.filePath = "F:\\webStorm project\\TRU_appCenter\\选型.xlsx";
        $scope.type = "xlsx";
        $scope.modelType = {
            selected: list[0],
            options: list
        };

        $scope.type = type => {
          $scope.type = type;
        }

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
          const type = $scope.type;
          if ("xlsx" === type) {
            $uibModalInstance.close({
                type: $scope.type,
                path: $scope.filePath,
                model: $scope.modelType.selected
            });
          } else if ("cloud" === type) {
            $uibModalInstance.close({
                type: $scope.type,
                path: $scope.cloudPath,
                model: $scope.modelType.selected
            });
          }
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
};
