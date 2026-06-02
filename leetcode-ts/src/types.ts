/** Shared LeetCode helpers (ListNode, TreeNode, etc.) */

export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val ?? 0;
    this.next = next ?? null;
  }
}

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

/** Run a solution against sample cases. */
export function runTests(
  name: string,
  fn: (...args: unknown[]) => unknown,
  cases: { args: unknown[]; expected: unknown }[]
): void {
  let passed = 0;
  for (let i = 0; i < cases.length; i++) {
    const { args, expected } = cases[i];
    const got = fn(...args);
    const ok = JSON.stringify(got) === JSON.stringify(expected);
    console.log(
      ok ? `✓` : `✗`,
      `${name} case ${i + 1}:`,
      ok ? "pass" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`
    );
    if (ok) passed++;
  }
  console.log(`${passed}/${cases.length} passed\n`);
}
