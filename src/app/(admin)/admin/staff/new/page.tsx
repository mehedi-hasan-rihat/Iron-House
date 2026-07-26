import { requireAdmin } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import StaffForm from "@/components/admin/StaffForm";

export default async function NewStaffPage() {
  await requireAdmin();
  const roles = await prisma.role.findMany({
    where: { name: { not: "member" } },
    orderBy: { name: "asc" },
  });
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">Add Staff</h1>
        <p className="label text-[#bdbdbd] mt-1">Create a new staff account</p>
      </div>
      <StaffForm roles={roles} />
    </div>
  );
}
