import { requireOwner } from "@/lib/auth-guard";
import SettingsForm from "@/components/admin/SettingsForm";
import DangerZone from "@/components/admin/DangerZone";

export default async function SettingsPage() {
  await requireOwner();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">Settings</h1>
        <p className="label text-[#bdbdbd] mt-1">System configuration</p>
      </div>

      {/* Gym Info — interactive form (client component) */}
      <SettingsForm />

      {/* System Info — static, no interactivity needed */}
      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-6 space-y-3">
        <h2 className="label text-[#bdbdbd]">System</h2>
        {[
          { label: "Framework",  value: "Next.js 16 (App Router)" },
          { label: "Database",   value: "PostgreSQL + Prisma v7"  },
          { label: "Auth",       value: "NextAuth v5 (JWT)"       },
          { label: "Version",    value: "1.0.0"                   },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2 border-b border-[#1a1a1a] last:border-0">
            <span className="text-[#bdbdbd] text-xs uppercase tracking-[0.15em]">{label}</span>
            <span className="text-white text-xs">{value}</span>
          </div>
        ))}
      </div>

      {/* Danger zone — interactive (client component) */}
      <DangerZone />
    </div>
  );
}
