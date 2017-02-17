/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const path = require("path");

const [ipcRequire] = [require(path.join(__dirname, "ipcRequire"))];

module.exports = {
    reader : ipcRequire
};