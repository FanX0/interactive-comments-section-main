import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentCard from "@/components/CommentCard";
import type { Comment, User } from "@/shared/types/Comments";

const makeUser = (username: string): User => ({
  username,
  image: {
    png: `/assets/avatars/${username}.png`,
    webp: `/assets/avatars/${username}.webp`,
  },
});

const makeComment = (id: number, username: string, score: number): Comment => ({
  id,
  content: `Hello from ${username}`,
  createdAt: "1 month ago",
  score,
  user: makeUser(username),
  replies: [],
});

describe("CommentCard visibility and interactions", () => {
  it("shows 'you' badge and edit/delete for current user, hides reply", () => {
    const entry = makeComment(1, "juliusomo", 12);
    const onScoreChange = vi.fn();
    render(
      <CommentCard
        entry={entry}
        currentUser={makeUser("juliusomo")}
        onScoreChange={onScoreChange}
      />
    );
    expect(screen.getByText(/you/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
    expect(screen.queryByText(/reply/i)).not.toBeInTheDocument();
    expect(screen.getByText("1 month ago")).toBeInTheDocument();
  });

  it("shows reply when not current user and hides edit/delete", () => {
    const entry = makeComment(2, "amyrobson", 5);
    const onScoreChange = vi.fn();
    render(
      <CommentCard
        entry={entry}
        currentUser={makeUser("juliusomo")}
        onScoreChange={onScoreChange}
        onReplyClick={vi.fn()}
      />
    );
    expect(screen.getByText(/reply/i)).toBeInTheDocument();
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
  });

  it("passes updated score when upvoting/downvoting", async () => {
    const user = userEvent.setup();
    const entry = makeComment(3, "amyrobson", 2);
    const onScoreChange = vi.fn();
    render(
      <CommentCard
        entry={entry}
        currentUser={makeUser("juliusomo")}
        onScoreChange={onScoreChange}
      />
    );
    const up = screen.getAllByLabelText("Upvote")[0];
    await user.click(up);
    expect(onScoreChange).toHaveBeenCalledWith(3, 3);

    const down = screen.getAllByLabelText("Downvote")[0];
    await user.click(down);
    // last call is downvote to 1
    const lastCall =
      onScoreChange.mock.calls[onScoreChange.mock.calls.length - 1];
    expect(lastCall).toEqual([3, 1]);
  });
});
