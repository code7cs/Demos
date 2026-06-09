/**
 * LeetCode 153. Find Minimum in Rotated Sorted Array
 * https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
 * NeetCode 150: Binary Search
 *
 * npm run solve src/05-binary-search/0153-find-minimum-in-rotated-sorted-array.ts
 */

import { runTests } from "../types.js";

function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}

runTests("findMin", findMin as (...args: unknown[]) => unknown, [
  { args: [[3, 4, 5, 1, 2]], expected: 1 },
  { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
  { args: [[11, 13, 15, 17]], expected: 11 },
  { args: [[2, 1]], expected: 1 },
  { args: [[1]], expected: 1 },
]);
