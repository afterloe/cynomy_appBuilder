/**
 * Created by afterloe on 8/6/2016.
 */
module.exports.use = app => {
    app.controller("funCtrl", ["$scope", "$functionService", ($scope, $functionService) => {
        $scope.functions = $functionService.getFunctionList();
    }]);
};