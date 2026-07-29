import { describe, expect, it } from 'vitest';
import { buildCommentTree } from './comment-tree';

const comments = [
  {
    id: 'reply-2',
    parentId: 'reply-1',
    author: 'Mina',
    body: 'A deeply nested reply',
    createdAt: '2026-07-21T12:04:00Z',
  },
  {
    id: 'root-1',
    parentId: null,
    author: 'Avery',
    body: 'First root comment',
    createdAt: '2026-07-21T12:00:00Z',
  },
  {
    id: 'reply-1',
    parentId: 'root-1',
    author: 'Jules',
    body: 'First reply',
    createdAt: '2026-07-21T12:02:00Z',
  },
  {
    id: 'root-2',
    parentId: null,
    author: 'Sam',
    body: 'Second root comment',
    createdAt: '2026-07-21T12:01:00Z',
  },
  {
    id: 'reply-3',
    parentId: 'root-1',
    author: 'Lee',
    body: 'Second reply',
    createdAt: '2026-07-21T12:03:00Z',
  },
];

describe('buildCommentTree', () => {
  it('builds arbitrary-depth trees even when children arrive before their parents', () => {
    const tree = buildCommentTree(comments);

    expect(tree.map((comment) => comment.id)).toEqual(['root-1', 'root-2']);
    expect(tree[0].children.map((comment) => comment.id)).toEqual(['reply-1', 'reply-3']);
    expect(tree[0].children[0].children.map((comment) => comment.id)).toEqual(['reply-2']);
  });

  it('keeps an orphan visible as a root comment', () => {
    const tree = buildCommentTree([
      ...comments,
      {
        id: 'orphan',
        parentId: 'missing-parent',
        author: 'Casey',
        body: 'My parent was deleted',
        createdAt: '2026-07-21T12:05:00Z',
      },
    ]);

    expect(tree.map((comment) => comment.id)).toEqual(['root-1', 'root-2', 'orphan']);
  });

  it('does not mutate the input records', () => {
    const snapshot = structuredClone(comments);

    buildCommentTree(comments);

    expect(comments).toEqual(snapshot);
    expect(comments.every((comment) => !('children' in comment))).toBe(true);
  });
});
