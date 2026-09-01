import { requireOwner } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { DEFAULT_PERMISSIONS } from "@/lib/permissions";
import Stagger from "@/components/motion/Stagger";

const ACC = "#BFE01D";
const MODULES = ["dashboard","members","plans","memberships","payments","staff","roles","reports","settings"];
const ACTIONS = ["view","create","edit","delete","export","refund"];

export default async function RolesPage() {
  await requireOwner();

  const roles = await prisma.role.findMany({
    include: { permissions: { include: { permission: true } } },
    orderBy: { name: "asc" },
  });

  // build a set per role: "module:action"
  const rolePerms: Record<string, Set<string>> = {};
  for (const role of roles) {
    rolePerms[role.name] = new Set(
      role.permissions.map((rp) => `${rp.permission.module}:${rp.permission.action}`)
    );
  }

  const staffRoles = roles.filter((r) => r.name !== "member");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Roles & Permissions</h1>
        <p className="label text-[#9aa87a] mt-1">Read-only view — edit defaults in src/lib/permissions.ts</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {staffRoles.map((r) => (
          <div key={r.id} className="border border-[#BFE01D]/15 panel p-4">
            <p className="label" style={{ color: ACC }}>{r.name}</p>
            <p className="font-display text-3xl text-[#f2f4e8] mt-2">{r.permissions.length}</p>
            <p className="label text-[#9aa87a] mt-1">permissions</p>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="overflow-x-auto border border-[#BFE01D]/15">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#BFE01D]/15 panel">
              <th className="text-left px-4 py-3 label text-[#9aa87a] w-32">Module · Action</th>
              {staffRoles.map((r) => (
                <th key={r.id} className="px-4 py-3 label text-center" style={{ color: ACC }}>{r.name}</th>
              ))}
            </tr>
          </thead>
          <Stagger as="tbody" selector="tr" className="divide-y divide-[#BFE01D]/15"
          stagger={0.035} y={12} blur={false}>
            {MODULES.map((mod) => (
              ACTIONS.map((act, ai) => {
                const key = `${mod}:${act}`;
                const anyRole = staffRoles.some((r) => rolePerms[r.name]?.has(key));
                if (!anyRole) return null;
                return (
                  <tr key={key} className={`${ai === 0 ? "bg-[#0d0f08]/60" : "bg-[#050505]"} hover:bg-[#121509] transition-colors`}>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {ai === 0 && <span className="label text-[#f2f4e8] uppercase">{mod}</span>}
                      <span className="ml-2 text-[#9aa87a] capitalize">{act}</span>
                    </td>
                    {staffRoles.map((r) => (
                      <td key={r.id} className="px-4 py-2.5 text-center">
                        {rolePerms[r.name]?.has(key)
                          ? <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: ACC }} />
                          : <span className="inline-block w-4 h-4 rounded-full bg-[#BFE01D]/[0.06]" />
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            ))}
          </Stagger>
        </table>
      </div>

      {/* Default permission reference */}
      <div className="border border-[#BFE01D]/15 panel p-5">
        <p className="label text-[#9aa87a] mb-3">Default permission source</p>
        <p className="text-[#9aa87a] text-xs font-mono">src/lib/permissions.ts → DEFAULT_PERMISSIONS</p>
        <p className="text-[#9aa87a] text-xs mt-2">
          To change permissions: edit the file, then run <code className="text-[#BFE01D]">npm run db:seed</code> to re-apply.
        </p>
      </div>
    </div>
  );
}
