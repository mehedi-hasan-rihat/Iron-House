import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import PaymentForm from "@/components/admin/PaymentForm";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string; membershipId?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;

  const members = await prisma.member.findMany({
    where:   { status: "ACTIVE" },
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">Record Payment</h1>
        <p className="label text-[#bdbdbd] mt-1">Manually record a payment</p>
      </div>
      <PaymentForm
        members={members}
        defaultMemberId={sp.memberId ?? ""}
        defaultMembershipId={sp.membershipId ?? ""}
      />
    </div>
  );
}
