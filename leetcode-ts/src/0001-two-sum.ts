/**
 * LeetCode 1. Two Sum
 * https://leetcode.com/problems/two-sum/
 *
 * npm run solve src/0001-two-sum.ts
 */

import { runTests } from "./types.js";

function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}

runTests("twoSum", twoSum as (...args: unknown[]) => unknown, [
  { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
  { args: [[3, 2, 4], 6], expected: [1, 2] },
  { args: [[3, 3], 6], expected: [0, 1] },
]);
