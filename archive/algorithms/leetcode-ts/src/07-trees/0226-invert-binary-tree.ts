/**
 * LeetCode 226. Invert Binary Tree
 * https://leetcode.com/problems/invert-binary-tree/
 * NeetCode 150: Trees
 *
 * npm run solve src/07-trees/0226-invert-binary-tree.ts
 */

import { TreeNode } from "../types.js";

function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);

  return root;
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

function toLevelOrder(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];

  const values: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];

  while (q.length > 0) {
    const node = q.shift()!;

    if (node === null) {
      values.push(null);
      continue;
    }

    values.push(node.val);
    q.push(node.left);
    q.push(node.right);
  }

  while (values[values.length - 1] === null) {
    values.pop();
  }

  return values;
}

const cases: { tree: (number | null)[]; expected: (number | null)[] }[] = [
  { tree: [4, 2, 7, 1, 3, 6, 9], expected: [4, 7, 2, 9, 6, 3, 1] },
  { tree: [2, 1, 3], expected: [2, 3, 1] },
  { tree: [], expected: [] },
];

let passed = 0;
for (let i = 0; i < cases.length; i++) {
  const { tree, expected } = cases[i];
  const got = toLevelOrder(invertTree(buildTree(tree)));
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  console.log(
    ok ? "✓" : "✗",
    `invertTree case ${i + 1}:`,
    ok ? "pass" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`
  );
  if (ok) passed++;
}
console.log(`${passed}/${cases.length} passed\n`);
