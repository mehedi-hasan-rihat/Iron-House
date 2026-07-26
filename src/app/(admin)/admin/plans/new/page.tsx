import { requireStaff } from "@/lib/auth-guard";
import PlanForm from "@/components/admin/PlanForm";

export default async function NewPlanPage() {
  await requireStaff();
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">New Plan</h1>
        <p className="label text-[#bdbdbd] mt-1">Create a membership plan</p>
      </div>
      <PlanForm />
    </div>
  );
}
