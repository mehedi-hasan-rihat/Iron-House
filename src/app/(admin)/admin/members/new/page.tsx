import { requireStaff } from "@/lib/auth-guard";
import MemberForm from "@/components/admin/MemberForm";

export default async function NewMemberPage() {
  await requireStaff();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">Add Member</h1>
        <p className="label text-[#bdbdbd] mt-1">Create a new gym member account</p>
      </div>
      <MemberForm />
    </div>
  );
}
