/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [fs,Xlsx] = [require("fs"), require("node-xlsx")];

const filePath = "C:/Users/Administrator/Documents/Tencent Files/605728727/FileRecv/副本风管机参数.xlsx";
let _data = Xlsx.parse(filePath);

let d = new Array();

for (let table of _data) {
    if ("data" === table.name) {
        let parname;
        table.data.forEach((items, index) => {
            if (0 === index) {
                parname = items;
                return;
            }
            let obj = new Object();
            items.forEach((item, i) => {
                obj[parname[i]] = item;
            });
            d.push(obj);
        });
    }
}

console.log(d.length);
console.log(JSON.stringify(d));