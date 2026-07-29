import type { CommentNode, CommentRecord } from './comment.types';

/**
 * Builds a tree in O(n) time without mutating the input records.
 * Orphans are kept as roots so a missing parent never hides a comment.
 */
export function buildCommentTree(comments: readonly CommentRecord[]): CommentNode[] {
  const nodesById = new Map<string, CommentNode>();

  for (const comment of comments) {
    nodesById.set(comment.id, { ...comment, children: [] });
  }

  const roots: CommentNode[] = [];

  for (const comment of comments) {
    const node = nodesById.get(comment.id)!;
    const parent = comment.parentId === null ? undefined : nodesById.get(comment.parentId);

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
