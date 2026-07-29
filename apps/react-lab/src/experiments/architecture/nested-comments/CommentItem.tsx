import type { CommentNode } from './comment.types';

type CommentItemProps = {
  comment: CommentNode;
  isCollapsed: (commentId: string) => boolean;
  onToggle: (commentId: string) => void;
};

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export default function CommentItem({ comment, isCollapsed, onToggle }: CommentItemProps) {
  const hasReplies = comment.children.length > 0;
  const collapsed = isCollapsed(comment.id);
  const replyLabel = comment.children.length === 1 ? 'reply' : 'replies';
  const repliesId = `comment-replies-${comment.id}`;

  return (
    <article className="comment" data-comment-id={comment.id}>
      <div className="comment-avatar" aria-hidden="true">
        {comment.author.slice(0, 1).toUpperCase()}
      </div>

      <div className="comment-content">
        <header className="comment-meta">
          <strong>{comment.author}</strong>
          <span aria-hidden="true">·</span>
          <time dateTime={comment.createdAt}>
            {dateFormatter.format(new Date(comment.createdAt))}
          </time>
        </header>

        <p className="comment-body">{comment.body}</p>

        {hasReplies && (
          <button
            className="comment-toggle"
            type="button"
            aria-controls={repliesId}
            aria-expanded={!collapsed}
            onClick={() => onToggle(comment.id)}
          >
            {collapsed ? 'Expand' : 'Collapse'} {comment.children.length} {replyLabel}
          </button>
        )}

        {hasReplies && !collapsed && (
          <div className="comment-children" id={repliesId}>
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                isCollapsed={isCollapsed}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
