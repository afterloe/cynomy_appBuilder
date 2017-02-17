/**
 * Created by afterloe on 2016/8/3.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
let a = "abc";

console.log("string" === typeof a);

let b = "8K,12K,36K";
console.log(b.split(","));

let c = "*壳体编码";
console.log(c.substring(1));

let d = {name: "1", value: "2", zep: "3"};
console.log(Object.keys(d));
console.log(d instanceof Object);

let e = new Set();
e.add("1",2,4);
console.log(e.size);