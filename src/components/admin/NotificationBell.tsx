"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const ACC = "#BFE01D";

export default function NotificationBell() {
  const [count, setCount]   = useState(0);
  const [open,  setOpen]    = useState(false);
  const [items, setItems]   = useState<{ id: string; message: string; createdAt: string; isRead: boolean }[]>([]);

  async function fetchNotifs() {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const d = await res.json();
    setCount(d.unreadCount);
    setItems(d.notifications);
  }

  useEffect(() => { fetchNotifs(); }, []);

  async function markRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setCount(0);
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && count > 0) markRead(); }}
        className="relative p-2 text-[#bdbdbd] hover:text-white transition-colors"
      >
        <Bell size={18} />
        {count > 0 && (
          <span
            className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-black"
            style={{ backgroundColor: ACC }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-80 bg-[#111] border border-[#1a1a1a] shadow-2xl max-h-80 overflow-y-auto">
            <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
              <span className="label text-[#bdbdbd]">Notifications</span>
              {items.length > 0 && (
                <button onClick={markRead} className="text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors"
                  style={{ color: ACC }}>
                  Mark all read
                </button>
              )}
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-[#bdbdbd] text-xs">No notifications.</p>
            ) : (
              items.map((n) => (
                <div key={n.id} className={`px-4 py-3 border-b border-[#1a1a1a] last:border-0 ${!n.isRead ? "bg-[#BFE01D]/5" : ""}`}>
                  <p className="text-white text-xs leading-relaxed">{n.message}</p>
                  <p className="label text-[#bdbdbd] mt-1">
                    {new Date(n.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
