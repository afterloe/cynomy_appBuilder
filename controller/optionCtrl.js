/**
 * Created by afterloe on 2016/8/5.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
function optionNameHandler(optionName) {
    let index = optionName.indexOf("*");
    if (0 !== index) return;
    this.push(optionName.substr(1));
}

module.exports.use = app => {
    app.controller("modelCtrl", ["$scope", "$rootScope", "$dataService", ($scope, $rootScope, $dataService) => {
        $rootScope.$on("showPartOptions", (event, part) => {
            if (part) {
                let os = new Array();
                $scope.part = part.type;
                $dataService.selectOptions(part.type).map(optionKey => {
                    optionNameHandler.call(os, optionKey);
                });
                $scope.options = os;
            } else
                $scope.options = null;
        });
    }]);
};