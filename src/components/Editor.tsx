import { useState } from "react";
import type { User } from "@/shared/types/Comments";

type Props = {
  currentUser: User | null;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  initialText?: string;
};

const Editor = ({
  currentUser,
  placeholder = "Add a comment…",
  submitLabel = "SEND",
  autoFocus,
  onSubmit,
  onCancel,
  initialText = "",
}: Props) => {
  const [text, setText] = useState(initialText);
  return (
    <div className="mt-3 grid grid-cols-1 gap-3 rounded-lg bg-White p-4 md:grid-cols-[auto_1fr_auto] md:items-start">
      {/* Desktop avatar */}
      <img
        src={currentUser?.image.png}
        alt="avatar"
        className="hidden md:block h-10 w-10 rounded-full"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="min-h-24 w-full resize-y rounded-md border-3 border-Grey-100 p-3 text-Grey-800 outline-none focus:border-Purple-600 focus:ring-2 focus:ring-Purple-200"
      />
      <div className="flex items-center gap-3 md:self-end">
        {/* Mobile avatar */}
        <img
          src={currentUser?.image.png}
          alt="avatar"
          className="h-8 w-8 rounded-full md:hidden"
        />
        {onCancel && (
          <button
            className="rounded-md bg-Grey-100 px-4 py-2 font-semibold text-Grey-800"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          className="ml-auto rounded-md bg-Purple-600 px-4 py-2 font-semibold text-white md:ml-0"
          onClick={() => {
            const t = text.trim();
            if (t.length === 0) return;
            onSubmit(t);
            setText("");
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default Editor;
