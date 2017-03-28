/**
 * Created by afterloe on 2017/3/27.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
const [fs, path, Xlsx, http] = [require("fs"), require("path"), require("node-xlsx"), require("http")];
let DATA, OPTIONVALUE, NAME, MODEL, BOM;

function values() {
    let result = new Array(), __self = this;
    Object.keys(__self).map(key => result.push(__self[key]));
    return result;
};

// 获取指定的机型下的 指定的类型
function selectOptions(partType) {
    let [model,type] = ["机型", "产品类型"];
    let WTPart = DATA.find(part => MODEL === part[model] && partType === part[type]);
    return Object.keys(WTPart);
};

// 组装选项-值的内容
function assemblyOptionValue(table, name) {
    if ("option-value" === name) {
        let ov = new Array();
        table.data.forEach((items, index) => {
            if (0 === index) return;
            let option_value = new Object();
            let option = items[0].split("-"),
                influences = items[2].split("-");
            option_value["main"] = option[0];
            option_value["attribute-main"] = option[1];
            option_value["value"] = items[1];
            option_value["subscriber"] = influences[0];
            option_value["attribute-sub"] = influences[1];
            option_value["rang"] = items[3].split(",");
            ov.push(option_value);
        });
        OPTIONVALUE = ov;
    }
};

// 组装Part数据
function assemblyData(table, name) {
    if ("data" === name) {
        let key, d = new Array();
        table.data.forEach((items, index) => {
            if (0 === index) {
                key = items;
                return;
            }
            let obj = new Object();
            items.forEach((item, i) => {
                if (null === item) return;
                obj[key[i]] = item;
            });
            d.push(obj);
        });
        DATA = d;
    } else {
      return assemblyOptionValue(table, table.name);
    }
};

// 从云端读取数据
function readCloud(path, type) {
  if ("cloud" !== type) {
    return null;
  }
  MODEL = path;
  DATA = [{
    BOM:"0",
    机型:"风管机",
    产品类型: "创建请假流程",
    "*URL": "office/absence",
    "*METHOD": "POST",
    "*CODE": "create",
  }, {
    BOM:"0",
    机型:"风管机",
    产品类型: "启动流程实例",
    "*URL": "workflow/workflow-instance",
    "*METHOD": "POST",
    "*CODE": "start",
  }, {
    BOM:"0",
    机型:"风管机",
    产品类型: "流程审批",
    "*URL": "workflow/workflow-instance",
    "*METHOD": "POST",
    "*CODE": "approval",
  }, {
    BOM:"0",
    机型:"风管机",
    产品类型: "待审批事项",
    "*URL": "workflow/workflow-instance",
    "*METHOD": "POST",
    "*CODE": "myTask",
  }, {
    BOM:"0",
    机型:"风管机",
    产品类型: "获取流程实例信息",
    "*URL": "workflow/workflow-instance",
    "*METHOD": "POST",
    "*CODE": "detail",
  }, {
    BOM:"0",
    机型:"风管机",
    产品类型: "获取流程模板详情",
    "*URL": "workflow/workflow",
    "*METHOD": "GET",
    "*CODE": "detail",
  }, {
    BOM:"0",
    机型:"风管机",
    产品类型: "创建流程模板",
    "*URL": "workflow/workflow",
    "*METHOD": "POST",
    "*CODE": "create",
  }];

  return {name: MODEL, data: DATA};
}

// 从Excel 2007中读取数据
function readExcel(path, type) {
    if ("xlsx" !== type) {
      return readCloud(path, type);
    }
    if (!fs.existsSync(path)) {
      return;
    }
    NAME = path;
    let _data = Xlsx.parse(path);

    for (let table of _data) {
      assemblyData(table, table.name);
    }
};

// 序列化数据
function serializableData() {
    fs.writeFileSync(path.join(__dirname, "..", "public", "serializable.data"), JSON.stringify(DATA));
};

// 反序列化数据
function deserialization() {
    DATA = require(path.join(__dirname, "..", "public", "serializable.data"));
};

function setModelBOM(bom) {
    BOM = bom;
};

function getModelBOM() {
    return {name: MODEL, data: BOM};
};

// 获取Part数据
function getData() {
    return {name: MODEL, data: DATA};
};

// 储存选择的机型
function selectModel(_model) {
    MODEL = _model;
};

// 获取选择的机型
function getSelectModel() {
    return MODEL;
};

// 获取选项-值的内容
function getOptionValue() {
    return {name: NAME, data: OPTIONVALUE};
};

/**
 * 查询 data中的数据
 *
 * @param args {partType, key}
 * @returns {Array}     TODO
 */
function search(...args) {
    let [result,model,type] = [new Set(), "机型", "产品类型"];
    let [partType, key] = args;
    DATA.map(part => {
        if (MODEL !== part[model]) return;
        if (part[key]) result.add(part[key]);
    });
    return Array.from(result);
};

function executeGetValuesByOption(functionName, ctrl) {
    if ("getValuesByOption" === functionName) {
        let [model,type] = ["机型", "产品类型"];
        let partType = ctrl.partType, attributes = new Set();
        DATA.map(part => {
            if (MODEL !== part[model] || partType !== part[type]) return;
            attributes.add(values.call(part));
        });
        ctrl.datas = Array.from(attributes);
        return ctrl;
    }
};

function executeGetAttributesByOption(functionName, ctrl) {
    if ("getAttributesByOption" === functionName) {
        let [model,type] = ["机型", "产品类型"];
        let partType = ctrl.partType, attributes = new Set();
        DATA.map(part => {
            if (MODEL !== part[model] || partType !== part[type]) return;
            Object.keys(part).map(key => attributes.add(key));
        });
        ctrl.labels = Array.from(attributes);
        return ctrl;
    }
    return executeGetValuesByOption(functionName, ctrl);
};

function execute(functionName, ctrl) {
    if (!ctrl.partType) {
        ctrl.labels = ["请先绑定Server再执行方法"];
        ctrl.datas = [["请先绑定Server再执行方法"]];
        return ctrl;
    }
    return executeGetAttributesByOption(functionName, ctrl);
};

function findByCondition(_type, optionSet) {
    let [model,type] = ["机型", "产品类型"], result = new Array();
    DATA.map(data => {
        let [model,type] = ["机型", "产品类型"];
        if (MODEL !== data[model] && data[type] !== _type) return;
        optionSet.map(os => {
            let key = os.key;
            if (data[key] == os.value) result.push(data);
        });
    });
    return result;
};

function queryData(_type, key, rang) {
    let result = new Array();
    DATA.map(data => {
        let [model,type] = ["机型", "产品类型"];
        if (MODEL !== data[model] || data[type] !== _type) return;
        rang.map(value => {
            if (data[key] == value) result.push(data);
        });
    });
    return result;
}

function queryInfluences(subTab) {
    let {label,value} = subTab;
    let result = new Array();
    OPTIONVALUE.map(ov => {
        if (ov["main"] == label && ov["attribute-main"] && value[ov["attribute-main"]] && value[ov["attribute-main"]] == ov["value"])
            result.push({
                subscriber: ov["subscriber"],
                datas: queryData(ov["subscriber"], ov["attribute-sub"], ov["rang"])
            });
    });
    return result;
}

module.exports = function () {
    return {
        selectModel,
        getSelectModel,
        getOptionValue,
        selectOptions,
        search,
        setModelBOM,
        getModelBOM,
        execute,
        findByCondition,
        queryInfluences,
        buildSource: readExcel,
        serializable: serializableData,
        deserialization: deserialization,
        getData: getData
    }
};
