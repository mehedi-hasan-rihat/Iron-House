"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const ACC = "#BFE01D";
const inputCls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors resize-none";

type Comment = {
  id:        string;
  comment:   string;
  createdBy: string | null;
  createdAt: string;
};

export default function MembershipComments({
  membershipId,
  initialComments,
  canEdit = false,
}: {
  membershipId:     string;
  initialComments:  Comment[];
  canEdit?:         boolean;
}) {
  const router  = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text,     setText]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setError("");

    const res = await fetch(`/api/memberships/${membershipId}/comments`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ comment: text.trim() }),
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Failed to add comment.");
      return;
    }

    const created: Comment = await res.json();
    setComments((prev) => [created, ...prev]);
    setText("");
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/memberships/${membershipId}/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="space-y-4">
      {/* Add comment — only for users with memberships:edit */}
      {canEdit && (
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); }}
          rows={3}
          placeholder="Add a staff comment…"
          className={inputCls}
        />
        <div className="flex items-center justify-between">
          {error ? <p className="text-red-400 text-[10px]">{error}</p> : <span />}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 disabled:opacity-40 hover:opacity-85 transition-opacity"
            style={{ backgroundColor: ACC }}
          >
            {loading ? "…" : "Add Comment"}
          </button>
        </div>
      </form>
      )}

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-[#9aa87a] text-xs">No comments yet.</p>
      ) : (
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c.id}
              className="flex items-start justify-between gap-3 py-3 border-b border-[#BFE01D]/15 last:border-0">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-[#f2f4e8] text-sm wrap-break-word">{c.comment}</p>
                <p className="text-[#9aa87a] text-[10px] uppercase tracking-[0.15em]">
                  {c.createdBy ?? "staff"} · {new Date(c.createdAt).toLocaleString("en-BD", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              {canEdit && (
              <button
                onClick={() => handleDelete(c.id)}
                className="text-[#9aa87a] hover:text-red-400 transition-colors shrink-0 mt-0.5"
                title="Delete comment"
              >
                <Trash2 size={13} />
              </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
