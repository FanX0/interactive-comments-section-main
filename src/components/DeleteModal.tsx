type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteModal = ({ onConfirm, onCancel }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-sm rounded-lg bg-White p-6 shadow-lg">
        <h2 className="text-lg font-bold text-Grey-800">Delete comment</h2>
        <p className="mt-3 text-Grey-500">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            className="flex-1 rounded-md bg-Grey-500 px-4 py-2 font-semibold text-white"
            onClick={onCancel}
          >
            NO, CANCEL
          </button>
          <button
            className="flex-1 rounded-md bg-Pink-400 px-4 py-2 font-semibold text-white"
            onClick={onConfirm}
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
