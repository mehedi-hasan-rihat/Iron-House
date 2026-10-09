import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import DeletePlanButton from "@/components/admin/DeletePlanButton";
import { PLAN_TYPE_LABELS } from "@/lib/plan-types";

export default async function PlansPage() {
  const session = await auth();
  const perms   = session!.user.permissions ?? [];
  const canCreate = perms.includes("plans:create");
  const canEdit   = perms.includes("plans:edit");
  const canDelete = perms.includes("plans:delete");

  const plans = await prisma.membershipPlan.findMany({
    orderBy: [{ isActive: "desc" }, { price: "asc" }],
    include: { _count: { select: { memberships: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Membership Plans</h1>
          <p className="label text-[#9aa87a] mt-1">{plans.length} plans</p>
        </div>
        {canCreate && (
          <Link href="/admin/plans/new"
            className="inline-flex items-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "#BFE01D" }}>
            <Plus size={14} /> New Plan
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className={`border panel p-5 space-y-4 ${p.isActive ? "border-[#BFE01D]/15" : "border-[#BFE01D]/15 opacity-50"}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-[#9aa87a]">{PLAN_TYPE_LABELS[p.type as keyof typeof PLAN_TYPE_LABELS] ?? p.type}</p>
                <h3 className="font-display text-xl text-[#f2f4e8] uppercase mt-1">{p.name}</h3>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${p.isActive ? "text-[#BFE01D] bg-[#BFE01D]/10" : "text-[#9aa87a] bg-[#BFE01D]/6"}`}>
                {p.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <span className="font-display text-3xl text-[#f2f4e8]">৳{Number(p.price).toLocaleString()}</span>
              <span className="text-[#9aa87a] text-xs ml-2">/ {p.durationDays} days</span>
            </div>

            {p.description && <p className="text-[#9aa87a] text-xs">{p.description}</p>}

            <div className="flex items-center justify-between pt-2 border-t border-[#BFE01D]/15">
              <span className="label text-[#9aa87a]">{p._count.memberships} memberships</span>
              <div className="flex items-center gap-3">
                {canEdit && (
                  <Link href={`/admin/plans/${p.id}/edit`}
                    className="text-[10px] uppercase tracking-[0.2em] text-[#9aa87a] hover:text-[#f2f4e8] transition-colors">
                    Edit →
                  </Link>
                )}
                {canDelete && (
                  <DeletePlanButton planId={p.id} planName={p.name} membershipCount={p._count.memberships} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
