import { Fragment, useEffect, useState } from "react";
import type { Comment, CommentsData, User } from "@/shared/types/Comments";
import { getUserAvatar } from "@/shared/avatars";
import CommentCard from "@/components/CommentCard";
import Editor from "@/components/Editor";
import DeleteModal from "@/components/DeleteModal";
import {
  getMentionUser,
  removeLeadingMention,
  sortByScoreDesc,
  sortRepliesByScoreDesc,
  nextId,
} from "@/shared/commentsUtils";

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{
    parentId: number;
    targetId: number;
    replyingTo: string;
  } | null>(null);
  const [editTarget, setEditTarget] = useState<{
    parentId?: number;
    id: number;
    content: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    parentId?: number;
    id: number;
  } | null>(null);

  // helpers imported from shared/commentsUtils

  const updateCommentScore = (id: number, score: number) =>
    setComments((prev) =>
      sortByScoreDesc(prev.map((cm) => (cm.id === id ? { ...cm, score } : cm)))
    );

  const updateReplyScore = (parentId: number, id: number, score: number) =>
    setComments((prev) =>
      prev.map((cm) =>
        cm.id === parentId
          ? {
              ...cm,
              replies: sortRepliesByScoreDesc(
                cm.replies.map((rp) => (rp.id === id ? { ...rp, score } : rp))
              ),
            }
          : cm
      )
    );

  const addReply = (
    parentId: number,
    defaultReplyingTo: string,
    rawText: string
  ) => {
    const dynamicReplyingTo = getMentionUser(rawText) ?? defaultReplyingTo;
    const cleanContent = removeLeadingMention(rawText);
    setComments((prev) =>
      prev.map((cm) =>
        cm.id === parentId
          ? {
              ...cm,
              replies: sortRepliesByScoreDesc([
                ...cm.replies,
                {
                  id: nextId(prev),
                  content: cleanContent,
                  createdAt: nowString(),
                  score: 0,
                  replyingTo: dynamicReplyingTo,
                  user: currentUser!,
                },
              ]),
            }
          : cm
      )
    );
  };

  const updateCommentContent = (id: number, content: string) =>
    setComments((prev) =>
      prev.map((cm) => (cm.id === id ? { ...cm, content } : cm))
    );

  const updateReplyContent = (parentId: number, id: number, rawText: string) =>
    setComments((prev) =>
      prev.map((cm) =>
        cm.id === parentId
          ? {
              ...cm,
              replies: cm.replies.map((rp) =>
                rp.id === id
                  ? {
                      ...rp,
                      content: removeLeadingMention(rawText),
                      replyingTo: getMentionUser(rawText) ?? rp.replyingTo,
                    }
                  : rp
              ),
            }
          : cm
      )
    );

  const deleteCommentById = (id: number) =>
    setComments((prev) => prev.filter((cm) => cm.id !== id));
  const deleteReplyById = (parentId: number, id: number) =>
    setComments((prev) =>
      prev.map((cm) =>
        cm.id === parentId
          ? { ...cm, replies: cm.replies.filter((rp) => rp.id !== id) }
          : cm
      )
    );

  // mention helpers imported from shared/commentsUtils

  // Helper to stamp new comments/replies with the current local time
  const nowString = () => new Date().toLocaleString();

  useEffect(() => {
    const load = async () => {
      try {
        // Try localStorage first for either user or comments
        const savedUser = localStorage.getItem("currentUser");
        const savedCommentsRaw = localStorage.getItem("comments");

        const normalizeUser = (user: User): User => ({
          image: getUserAvatar(user.username),
          username: user.username,
        });

        const savedCommentsParsed: Comment[] | null = savedCommentsRaw
          ? JSON.parse(savedCommentsRaw)
          : null;
        const hasSavedComments = !!(
          savedCommentsParsed && savedCommentsParsed.length > 0
        );

        if (savedUser || hasSavedComments) {
          // Ensure currentUser is set
          if (savedUser) {
            const u: User = JSON.parse(savedUser);
            setCurrentUser(normalizeUser(u));
          } else {
            const resUser = await fetch("/data.json");
            const dataUser: CommentsData = await resUser.json();
            setCurrentUser(normalizeUser(dataUser.currentUser));
          }

          // Ensure comments are set
          if (hasSavedComments) {
            const normalized = savedCommentsParsed!.map((c) => ({
              ...c,
              user: normalizeUser(c.user),
              replies: (c.replies ?? []).map((r) => ({
                ...r,
                user: normalizeUser(r.user),
              })),
            }));
            setComments(sortByScoreDesc(normalized));
          } else {
            const resComments = await fetch("/data.json");
            const dataComments: CommentsData = await resComments.json();
            const normalizedComments = dataComments.comments.map((c) => ({
              ...c,
              user: normalizeUser(c.user),
              replies: (c.replies ?? []).map((r) => ({
                ...r,
                user: normalizeUser(r.user),
              })),
            }));
            setComments(sortByScoreDesc(normalizedComments));
          }

          setLoading(false);
          return;
        }

        // No saved data at all, load both from data.json
        const res = await fetch("/data.json");
        const data: CommentsData = await res.json();

        setCurrentUser(normalizeUser(data.currentUser));
        const normalizedComments = data.comments.map((c) => ({
          ...c,
          user: normalizeUser(c.user),
          replies: (c.replies ?? []).map((r) => ({
            ...r,
            user: normalizeUser(r.user),
          })),
        }));
        setComments(sortByScoreDesc(normalizedComments));
      } catch (e) {
        setError("Failed to load comments data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Persist current user when set (skip while initial loading)
  useEffect(() => {
    if (!loading && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [loading, currentUser]);

  // Persist comments after any change (skip empty state and initial loading)
  useEffect(() => {
    if (!loading && comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [loading, comments]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-dvh bg-Grey-50 p-4 md:p-6">
      <div className="mx-auto max-w-3xl flex flex-col gap-[1.5rem]">
        {comments.map((c) => (
          <Fragment key={c.id}>
            <CommentCard
              entry={c}
              currentUser={currentUser}
              onScoreChange={(id, next) => updateCommentScore(id, next)}
              onReplyClick={(entry) => {
                setReplyTarget({
                  parentId: c.id,
                  targetId: entry.id,
                  replyingTo: entry.user.username,
                });
              }}
              onEditClick={(entry) => {
                setEditTarget({ id: entry.id, content: c.content });
              }}
              onDeleteClick={(entry) => {
                setDeleteTarget({ id: entry.id });
              }}
            />
            {editTarget && editTarget.id === c.id && (
              <div className="ml-6">
                <Editor
                  currentUser={currentUser}
                  submitLabel="UPDATE"
                  initialText={editTarget.content}
                  autoFocus
                  onSubmit={(text) => {
                    updateCommentContent(c.id, text);
                    setEditTarget(null);
                  }}
                  onCancel={() => setEditTarget(null)}
                />
              </div>
            )}
            {replyTarget && replyTarget.targetId === c.id && (
              <div className="ml-6">
                <Editor
                  currentUser={currentUser}
                  submitLabel="REPLY"
                  autoFocus
                  initialText={`@${replyTarget.replyingTo} `}
                  onSubmit={(text) => {
                    addReply(c.id, replyTarget.replyingTo, text);
                    setReplyTarget(null);
                  }}
                  onCancel={() => setReplyTarget(null)}
                />
              </div>
            )}
            {c.replies.length > 0 && (
              <div className="ml-6 border-l-4 border-Grey-100 pl-6 flex flex-col gap-[1.5rem]">
                {c.replies.map((r) => (
                  <div key={r.id} className="">
                    <CommentCard
                      entry={r}
                      currentUser={currentUser}
                      onScoreChange={(id, next) =>
                        updateReplyScore(c.id, id, next)
                      }
                      onReplyClick={(entry) => {
                        setReplyTarget({
                          parentId: c.id,
                          targetId: entry.id,
                          replyingTo: entry.user.username,
                        });
                      }}
                      onEditClick={(entry) => {
                        setEditTarget({
                          parentId: c.id,
                          id: entry.id,
                          content: r.content,
                        });
                      }}
                      onDeleteClick={(entry) => {
                        setDeleteTarget({ parentId: c.id, id: entry.id });
                      }}
                    />
                    {editTarget && editTarget.id === r.id && (
                      <div className="mt-3">
                        <Editor
                          currentUser={currentUser}
                          submitLabel="UPDATE"
                          initialText={`@${r.replyingTo} ${r.content}`}
                          autoFocus
                          onSubmit={(text) => {
                            updateReplyContent(c.id, r.id, text);
                            setEditTarget(null);
                          }}
                          onCancel={() => setEditTarget(null)}
                        />
                      </div>
                    )}
                    {replyTarget && replyTarget.targetId === r.id && (
                      <div className="mt-3">
                        <Editor
                          currentUser={currentUser}
                          submitLabel="REPLY"
                          autoFocus
                          initialText={`@${replyTarget.replyingTo} `}
                          onSubmit={(text) => {
                            addReply(c.id, replyTarget.replyingTo, text);
                            setReplyTarget(null);
                          }}
                          onCancel={() => setReplyTarget(null)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Fragment>
        ))}

        {/* New comment */}
        <div className="mt-4">
          <Editor
            currentUser={currentUser}
            submitLabel="SEND"
            placeholder="Add a comment…"
            onSubmit={(text) => {
              const newComment: Comment = {
                id: nextId(comments),
                content: text,
                createdAt: nowString(),
                score: 0,
                user: currentUser!,
                replies: [],
              };
              setComments((prev) => sortByScoreDesc([...prev, newComment]));
            }}
          />
        </div>

        {deleteTarget && (
          <DeleteModal
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => {
              if (!deleteTarget) return;
              const { parentId, id } = deleteTarget;
              if (parentId == null) deleteCommentById(id);
              else deleteReplyById(parentId, id);
              setDeleteTarget(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
export default App;
