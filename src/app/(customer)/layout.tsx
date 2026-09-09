import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CustomerShell from "@/components/customer/CustomerShell";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "member") redirect("/admin/dashboard");

  // Fetch live member status — the session doesn't carry it
  const member = await prisma.member.findUnique({
    where:  { userId: session.user.id },
    select: { status: true },
  });

  if (!member) redirect("/login");

  // SUSPENDED — hard block, show dedicated wall (outside the shell)
  if (member.status === "SUSPENDED") redirect("/suspended");

  return (
    <CustomerShell memberStatus={member.status}>
      {children}
    </CustomerShell>
  );
}
