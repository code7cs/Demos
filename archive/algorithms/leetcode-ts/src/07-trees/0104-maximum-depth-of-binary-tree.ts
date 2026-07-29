/**
 * LeetCode 104. Maximum Depth of Binary Tree
 * https://leetcode.com/problems/maximum-depth-of-binary-tree/
 * NeetCode 150: Trees
 *
 * npm run solve src/07-trees/0104-maximum-depth-of-binary-tree.ts
 */

import { TreeNode } from "../types.js";

function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;

  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/** Build tree from LeetCode-style level-order array (null = missing node). */
function buildTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]);
  const q: TreeNode[] = [root];
  let i = 1;

  while (q.length > 0 && i < values.length) {
    const node = q.shift()!;

    if (i < values.length && values[i] !== null) {
      node.left = new TreeNode(values[i]!);
      q.push(node.left);
    }
    i++;

    if (i < values.length && values[i] !== null) {
      node.right = new TreeNode(values[i]!);
      q.push(node.right);
    }
    i++;
  }

  return root;
}

const cases: { tree: (number | null)[]; expected: number }[] = [
  { tree: [3, 9, 20, null, null, 15, 7], expected: 3 },
  { tree: [1, null, 2], expected: 2 },
  { tree: [], expected: 0 },
  { tree: [1], expected: 1 },
];

let passed = 0;
for (let i = 0; i < cases.length; i++) {
  const { tree, expected } = cases[i];
  const got = maxDepth(buildTree(tree));
  const ok = got === expected;
  console.log(ok ? "✓" : "✗", `maxDepth case ${i + 1}:`, ok ? "pass" : `expected ${expected}, got ${got}`);
  if (ok) passed++;
}
console.log(`${passed}/${cases.length} passed\n`);
