import type { CommentRecord } from './comment.types';

export const sampleComments: CommentRecord[] = [
  {
    id: 'comment-6',
    parentId: 'comment-4',
    author: 'Priya',
    body: 'That separation also makes the recursive component much easier to test.',
    createdAt: '2026-07-21T14:18:00Z',
  },
  {
    id: 'comment-1',
    parentId: null,
    author: 'Morgan',
    body: 'What makes a nested comments implementation interview-ready?',
    createdAt: '2026-07-21T14:00:00Z',
  },
  {
    id: 'comment-7',
    parentId: null,
    author: 'Taylor',
    body: 'How would you extend this if comments came from an API?',
    createdAt: '2026-07-21T14:20:00Z',
  },
  {
    id: 'comment-2',
    parentId: 'comment-1',
    author: 'Riley',
    body: 'Start with a clear data model, then keep transformation separate from rendering.',
    createdAt: '2026-07-21T14:05:00Z',
  },
  {
    id: 'comment-4',
    parentId: 'comment-2',
    author: 'Devon',
    body: 'I would use a map so building the tree stays O(n), even for a large thread.',
    createdAt: '2026-07-21T14:11:00Z',
  },
  {
    id: 'comment-3',
    parentId: 'comment-1',
    author: 'Alex',
    body: 'Accessible expand and collapse controls are a good, focused interaction to add.',
    createdAt: '2026-07-21T14:08:00Z',
  },
  {
    id: 'comment-8',
    parentId: 'comment-7',
    author: 'Jordan',
    body: 'I would keep server data normalized, then derive this view model with useMemo.',
    createdAt: '2026-07-21T14:24:00Z',
  },
  {
    id: 'comment-5',
    parentId: 'comment-4',
    author: 'Cameron',
    body: 'And I would call out that the input array is never mutated.',
    createdAt: '2026-07-21T14:15:00Z',
  },
];
