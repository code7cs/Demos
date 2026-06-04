/**
 * LeetCode 347. Top K Frequent Elements
 * https://leetcode.com/problems/top-k-frequent-elements/
 * NeetCode 150: Arrays & Hashing (bucket sort; also fits Heap)
 *
 * Sprint: LeetCode Sprint 2 — NeetCode 150 (Jun 1–14), Day 1
 * Approach: bucket sort by frequency
 * Ref: https://www.youtube.com/watch?v=YPTqKIgVk-k
 *
 * npm run solve src/01-arrays-hashing/0347-top-k-frequent-elements.ts
 */

import { runTests } from "../types.js";

function topKFrequent(nums: number[], k: number): number[] {
  const map = new Map<number, number>();

  for (const n of nums) {
    map.set(n, (map.get(n) || 0) + 1);
  }

  const freq: number[][] = new Array(nums.length + 1)
    .fill(null)
    .map(() => []);

  for (const [num, val] of map.entries()) {
    freq[val].push(num);
  }

  const res: number[] = [];

  for (let i = freq.length - 1; i > 0; i--) {
    for (const num of freq[i]) {
      res.push(num);
      if (res.length === k) {
        return res;
      }
    }
  }

  return res;
}

runTests("topKFrequent", topKFrequent as (...args: unknown[]) => unknown, [
  { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
  { args: [[1], 1], expected: [1] },
]);
