import { useMemo, useState } from 'react';
import { buildCommentTree } from './comment-tree';
import CommentItem from './CommentItem';
import type { CommentRecord } from './comment.types';

type NestedCommentsProps = {
  comments: readonly CommentRecord[];
};

export default function NestedComments({ comments }: NestedCommentsProps) {
  const tree = useMemo(() => buildCommentTree(comments), [comments]);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());

  const toggleComment = (commentId: string) => {
    setCollapsedIds((current) => {
      const next = new Set(current);

      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }

      return next;
    });
  };

  if (tree.length === 0) {
    return (
      <p className="comments-empty" role="status">
        No comments yet. Start the conversation.
      </p>
    );
  }

  return (
    <section className="comments-thread" aria-label="Comments">
      {tree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isCollapsed={(commentId) => collapsedIds.has(commentId)}
          onToggle={toggleComment}
        />
      ))}
    </section>
  );
}
