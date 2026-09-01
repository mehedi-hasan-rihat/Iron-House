import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import MemberForm from "@/components/admin/MemberForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href={`/admin/members/${id}`}
        className="inline-flex items-center gap-2 text-[#9aa87a] hover:text-[#f2f4e8] text-xs uppercase tracking-[0.2em] transition-colors">
        <ArrowLeft size={13} /> Back to Profile
      </Link>
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Edit Member</h1>
        <p className="label text-[#9aa87a] mt-1">{member.memberId} · {member.fullName}</p>
      </div>
      <MemberForm
        mode="edit"
        defaultValues={{
          id:               member.id,
          fullName:         member.fullName,
          phone:            member.phone,
          email:            member.email          ?? "",
          gender:           member.gender         ?? "",
          dob:              member.dob ? member.dob.toISOString().split("T")[0] : "",
          address:          member.address        ?? "",
          bloodGroup:       member.bloodGroup     ?? "",
          medicalInfo:      member.medicalInfo    ?? "",
          emergencyContact: member.emergencyContact ?? "",
        }}
      />
    </div>
  );
}
