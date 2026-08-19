import { requireAdmin } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import StaffForm from "@/components/admin/StaffForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const staff = await prisma.staff.findUnique({
    where:   { id },
    include: { user: { include: { role: true } } },
  });
  if (!staff) notFound();

  const roles = await prisma.role.findMany({
    where:   { name: { not: "member" } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/admin/staff"
        className="inline-flex items-center gap-2 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors">
        <ArrowLeft size={13} /> Staff
      </Link>
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Edit Staff</h1>
        <p className="label text-[#9aa87a] mt-1">{staff.staffId} · {staff.name}</p>
      </div>
      <StaffForm
        mode="edit"
        roles={roles}
        defaultValues={{
          id:          staff.id,
          name:        staff.name,
          phone:       staff.phone,
          email:       staff.email       ?? "",
          address:     staff.address     ?? "",
          designation: staff.designation,
          roleName:    staff.user.role.name,
          salary:      staff.salary ? Number(staff.salary) : undefined,
          joiningDate: staff.joiningDate.toISOString().split("T")[0],
        }}
      />
    </div>
  );
}
