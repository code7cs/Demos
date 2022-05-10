// run `node index.js` in the terminal
var _this = this;
console.log("Hello Node.js v".concat(process.versions.node, "!"));
var async = require('async');
var delay = require('util').promisify(setTimeout);
console.log('1. Before: ', new Date().toLocaleString());
// const numPromise = async.mapLimit(['1', '2', '3', '4', '5'], 2, async (num) => {
//   console.log('2. ', new Date().toLocaleString());
//   return delay(2000).then(() => {
//     console.log('4. Inside', new Date().toLocaleString());
//     return num * 2;
//   });
// });
// or const numPromise = async.mapLimit(['1','2','3','4','5'], 3, async num => {
//    await delay(200);
//    return num*2;
// })
// console.log('3. ', new Date().toLocaleString());
// numPromise.then((results) => {
//   console.log('5. ', results, new Date().toLocaleString());
// });
var myMapLimit = function (arr, limit, asyncCallback) {
    var len = arr.length;
    var resArr = [];
    var cycle = function () {
        var currArr = arr.splice(0, limit);
        if (currArr.length) {
            var promises_1 = [];
            currArr.forEach(function (item) {
                promises_1.push(asyncCallback.call(_this, item));
            });
            Promise.all(promises_1).then(function (value) {
                resArr.push.apply(resArr, value);
                console.log(resArr);
                if (resArr.length === len) {
                    // Promise.resolve(resArr).then((v) => {
                    console.log('result is: ', resArr);
                    // });
                }
                cycle();
            });
        }
    };
    cycle();
    return Promise.resolve(resArr);
};
var arr = ['1', '2', '3', '4', '5', '6'];
var cb = function (num) {
    console.log('2. ', new Date().toLocaleString());
    return delay(1000).then(function () {
        console.log('4. Inside', new Date().toLocaleString());
        return num * 2;
    });
};
var myFc = myMapLimit(arr, 2, cb);
myFc.then(function (v) { return console.log('output is: ', v); });
