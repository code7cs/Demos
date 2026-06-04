/**
 * LeetCode 15. 3Sum
 * https://leetcode.com/problems/3sum/
 * NeetCode 150: Two Pointers
 *
 * Sprint: LeetCode Sprint 2 — NeetCode 150 (Jun 1–14), Day 2
 * Approach: sort + two pointers
 * Ref: https://www.youtube.com/watch?v=jzZsG8n2R9A
 *
 * npm run solve src/02-two-pointers/0015-3sum.ts
 */

import { runTests } from "../types.js";

function threeSum(nums: number[]): number[][] {
  const res: number[][] = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum > 0) {
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        res.push([nums[i], nums[left], nums[right]]);
        left++;
        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
      }
    }
  }

  return res;
}

runTests("threeSum", threeSum as (...args: unknown[]) => unknown, [
  { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
  { args: [[0, 1, 1]], expected: [] },
  { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
]);
