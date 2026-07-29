/**
 * LeetCode 35. Search Insert Position
 * https://leetcode.com/problems/search-insert-position/
 * NeetCode 150: Binary Search
 *
 * npm run solve src/05-binary-search/0035-search-insert-position.ts
 */

import { runTests } from "../types.js";

function searchInsert(nums: number[], target: number): number {
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

  return left;
}

runTests("searchInsert", searchInsert as (...args: unknown[]) => unknown, [
  { args: [[1, 3, 5, 6], 5], expected: 2 },
  { args: [[1, 3, 5, 6], 2], expected: 1 },
  { args: [[1, 3, 5, 6], 7], expected: 4 },
  { args: [[1, 3, 5, 6], 0], expected: 0 },
  { args: [[1], 0], expected: 0 },
]);
