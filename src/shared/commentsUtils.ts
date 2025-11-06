import type { Comment, Reply, User } from "@/shared/types/Comments";

// Beginner-friendly helpers for @mentions in reply text
export const getMentionUser = (text: string): string | null => {
  const match = text.trimStart().match(/^@(\w+)/);
  return match?.[1] ?? null;
};

export const removeLeadingMention = (text: string): string => {
  const trimmed = text.trimStart();
  const match = trimmed.match(/^@(\w+)/);
  return match ? trimmed.slice(match[0].length).trimStart() : text;
};

// Sorting helpers
export const sortByScoreDesc = (list: Comment[]): Comment[] => [...list].sort((a, b) => b.score - a.score);
export const sortRepliesByScoreDesc = (list: Reply[]): Reply[] => [...list].sort((a, b) => b.score - a.score);

// ID helper for comments and replies
export const nextId = (list: Comment[]): number =>
  Math.max(
    0,
    ...list.map((cm) => cm.id),
    ...list.flatMap((cm) => cm.replies.map((rp) => rp.id))
  ) + 1;

// Normalize user in case avatars need remapping
export const normalizeUser = (user: User): User => ({
  image: { png: user.image.png, webp: user.image.webp },
  username: user.username,
});