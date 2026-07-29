/*Write a code to move all the negative numbers before all the positive numbers in an array. Remember
order of the numbers in array must be same it must not be sorted in any order.
e.g. input is [5,2,7,-4,3,-8,-10]
output is [-4,-8,-10,5,2,7,3]*/

var _ = require("underscore");

var evens = _.reject([1, 2, 3, 4, 5, 6], (num) => num % 2 != 0);

console.log("Evens");
console.log(evens);

function changeOrder(nums) {
  let index = 0;
  let res = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= 0) {
      res.push(nums[i]);
    } else if (nums[i] < 0) {
      res.unshift(nums[i]);
    }
  }
  let ans = [];
  let ans2 = [];
  for (let i = 0; i < res.length; i++) {
    if (res[i] < 0) {
      ans.push(res[i]);
    } else {
      ans2.push(res[i]);
    }
  }
  ans.reverse();
  return [...ans, ...ans2];
}

console.log(changeOrder([5, 2, 7, -4, 3, -8, -10]));
