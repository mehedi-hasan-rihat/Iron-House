import { requireOwner } from "@/lib/auth-guard";
import SettingsForm from "@/components/admin/SettingsForm";
import DangerZone from "@/components/admin/DangerZone";

export default async function SettingsPage() {
  await requireOwner();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Settings</h1>
        <p className="label text-[#9aa87a] mt-1">System configuration</p>
      </div>

      {/* Gym Info — interactive form (client component) */}
      <SettingsForm />

      {/* Danger zone — interactive (client component) */}
      <DangerZone />
    </div>
  );
}
