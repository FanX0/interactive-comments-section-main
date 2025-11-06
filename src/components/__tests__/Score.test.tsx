import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Score from "@/components/Score";

describe("Score component", () => {
  it("calls onChange with incremented value on upvote", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Score value={5} onChange={onChange} />);
    const up = screen.getAllByLabelText("Upvote")[0];
    await user.click(up);
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("calls onChange with decremented value on downvote and never below 0", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Score value={0} onChange={onChange} />);
    const down = screen.getAllByLabelText("Downvote")[0];
    await user.click(down);
    expect(onChange).toHaveBeenCalledWith(0);
  });
});