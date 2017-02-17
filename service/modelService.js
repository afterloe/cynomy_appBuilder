/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
let modelList = ["风管机", "座吊机", "家用空调", "中央空调"];

module.exports = function () {
    return {
        getModelList: () => modelList
    }
};