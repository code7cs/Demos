/**
 * LeetCode 199. Binary Tree Right Side View
 * https://leetcode.com/problems/binary-tree-right-side-view/
 * NeetCode 150: Trees (BFS / level-order traversal)
 *
 * Sprint: LeetCode Sprint 2 — NeetCode 150 (Jun 1–14), Day 4
 * Approach: BFS — rightmost node at each level
 * Ref: https://www.youtube.com/watch?v=d4zLyf32e3I
 *
 * Why this works:
 * - Standing on the right, you see one node per level: the rightmost visible one.
 * - That is equivalent to: for each level, take the last non-null node processed
 *   left-to-right (not always the right child — e.g. a left child can be visible
 *   if nothing is to its right on that level).
 * - Queue holds one level at a time. Snapshot q.length, process exactly that many
 *   nodes, enqueue children (left before right). The last non-null node seen in
 *   the loop is this level's right-side view.
 * - O(n) time, O(n) space for the queue.
 *
 * npm run solve src/07-trees/0199-binary-tree-right-side-view.ts
 */

import { TreeNode } from "../types.js";

function rightSideView(root: TreeNode | null): number[] {
  const res: number[] = [];
  const q: (TreeNode | null)[] = [root];

  while (q.length > 0) {
    let rightSide: TreeNode | null = null;
    const qLen = q.length;

    for (let i = 0; i < qLen; i++) {
      const node = q.shift()!;
      if (node) {
        rightSide = node;
        q.push(node.left);
        q.push(node.right);
      }
    }

    if (rightSide) {
      res.push(rightSide.val);
    }
  }

  return res;
}

/** Build tree from LeetCode-style level-order array (null = missing node). */
function buildTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] == null) return null;
  const root = new TreeNode(values[0]);
  const q: TreeNode[] = [root];
  let i = 1;

  while (q.length > 0 && i < values.length) {
    const node = q.shift()!;
    if (i < values.length && values[i] != null) {
      node.left = new TreeNode(values[i]!);
      q.push(node.left);
    }
    i++;
    if (i < values.length && values[i] != null) {
      node.right = new TreeNode(values[i]!);
      q.push(node.right);
    }
    i++;
  }

  return root;
}

// --- local sanity checks ---
const cases: { tree: (number | null)[]; expected: number[] }[] = [
  { tree: [1, 2, 3, null, 5, null, 4], expected: [1, 3, 4] },
  { tree: [1, null, 3], expected: [1, 3] },
  // NeetCode video example: 1 / 2,3 / ∅,5,∅,4 / 7
  { tree: [1, 2, 3, null, 5, null, 4, 7], expected: [1, 3, 4, 7] },
];

let passed = 0;
for (let i = 0; i < cases.length; i++) {
  const { tree, expected } = cases[i];
  const got = rightSideView(buildTree(tree));
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  console.log(
    ok ? "✓" : "✗",
    `rightSideView case ${i + 1}:`,
    ok ? "pass" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`
  );
  if (ok) passed++;
}
console.log(`${passed}/${cases.length} passed\n`);
