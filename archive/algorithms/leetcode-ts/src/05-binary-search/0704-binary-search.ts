/**
 * LeetCode 704. Binary Search
 * https://leetcode.com/problems/binary-search/
 * NeetCode 150: Binary Search
 *
 * npm run solve src/05-binary-search/0704-binary-search.ts
 */

import { runTests } from "../types.js";

function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

runTests("search", search as (...args: unknown[]) => unknown, [
  { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
  { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
  { args: [[5], 5], expected: 0 },
  { args: [[5], -5], expected: -1 },
]);
