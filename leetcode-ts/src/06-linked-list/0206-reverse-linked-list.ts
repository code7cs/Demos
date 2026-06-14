/**
 * LeetCode 206. Reverse Linked List
 * https://leetcode.com/problems/reverse-linked-list/
 * NeetCode 150: Linked List
 *
 * npm run solve src/06-linked-list/0206-reverse-linked-list.ts
 */

import { ListNode, runTests } from "../types.js";

function reverseList(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }

  const last = reverseList(head.next);
  head.next.next = head;
  head.next = null;

  return last;
}

function buildList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let current = dummy;

  for (const value of values) {
    current.next = new ListNode(value);
    current = current.next;
  }

  return dummy.next;
}

function toArray(head: ListNode | null): number[] {
  const values: number[] = [];
  let current = head;

  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }

  return values;
}

function reverseListValues(values: number[]): number[] {
  return toArray(reverseList(buildList(values)));
}

runTests("reverseList", reverseListValues as (...args: unknown[]) => unknown, [
  { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
  { args: [[1, 2]], expected: [2, 1] },
  { args: [[]], expected: [] },
  { args: [[1]], expected: [1] },
]);
