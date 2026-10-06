"use client";
import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const DEBOUNCE_MS = 400;

export default function MembersFilters({
  defaultSearch = "",
  defaultStatus = "",
}: {
  defaultSearch?: string;
  defaultStatus?: string;
}) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(defaultSearch);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function navigate(newSearch: string, newStatus: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (newSearch) p.set("search", newSearch); else p.delete("search");
    if (newStatus) p.set("status", newStatus); else p.delete("status");
    p.set("page", "1");
    router.push(`${pathname}?${p.toString()}`);
  }

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setSearch(q);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate(q, searchParams.get("status") ?? ""), DEBOUNCE_MS);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (timer.current) clearTimeout(timer.current);
      navigate(search, searchParams.get("status") ?? "");
    }
  }

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(search, e.target.value);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa87a]" />
        <input
          name="search"
          value={search}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          placeholder="Name, phone, ID…"
          className="panel border border-[#BFE01D]/15 text-[#f2f4e8] text-xs pl-8 pr-4 py-2.5 outline-none focus:border-[#BFE01D] w-56 transition-colors"
        />
      </div>

      {/* Status */}
      <select
        value={defaultStatus}
        onChange={onStatusChange}
        className="panel border border-[#BFE01D]/15 text-[#9aa87a] text-xs px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="SUSPENDED">Suspended</option>
        <option value="FROZEN">Frozen</option>
      </select>
    </div>
  );
}
