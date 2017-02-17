/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [path, Electron] = [require("path"), require("electron")];
const [DispatchTactics] = [require(path.join(__dirname, "dispatchTactics"))];

DispatchTactics.initDispatchTactics(Electron).then(() => {
    console.log(`${new Date} -- IPC[info] : init success`);
}).catch(err => {
    console.log(`${new Date} -- IPC[error] : init fail, because ${err.message}`);
});

function registerIpc() {
    let ipc = Electron.ipcMain;

    ipc.on("system", (event, param) => {
        let {tacticBlock, _param} = param;
        let func = DispatchTactics[tacticBlock];
        if (func)
            func.call(DispatchTactics, _param).then((...args) => {
                console.log(`${new Date} -- IPC[info] : execute ${tacticBlock} success`);
                event.sender.send("executeInfo", args);
            }).catch(err => {
                console.log(`${new Date} -- IPC[error] : execute ${tacticBlock} fail, because ${err.message}`);
                event.sender.send("executeFail", err);
            });
        else {
            event.sender.send("executeFail", "no such this tactic!");
        }
    });

    ipc.on("hook-file", (event, param) => {

    });
}

module.exports = {registerIpc};
