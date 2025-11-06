import { useCallback } from "react";

type Props = {
  value: number;
  onChange: (next: number) => void;
};

const Score = ({ value, onChange }: Props) => {
  const inc = useCallback(() => onChange(value + 1), [value, onChange]);
  const dec = useCallback(
    () => onChange(Math.max(0, value - 1)),
    [value, onChange]
  );

  return (
    <div className="flex items-center gap-3 rounded-md bg-Grey-50 px-3 py-2 text-Purple-600 md:flex-col md:gap-2 md:px-2 md:py-3">
      <button aria-label="Upvote" className="font-bold" onClick={inc}>
        +
      </button>
      <span className="text-Purple-600 font-semibold">{value}</span>
      <button aria-label="Downvote" className="font-bold" onClick={dec}>
        −
      </button>
    </div>
  );
};

export default Score;
