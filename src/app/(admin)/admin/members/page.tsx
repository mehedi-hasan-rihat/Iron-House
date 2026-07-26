import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { UserPlus, Search } from "lucide-react";
import MembersTable from "@/components/admin/MembersTable";

const ACC = "#BFE01D";

async function getMembers(search: string, status: string, page: number) {
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
      orderBy: { createdAt: "desc" },
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
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  await requireStaff();
  const sp     = await searchParams;
  const search = sp.search ?? "";
  const status = sp.status ?? "";
  const page   = Math.max(1, Number(sp.page ?? 1));

  const { members, total, pages } = await getMembers(search, status, page);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-wide">Members</h1>
          <p className="label text-[#bdbdbd] mt-1">{total} total</p>
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
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdbd]" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Name, phone, ID…"
            className="bg-[#0b0b0b] border border-[#1a1a1a] text-white text-xs pl-8 pr-4 py-2.5 outline-none focus:border-[#BFE01D] w-56 transition-colors"
          />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="bg-[#0b0b0b] border border-[#1a1a1a] text-[#bdbdbd] text-xs px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="FROZEN">Frozen</option>
        </select>
        <button
          type="submit"
          className="border border-[#1a1a1a] text-[#bdbdbd] hover:text-white hover:border-white text-xs uppercase tracking-[0.2em] px-4 py-2.5 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <MembersTable members={members} />

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?search=${search}&status=${status}&page=${p}`}
              className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors
                ${p === page
                  ? "border-[#BFE01D] text-black font-bold"
                  : "border-[#1a1a1a] text-[#bdbdbd] hover:border-white hover:text-white"
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
