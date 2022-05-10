// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const async = require('async');
const delay = require('util').promisify(setTimeout);
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

const myMapLimit = (arr: any[], limit: number, asyncCallback: any): Promise<any> => {
  let len = arr.length;
  let resArr = [];
  let cycle = () => {
    let currArr = arr.splice(0, limit);
    if (currArr.length) {
      let promises = [];
      currArr.forEach((item) => {
        promises.push(asyncCallback.call(this, item));
      });
      Promise.all(promises).then((value) => {
        resArr.push(...value);
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
}

let arr = ['1', '2', '3', '4', '5', '6'];
let cb = (num) => {
  console.log('2. ', new Date().toLocaleString());
  return delay(1000).then(() => {
    console.log('4. Inside', new Date().toLocaleString());
    return num * 2;
  });
};

let myFc = myMapLimit(arr, 2, cb);
myFc.then((v) => console.log('output is: ', v));
