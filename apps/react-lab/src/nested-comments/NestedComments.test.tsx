import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import NestedComments from './NestedComments';

const comments = [
  {
    id: 'grandchild',
    parentId: 'reply-1',
    author: 'Mina',
    body: 'Nested response',
    createdAt: '2026-07-21T12:04:00Z',
  },
  {
    id: 'root',
    parentId: null,
    author: 'Avery',
    body: 'What should we build next?',
    createdAt: '2026-07-21T12:00:00Z',
  },
  {
    id: 'reply-1',
    parentId: 'root',
    author: 'Jules',
    body: 'A comments UI',
    createdAt: '2026-07-21T12:02:00Z',
  },
  {
    id: 'reply-2',
    parentId: 'root',
    author: 'Lee',
    body: 'Add keyboard-friendly controls',
    createdAt: '2026-07-21T12:03:00Z',
  },
];

describe('NestedComments', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('recursively renders a flat comment list at the correct depth', () => {
    act(() => root.render(<NestedComments comments={comments} />));

    const rootComment = container.querySelector<HTMLElement>('[data-comment-id="root"]')!;
    const repliesContainer = rootComment.querySelector<HTMLElement>(
      ':scope > .comment-content > .comment-children',
    )!;
    const directReplies = [...repliesContainer.children];
    const firstReply = container.querySelector<HTMLElement>('[data-comment-id="reply-1"]')!;

    expect(directReplies).toHaveLength(2);
    expect(firstReply.querySelector('[data-comment-id="grandchild"]')?.textContent).toContain(
      'Nested response',
    );
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe('2026-07-21T12:00:00Z');
  });

  it('collapses and expands only the selected comment thread', () => {
    act(() => root.render(<NestedComments comments={comments} />));

    const toggle = [...container.querySelectorAll<HTMLButtonElement>('button')].find((button) =>
      button.textContent?.includes('Collapse 2 replies'),
    )!;

    act(() => toggle.click());

    expect(container.textContent).not.toContain('A comments UI');
    expect(container.textContent).not.toContain('Nested response');
    expect(container.textContent).toContain('Expand 2 replies');

    act(() => toggle.click());

    expect(container.textContent).toContain('A comments UI');
    expect(container.textContent).toContain('Nested response');
  });

  it('renders an empty state when there are no comments', () => {
    act(() => root.render(<NestedComments comments={[]} />));

    expect(container.querySelector('[role="status"]')?.textContent).toContain('No comments yet');
  });
});
