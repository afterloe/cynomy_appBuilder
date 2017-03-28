/**
 * Created by afterloe on 2017/3/27.
 */
module.exports.use = app => {
    app.controller("funCtrl", ["$scope", "$functionService", ($scope, $functionService) => {
        $scope.functions = $functionService.getFunctionList();
    }]);
};
