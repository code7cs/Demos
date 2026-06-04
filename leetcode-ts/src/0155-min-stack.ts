/**
 * LeetCode 155. Min Stack
 * https://leetcode.com/problems/min-stack/
 *
 * Sprint: LeetCode Sprint 2 — NeetCode 150 (Jun 1–14), Day 3
 * Approach: store current minimum on each stack entry
 *
 * Why this works:
 * - A naive getMin() scans the whole stack → O(n).
 * - Instead, each pushed item records { val, min } where min is the smallest
 *   value among everything currently in the stack (including the new val).
 * - push: min = min(val, previousTop.min) — one comparison, O(1).
 * - getMin: read top.min — O(1), no traversal.
 * - pop: removing the top also removes its cached min; the new top still holds
 *   the correct minimum for the remaining elements (LIFO unwinds state).
 *
 * npm run solve src/0155-min-stack.ts
 */

type StackEntry = { val: number; min: number };

class MinStack {
  private stack: StackEntry[] = [];

  constructor() {
    this.stack = [];
  }

  push(val: number): void {
    this.stack.push({
      val,
      min:
        this.stack.length === 0
          ? val
          : Math.min(val, this.stack[this.stack.length - 1].min),
    });
  }

  pop(): void {
    this.stack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1].val;
  }

  getMin(): number {
    return this.stack[this.stack.length - 1].min;
  }
}

// --- local sanity checks ---
const s = new MinStack();
s.push(-2);
s.push(0);
s.push(-3);
console.log("getMin after -2,0,-3:", s.getMin(), "(expected -3)");
s.pop();
console.log("top after pop:", s.top(), "(expected 0)");
console.log("getMin after pop:", s.getMin(), "(expected -2)");
