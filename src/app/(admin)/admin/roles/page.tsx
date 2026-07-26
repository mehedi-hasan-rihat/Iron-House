import { requireOwner } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { DEFAULT_PERMISSIONS } from "@/lib/permissions";

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
        <h1 className="font-display text-3xl text-white uppercase tracking-wide">Roles & Permissions</h1>
        <p className="label text-[#bdbdbd] mt-1">Read-only view — edit defaults in src/lib/permissions.ts</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {staffRoles.map((r) => (
          <div key={r.id} className="border border-[#1a1a1a] bg-[#0b0b0b] p-4">
            <p className="label" style={{ color: ACC }}>{r.name}</p>
            <p className="font-display text-3xl text-white mt-2">{r.permissions.length}</p>
            <p className="label text-[#bdbdbd] mt-1">permissions</p>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="overflow-x-auto border border-[#1a1a1a]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1a1a1a] bg-[#0b0b0b]">
              <th className="text-left px-4 py-3 label text-[#bdbdbd] w-32">Module · Action</th>
              {staffRoles.map((r) => (
                <th key={r.id} className="px-4 py-3 label text-center" style={{ color: ACC }}>{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {MODULES.map((mod) => (
              ACTIONS.map((act, ai) => {
                const key = `${mod}:${act}`;
                const anyRole = staffRoles.some((r) => rolePerms[r.name]?.has(key));
                if (!anyRole) return null;
                return (
                  <tr key={key} className={`${ai === 0 ? "bg-[#0b0b0b]/60" : "bg-[#050505]"} hover:bg-[#0b0b0b] transition-colors`}>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {ai === 0 && <span className="label text-white uppercase">{mod}</span>}
                      <span className="ml-2 text-[#bdbdbd] capitalize">{act}</span>
                    </td>
                    {staffRoles.map((r) => (
                      <td key={r.id} className="px-4 py-2.5 text-center">
                        {rolePerms[r.name]?.has(key)
                          ? <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: ACC }} />
                          : <span className="inline-block w-4 h-4 rounded-full bg-white/5" />
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>

      {/* Default permission reference */}
      <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-5">
        <p className="label text-[#bdbdbd] mb-3">Default permission source</p>
        <p className="text-[#bdbdbd] text-xs font-mono">src/lib/permissions.ts → DEFAULT_PERMISSIONS</p>
        <p className="text-[#bdbdbd] text-xs mt-2">
          To change permissions: edit the file, then run <code className="text-[#BFE01D]">npm run db:seed</code> to re-apply.
        </p>
      </div>
    </div>
  );
}
