/**
 * LeetCode 153. Find Minimum in Rotated Sorted Array
 * https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
 * NeetCode 150: Binary Search
 *
 * npm run solve src/05-binary-search/0153-find-minimum-in-rotated-sorted-array.ts
 */

import { runTests } from "../types.js";

function findMin(nums: number[]): number {
  let res = nums[0];
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    if (nums[left] < nums[right]) {
      res = Math.min(res, nums[left]);
      break;
    }

    const mid = left + Math.floor((right - left) / 2);
    res = Math.min(res, nums[mid]);

    if (nums[mid] >= nums[left]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return res;
}

runTests("findMin", findMin as (...args: unknown[]) => unknown, [
  { args: [[3, 4, 5, 1, 2]], expected: 1 },
  { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
  { args: [[11, 13, 15, 17]], expected: 11 },
  { args: [[2, 1]], expected: 1 },
  { args: [[1]], expected: 1 },
]);
