/**
 * Copy to src/<neetcode-topic>/NNNN-problem-slug.ts
 *
 * Run: npm run solve src/<neetcode-topic>/NNNN-problem-slug.ts
 * Check types: npm run typecheck
 */

// When copying into a topic folder, use: import { runTests } from "../types.js";
import { runTests } from "./types.js";
// import { ListNode, TreeNode } from "./types.js";

function solve(/* args */): unknown {
  return undefined;
}

runTests("solve", solve as (...args: unknown[]) => unknown, [
  { args: [], expected: undefined },
]);
