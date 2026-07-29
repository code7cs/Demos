# Nested Comments UI Design

## Goal

Add a complete 60-minute-style React interview solution that renders a flat comment list as an arbitrarily deep nested thread and lets users collapse or expand replies.

## Data and behavior

- Input comments are flat records with `id`, `parentId`, `author`, `body`, and `createdAt`.
- `buildCommentTree` creates cloned tree nodes in linear time with a map plus one attachment pass.
- A comment with `parentId: null` is a root. A comment whose parent is missing is also kept as a root so malformed input does not disappear.
- Input order is preserved among siblings and the input array is never mutated.
- `CommentItem` recursively renders one semantic article and its child group.
- A parent with replies exposes an accessible collapse/expand button. Collapsed IDs live in the top-level component so UI state has one owner.

## Components

- `comment.types.ts`: flat and tree node contracts.
- `comment-tree.ts`: framework-independent flat-to-tree transformation.
- `comments.fixture.ts`: realistic sample data, deliberately not topologically sorted.
- `CommentItem.tsx`: recursive presentational component.
- `NestedComments.tsx`: tree derivation, collapse state, and empty state.
- `NestedCommentsDemo.tsx`: interview framing and sample app shell.
- `nested-comments.css`: visual hierarchy and responsive styling.

## Testing

Vitest/jsdom tests cover arbitrary input order, sibling ordering, orphan handling, immutability, recursive rendering, independent collapse/expand behavior, and empty input. The production build verifies TypeScript and route integration.
