import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Editor from "@/components/Editor";
import type { User } from "@/shared/types/Comments";

const currentUser: User = {
  username: "juliusomo",
  image: { png: "/assets/avatars/image-juliusomo.png", webp: "/assets/avatars/image-juliusomo.webp" },
};

describe("Editor component", () => {
  it("submits trimmed text and clears textarea", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Editor currentUser={currentUser} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText("Add a comment…");
    await user.type(textarea, "   Hello world  ");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(onSubmit).toHaveBeenCalledWith("Hello world");
    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });

  it("does not submit when text is empty or whitespace", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Editor currentUser={currentUser} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders Cancel button when onCancel provided and calls it", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(<Editor currentUser={currentUser} onSubmit={onSubmit} onCancel={onCancel} />);
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });
});