/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const path = require("path");

const [ipc] = [require(path.join(__dirname, "ipc"))];

module.exports = {
    registerIpc : ipc.registerIpc
};