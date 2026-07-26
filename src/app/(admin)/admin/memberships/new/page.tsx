import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import MembershipForm from "@/components/admin/MembershipForm";

export default async function NewMembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;

  const [members, plans, trainers] = await Promise.all([
    prisma.member.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
    prisma.membershipPlan.findMany({ where: { isActive: true }, orderBy: { price: "asc" } }),
    prisma.staff.findMany({
      where:   { status: "ACTIVE", user: { role: { name: "trainer" } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">New Membership</h1>
        <p className="label text-[#bdbdbd] mt-1">Assign a plan to a member</p>
      </div>
      <MembershipForm
        members={members}
        plans={plans}
        trainers={trainers}
        defaultMemberId={sp.memberId ?? ""}
      />
    </div>
  );
}
