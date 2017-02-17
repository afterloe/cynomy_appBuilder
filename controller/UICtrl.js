/**
 * Created by afterloe on 8/6/2016.
 */
module.exports.use = app => {
    app.controller("UICtrl", ["$scope", "$rootScope", "$ctrlService", "$editService", ($scope, $rootScope, $ctrlService, $editService) => {
        // 获取UI控件列表
        $scope.UICtrls = $ctrlService.getCtrlList();
        // 获取属性列表
        $scope.attributes = $ctrlService.getAttributesList();

        // 编辑 控件属性
        $scope.editCtrlValues = (ctrl,tr) => {
            ctrl.map(a => a.isEdit = false);
            tr.isEdit = true;
        };

        // 编辑 完毕
        $scope.editEnd = attributes => {
            let ctrl = new Object();
            attributes.map(a => {
                a.isEdit = false;
                ctrl[a.key] = a.value;
            });
            $editService.updateByUser(ctrl); // 更新ctrl
            $rootScope.$broadcast("refreshEditView");
        };

        $rootScope.$on("showCtrlAttributesWithValue", (event, ctrl) => {
            $scope.attributes = $ctrlService.getAttributeValueList(ctrl);
        });

        $scope.dragUICtrl = (data, events) => {
            console(data, events);
        };
    }]);
};