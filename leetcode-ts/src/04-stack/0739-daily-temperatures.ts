/**
 * LeetCode 739. Daily Temperatures
 * https://leetcode.com/problems/daily-temperatures/
 * NeetCode 150: Stack (monotonic decreasing stack)
 *
 * Sprint: LeetCode Sprint 2 — NeetCode 150 (Jun 1–14), Day 3
 * Approach: monotonic stack of [index, temperature]
 * Ref: https://www.youtube.com/watch?v=cTBiBSnjO3c
 *
 * Why this works:
 * - Brute force: for each day, scan forward until a warmer day → O(n²).
 * - Stack stores days still waiting for their "next warmer" day, in decreasing
 *   temperature order (coldest / most recent unresolved on top).
 * - When today is warmer than stack top, that earlier day found its answer:
 *   wait time = i - index. Pop and repeat — one warmer day can resolve many.
 * - Days left on the stack at the end never get a warmer day → answer stays 0.
 * - Each index is pushed once and popped at most once → O(n) time, O(n) space.
 *
 * npm run solve src/04-stack/0739-daily-temperatures.ts
 */

import { runTests } from "../types.js";

function dailyTemperatures(temperatures: number[]): number[] {
  const res = new Array<number>(temperatures.length).fill(0);
  const stack: [number, number][] = [];

  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length > 0 &&
      temperatures[i] > stack[stack.length - 1][1]
    ) {
      const [index] = stack.pop()!;
      res[index] = i - index;
    }
    stack.push([i, temperatures[i]]);
  }

  return res;
}

runTests(
  "dailyTemperatures",
  dailyTemperatures as (...args: unknown[]) => unknown,
  [
    {
      args: [[73, 74, 75, 71, 69, 72, 76, 73]],
      expected: [1, 1, 4, 2, 1, 1, 0, 0],
    },
    { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    { args: [[30, 60, 90]], expected: [1, 1, 0] },
  ]
);
