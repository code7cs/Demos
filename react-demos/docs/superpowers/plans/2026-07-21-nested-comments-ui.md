# Nested Comments UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete React nested-comments interview solution from a flat comment array.

**Architecture:** Keep data normalization in a pure `buildCommentTree` function and UI behavior in recursive React components. The container owns a set of collapsed comment IDs; child components receive only the state and callback needed to render.

**Tech Stack:** React 19, TypeScript, Vitest, jsdom, React Router, CSS.

---

### Task 1: Flat comments to tree

**Files:**

- Create: `src/nested-comments/comment.types.ts`
- Create: `src/nested-comments/comment-tree.test.ts`
- Create: `src/nested-comments/comment-tree.ts`

- [ ] **Step 1: Write failing transformation tests**

Test out-of-order parent/child records, stable sibling order, orphan promotion, and input immutability.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/nested-comments/comment-tree.test.ts`

Expected: FAIL because `buildCommentTree` does not exist.

- [ ] **Step 3: Add the minimal linear-time implementation**

Create all tree nodes first, then attach them in input order:

```ts
const nodes = new Map(comments.map((comment) => [comment.id, { ...comment, children: [] }]));
for (const comment of comments) {
  const node = nodes.get(comment.id)!;
  const parent = comment.parentId ? nodes.get(comment.parentId) : undefined;
  (parent ? parent.children : roots).push(node);
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/nested-comments/comment-tree.test.ts`

Expected: all tree tests pass.

### Task 2: Recursive React UI

**Files:**

- Create: `src/nested-comments/NestedComments.test.tsx`
- Create: `src/nested-comments/CommentItem.tsx`
- Create: `src/nested-comments/NestedComments.tsx`

- [ ] **Step 1: Write failing rendering and interaction tests**

Render nested content, click `Collapse 2 replies`, verify descendants are hidden, then click `Expand 2 replies` and verify they return. Also test the empty state.

- [ ] **Step 2: Run the UI test and verify RED**

Run: `npm test -- src/nested-comments/NestedComments.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement recursive rendering and lifted collapse state**

Use a recursive `CommentItem` and update a copied `Set<string>` in the container so each thread can collapse independently.

- [ ] **Step 4: Run the UI test and verify GREEN**

Run: `npm test -- src/nested-comments/NestedComments.test.tsx`

Expected: all component tests pass.

### Task 3: Demo integration and verification

**Files:**

- Create: `src/nested-comments/comments.fixture.ts`
- Create: `src/nested-comments/NestedCommentsDemo.tsx`
- Create: `src/nested-comments/nested-comments.css`
- Modify: `src/App.tsx`
- Modify: `src/routes.tsx`

- [ ] **Step 1: Add realistic sample data and responsive styling**

Include multiple roots, multiple nesting levels, and sibling replies so recursion is visible.

- [ ] **Step 2: Register navigation and `/nested-comments` route**

Import `NestedCommentsDemo`, add a `NavLink`, and add the matching route.

- [ ] **Step 3: Run all tests**

Run: `npm test`

Expected: all Vitest files pass.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite finish with exit code 0.
