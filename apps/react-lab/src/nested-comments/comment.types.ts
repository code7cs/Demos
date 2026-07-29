export type CommentRecord = {
  id: string;
  parentId: string | null;
  author: string;
  body: string;
  createdAt: string;
};

export type CommentNode = CommentRecord & {
  children: CommentNode[];
};
