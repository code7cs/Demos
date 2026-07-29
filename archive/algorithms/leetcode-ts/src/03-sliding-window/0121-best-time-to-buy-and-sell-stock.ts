/**
 * LeetCode 121. Best Time to Buy and Sell Stock
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 * NeetCode 150: Sliding Window
 *
 * npm run solve src/03-sliding-window/0121-best-time-to-buy-and-sell-stock.ts
 */

import { runTests } from "../types.js";

function maxProfit(prices: number[]): number {
  let left = 0;
  let right = 1;
  let res = 0;

  while (right < prices.length) {
    if (prices[right] < prices[left]) {
      left = right;
    } else if (prices[right] > prices[right - 1]) {
      res = Math.max(res, prices[right] - prices[left]);
    }

    right++;
  }

  return res;
}

runTests("maxProfit", maxProfit as (...args: unknown[]) => unknown, [
  { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
  { args: [[7, 6, 4, 3, 1]], expected: 0 },
  { args: [[1, 2, 4]], expected: 3 },
  { args: [[2, 4, 1]], expected: 2 },
]);
