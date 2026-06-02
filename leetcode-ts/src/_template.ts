/**
 * Copy this file to src/<number>-<slug>.ts when starting a new problem.
 *
 * Run:  npm run solve src/<file>.ts
 * Check types:  npm run typecheck
 */

import { runTests } from "./types.js";
// import { ListNode, TreeNode } from "./types.js";

function solve(/* args */): unknown {
  return undefined;
}

runTests("solve", solve as (...args: unknown[]) => unknown, [
  { args: [], expected: undefined },
]);
