import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function ProfilePage() {
  const session = await requireStaff();

  const staff = await prisma.staff.findUnique({
    where:   { userId: session.user.id },
    include: { user: { include: { role: true } } },
  });
  if (!staff) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Profile</h1>
        <p className="label text-[#9aa87a] mt-1">{staff.staffId} · {staff.name}</p>
      </div>

      <ProfileForm
        staffId={staff.staffId}
        name={staff.name}
        email={staff.user.email}
        phone={staff.phone}
        address={staff.address ?? ""}
        designation={staff.designation}
        role={staff.user.role.name}
        joined={new Date(staff.joiningDate).toLocaleDateString("en-BD", {
          day: "numeric", month: "long", year: "numeric",
        })}
        salary={staff.salary ? `৳${Number(staff.salary).toLocaleString()}` : "—"}
        status={staff.status}
      />
    </div>
  );
}
