import Score from "@/components/Score";
import replyIcon from "@/assets/icon-reply.svg";
import deleteIcon from "@/assets/icon-delete.svg";
import editIcon from "@/assets/icon-edit.svg";
import type { Comment, Reply, User } from "@/shared/types/Comments";

type Base = Comment | Reply;

type Props = {
  entry: Base;
  currentUser: User | null;
  onScoreChange: (id: number, next: number) => void;
  onReplyClick?: (entry: Base) => void;
  onEditClick?: (entry: Base) => void;
  onDeleteClick?: (entry: Base) => void;
};

const CommentCard = ({
  entry,
  currentUser,
  onScoreChange,
  onReplyClick,
  onEditClick,
  onDeleteClick,
}: Props) => {
  const isYou = currentUser?.username === entry.user.username;

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg bg-White p-4 shadow-sm md:grid-cols-[auto_1fr_auto] md:gap-6">
      <div className="hidden md:block md:row-span-2">
        <Score
          value={entry.score}
          onChange={(next) => onScoreChange(entry.id, next)}
        />
      </div>
      <header className="flex items-center gap-3">
        <img
          src={entry.user.image.png}
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-Grey-800">
            {entry.user.username}
          </span>
          {isYou && (
            <span className="rounded-sm bg-Purple-600 px-1.5 py-0.5 text-xs font-bold text-white">
              you
            </span>
          )}
        </div>
        <span className="ml-auto text-sm text-Grey-500">{entry.createdAt}</span>
      </header>

      <div className="text-Grey-500 leading-relaxed md:col-span-1">
        {"replyingTo" in entry ? (
          <span className="font-semibold text-Purple-600">
            @{entry.replyingTo}{" "}
          </span>
        ) : null}
        {entry.content}
      </div>

      <div className="flex items-center justify-between md:col-start-3 md:row-start-1">
        <div className="md:hidden">
          <Score
            value={entry.score}
            onChange={(next) => onScoreChange(entry.id, next)}
          />
        </div>
        <div className="flex items-center gap-4 ml-auto">
          {!isYou && (
            <button
              className="flex items-center gap-2 text-Purple-600 font-semibold"
              onClick={() => onReplyClick?.(entry)}
            >
              <img src={replyIcon} alt="reply" className="h-4 w-4" />
              Reply
            </button>
          )}
          {isYou && (
            <>
              <button
                className="flex items-center gap-2 text-Pink-400 font-semibold"
                onClick={() => onDeleteClick?.(entry)}
              >
                <img src={deleteIcon} alt="delete" className="h-4 w-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 text-Purple-600 font-semibold"
                onClick={() => onEditClick?.(entry)}
              >
                <img src={editIcon} alt="edit" className="h-4 w-4" />
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
