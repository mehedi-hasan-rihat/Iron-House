import { requireAdmin } from "@/lib/auth-guard";
import { DEFAULT_PERMISSIONS, type PermissionKey } from "@/lib/permissions";
import Stagger from "@/components/motion/Stagger";

const ACC = "#BFE01D";

// Derive modules and actions from the actual matrix — no hardcoded lists
const allKeys = Object.values(DEFAULT_PERMISSIONS).flat();
const MODULES = [...new Set(allKeys.map((k) => k.split(":")[0]))];
const ACTIONS = [...new Set(allKeys.map((k) => k.split(":")[1]))];

const STAFF_ROLES = ["owner", "manager", "receptionist", "trainer", "accountant"] as const;

export default async function RolesPage() {
  // requireAdmin guards this page — only Admins can view the permission matrix
  await requireAdmin();

  // Build a set per role from in-memory DEFAULT_PERMISSIONS — no DB call needed
  const rolePerms: Record<string, Set<PermissionKey>> = {};
  for (const role of STAFF_ROLES) {
    rolePerms[role] = new Set(DEFAULT_PERMISSIONS[role] ?? []);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#f2f4e8] uppercase tracking-wide">Roles & Permissions</h1>
        <p className="label text-[#9aa87a] mt-1">Read-only view — edit defaults in src/lib/permissions.ts</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {STAFF_ROLES.map((role) => (
          <div key={role} className="border border-[#BFE01D]/15 panel p-4">
            <p className="label capitalize" style={{ color: ACC }}>{role}</p>
            <p className="font-display text-3xl text-[#f2f4e8] mt-2">{rolePerms[role].size}</p>
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
              {STAFF_ROLES.map((role) => (
                <th key={role} className="px-4 py-3 label text-center capitalize" style={{ color: ACC }}>{role}</th>
              ))}
            </tr>
          </thead>
          <Stagger as="tbody" selector="tr" className="divide-y divide-[#BFE01D]/15" stagger={0.035} y={12} blur={false}>
            {MODULES.map((mod) =>
              ACTIONS.map((act, ai) => {
                const key = `${mod}:${act}` as PermissionKey;
                const anyRole = STAFF_ROLES.some((r) => rolePerms[r].has(key));
                if (!anyRole) return null;
                return (
                  <tr key={key} className={`${ai === 0 ? "bg-[#0d0f08]/60" : "bg-[#050505]"} hover:bg-[#121509] transition-colors`}>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {ai === 0 && <span className="label text-[#f2f4e8] uppercase">{mod}</span>}
                      <span className="ml-2 text-[#9aa87a] capitalize">{act}</span>
                    </td>
                    {STAFF_ROLES.map((role) => (
                      <td key={role} className="px-4 py-2.5 text-center">
                        {rolePerms[role].has(key)
                          ? <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: ACC }} />
                          : <span className="inline-block w-4 h-4 rounded-full bg-[#BFE01D]/6" />
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </Stagger>
        </table>
      </div>
    </div>
  );
}
