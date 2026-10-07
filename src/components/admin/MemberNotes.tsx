"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const ACC = "#BFE01D";

type Note = {
  id:        string;
  note:      string;
  createdBy: string | null;
  createdAt: string;
};

type Props = {
  memberId:     string;
  initialNotes: Note[];
};

export default function MemberNotes({ memberId, initialNotes }: Props) {
  const [notes,   setNotes]   = useState<Note[]>(initialNotes);
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/members/${memberId}/notes`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ note: text.trim() }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to add note.");
      return;
    }

    const created: Note = await res.json();
    setNotes((prev) => [created, ...prev]);
    setText("");
  }

  async function deleteNote(noteId: string) {
    const res = await fetch(`/api/members/${memberId}/notes/${noteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }

  return (
    <div className="space-y-4">

      {/* Add note form */}
      <form onSubmit={addNote} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); }}
          placeholder="Add an internal note…"
          rows={3}
          className="w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors resize-none"
        />
        <div className="flex items-center justify-between">
          {error
            ? <p className="text-red-400 text-[10px]">{error}</p>
            : <span />
          }
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 disabled:opacity-40 transition-opacity hover:opacity-85"
            style={{ backgroundColor: ACC }}
          >
            {loading ? "…" : "Add Note"}
          </button>
        </div>
      </form>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-[#9aa87a] text-xs">No notes yet.</p>
      ) : (
        <div className="space-y-2">
          {notes.map((n) => (
            <div key={n.id}
              className="flex items-start justify-between gap-3 py-3 border-b border-[#BFE01D]/15 last:border-0">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-[#f2f4e8] text-sm wrap-break-word">{n.note}</p>
                <p className="text-[#9aa87a] text-[10px] uppercase tracking-[0.15em]">
                  {n.createdBy ?? "staff"} · {new Date(n.createdAt).toLocaleDateString("en-BD", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteNote(n.id)}
                className="text-[#9aa87a] hover:text-red-400 transition-colors shrink-0 mt-0.5"
                title="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
