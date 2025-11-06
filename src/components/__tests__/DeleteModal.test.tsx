import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteModal from "@/components/DeleteModal";

describe("DeleteModal interactions", () => {
  it("calls onConfirm and onCancel on respective button clicks", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<DeleteModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByText(/delete comment/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /yes, delete/i }));
    expect(onConfirm).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /no, cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});