// Avatar images for a user
export type Image = {
  png: string;
  webp: string;
};

// A user in the system
export type User = {
  image: Image;
  username: string;
};

// Common fields shared by comments and replies
export interface BaseEntry {
  id: number;
  content: string;
  createdAt: string; // e.g. "1 month ago"
  score: number;
  user: User;
}

// A reply to a comment or another reply
export interface Reply extends BaseEntry {
  replyingTo: string; // username being replied to
}

// A top-level comment with a list of replies
export interface Comment extends BaseEntry {
  replies: Reply[];
}

// Root data shape
export interface CommentsData {
  currentUser: User;
  comments: Comment[];
}

// Optional helper type guard (handy when iterating mixed arrays)
export const isReply = (item: BaseEntry | Reply): item is Reply =>
  (item as Reply).replyingTo !== undefined;
