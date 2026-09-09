import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { UserPlus, Search } from "lucide-react";
import MembersTable from "@/components/admin/MembersTable";

const ACC = "#BFE01D";

type SortKey = "memberId" | "fullName" | "createdAt" | "status";
const VALID_SORT: SortKey[] = ["memberId", "fullName", "createdAt", "status"];

async function getMembers(
  search: string,
  status: string,
  page: number,
  sort: SortKey,
  dir: "asc" | "desc",
) {
  const limit = 20;
  const skip  = (page - 1) * limit;

  const where = {
    ...(status ? { status: status as "ACTIVE" | "SUSPENDED" | "FROZEN" } : {}),
    ...(search ? {
      OR: [
        { fullName: { contains: search, mode: "insensitive" as const } },
        { phone:    { contains: search } },
        { memberId: { contains: search, mode: "insensitive" as const } },
      ],
    } : {}),
  };

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { [sort]: dir },
      include: {
        memberships: {
          where:   { status: "ACTIVE" },
          include: { plan: true },
          take:    1,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.member.count({ where }),
  ]);

  return { members, total, pages: Math.ceil(total / limit) };
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string; sort?: string; dir?: string }>;
}) {
  await requireStaff();
  const sp     = await searchParams;
  const search = sp.search ?? "";
  const status = sp.status ?? "";
  const page   = Math.max(1, Number(sp.page ?? 1));
  const sort   = (VALID_SORT.includes(sp.sort as SortKey) ? sp.sort : "createdAt") as SortKey;
  const dir    = sp.dir === "asc" ? "asc" : "desc";

  const { members, total, pages } = await getMembers(search, status, page, sort, dir);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Members</h1>
          <p className="label text-[#9aa87a] mt-1">{total} total</p>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 transition-opacity hover:opacity-85"
          style={{ backgroundColor: ACC }}
        >
          <UserPlus size={14} />
          Add Member
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa87a]" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Name, phone, ID…"
            className="panel border border-[#BFE01D]/15 text-[#f2f4e8] text-xs pl-8 pr-4 py-2.5 outline-none focus:border-[#BFE01D] w-56 transition-colors"
          />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="panel border border-[#BFE01D]/15 text-[#9aa87a] text-xs px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="FROZEN">Frozen</option>
        </select>
        {/* Preserve current sort when filter is submitted */}
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir"  value={dir}  />
        <button
          type="submit"
          className="border border-[#BFE01D]/15 text-[#9aa87a] hover:text-[#f2f4e8] hover:border-[#BFE01D]/50 text-xs uppercase tracking-[0.2em] px-4 py-2.5 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <MembersTable members={members} sort={sort} dir={dir} />

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?search=${search}&status=${status}&sort=${sort}&dir=${dir}&page=${p}`}
              className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors
                ${p === page
                  ? "border-[#BFE01D] text-black font-bold"
                  : "border-[#BFE01D]/15 text-[#9aa87a] hover:border-[#BFE01D]/50 hover:text-[#f2f4e8]"
                }`}
              style={p === page ? { backgroundColor: ACC } : {}}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
