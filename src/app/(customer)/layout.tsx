import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CustomerShell from "@/components/customer/CustomerShell";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "member") redirect("/admin/dashboard");

  return <CustomerShell session={session}>{children}</CustomerShell>;
}
