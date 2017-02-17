/**
 * Created by afterloe on 2016/8/4.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [fs, path] = [require("fs"), require("path")];

let cache = new Array();

// 通过模板名字 读取模板
function readTemplate(name) {
    let _path = path.join(__dirname, name); // 配置模板路径
    if (!fs.existsSync(_path)) throw new Error("Template is not find!"); // 如果路径不存在则报错
    let object = new Object();
    object.name = name;
    // 读取模板内容
    object.value = fs.readFileSync(_path, {
        encoding: "utf8",
        flag: "r"
    });
    return object;
};

// 对外暴露方法
module.exports.getTemplate = name => {
    let obj = cache.find(o => name === o.name); // 查询模板
    if (obj) return obj.value;  // 如果模板存在，则立即返回模板的内容
    try {
        obj = readTemplate(name);   // 不存在则调用读取模板方法，获取到处理后的对象
        cache.push(obj);    // 将模板对象存入缓存之中
        return obj.value;   // 返回模板内容
    } catch (err) {
        console.log(`${new Date} - templates[fail] : can't find any template which name is ${name}`);
        return "";
    }
};