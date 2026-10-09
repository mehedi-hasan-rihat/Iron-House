import { requireStaff } from "@/lib/auth-guard";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaff();

  return (
    <AdminShell session={session} permissions={session.user.permissions}>
      {children}
    </AdminShell>
  );
}
