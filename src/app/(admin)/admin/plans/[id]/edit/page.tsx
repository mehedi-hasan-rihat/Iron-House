import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import PlanForm from "@/components/admin/PlanForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const plan = await prisma.membershipPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/admin/plans"
        className="inline-flex items-center gap-2 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors">
        <ArrowLeft size={13} /> Plans
      </Link>
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Edit Plan</h1>
        <p className="label text-[#9aa87a] mt-1">{plan.name}</p>
      </div>
      <PlanForm
        mode="edit"
        defaultValues={{
          id:           plan.id,
          name:         plan.name,
          description:  plan.description  ?? "",
          durationDays: plan.durationDays,
          price:        Number(plan.price),
          type:         plan.type,
          isActive:     plan.isActive,
          trialEnabled: plan.trialEnabled,
          autoRenewal:  plan.autoRenewal,
          features:     plan.features as Record<string, boolean>,
        }}
      />
    </div>
  );
}
