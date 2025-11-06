import { describe, it, expect } from "vitest";
import { sortByScoreDesc, sortRepliesByScoreDesc, nextId } from "@/shared/commentsUtils";
import type { Comment, Reply, User } from "@/shared/types/Comments";

const user = (name: string): User => ({
  username: name,
  image: { png: `/assets/${name}.png`, webp: `/assets/${name}.webp` },
});

const makeComment = (id: number, score: number, replies: Reply[] = []): Comment => ({
  id,
  content: `Comment ${id}`,
  createdAt: "now",
  score,
  user: user("alpha"),
  replies,
});

const makeReply = (id: number, score: number): Reply => ({
  id,
  content: `Reply ${id}`,
  createdAt: "now",
  score,
  user: user("beta"),
  replyingTo: "alpha",
});

describe("sorting helpers", () => {
  it("sortByScoreDesc orders comments by score descending", () => {
    const list = [makeComment(1, 2), makeComment(2, 10), makeComment(3, 5)];
    const sorted = sortByScoreDesc(list);
    expect(sorted.map((c) => c.id)).toEqual([2, 3, 1]);
  });

  it("sortRepliesByScoreDesc orders replies by score descending", () => {
    const list = [makeReply(4, 0), makeReply(5, 7), makeReply(6, 1)];
    const sorted = sortRepliesByScoreDesc(list);
    expect(sorted.map((r) => r.id)).toEqual([5, 6, 4]);
  });
});

describe("nextId helper", () => {
  it("returns max id + 1 across comments and replies", () => {
    const comments: Comment[] = [
      makeComment(1, 1, [makeReply(2, 1)]),
      makeComment(7, 0, [makeReply(5, 1), makeReply(9, 2)]),
    ];
    expect(nextId(comments)).toBe(10);
  });

  it("returns 1 when list is empty", () => {
    expect(nextId([])).toBe(1);
  });
});