import { requireStaff } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import StaffActions from "@/components/admin/StaffActions";

const ACC = "#BFE01D";
const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "text-[#BFE01D] bg-[#BFE01D]/10",
  ON_LEAVE:  "text-yellow-400 bg-yellow-400/10",
  SUSPENDED: "text-orange-400 bg-orange-400/10",
  RESIGNED:  "text-[#bdbdbd] bg-white/5",
};

export default async function StaffPage() {
  await requireStaff();

  const staffList = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    include: { user: { include: { role: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-wide">Staff</h1>
          <p className="label text-[#bdbdbd] mt-1">{staffList.length} staff members</p>
        </div>
        <Link href="/admin/staff/new"
          className="inline-flex items-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 hover:opacity-85 transition-opacity"
          style={{ backgroundColor: ACC }}>
          <UserPlus size={14} /> Add Staff
        </Link>
      </div>

      <div className="overflow-x-auto border border-[#1a1a1a]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a1a] bg-[#0b0b0b]">
              {["ID", "Name", "Designation", "Role", "Phone", "Joining", "Salary", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 label text-[#bdbdbd] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {staffList.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-[#bdbdbd] text-xs">No staff yet.</td></tr>
            )}
            {staffList.map((s) => (
              <tr key={s.id} className="bg-[#050505] hover:bg-[#0b0b0b] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[#bdbdbd]">{s.staffId}</td>
                <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{s.name}</td>
                <td className="px-4 py-3 text-[#bdbdbd]">{s.designation}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm text-[#BFE01D] bg-[#BFE01D]/10">
                    {s.user.role.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#bdbdbd]">{s.phone}</td>
                <td className="px-4 py-3 text-[#bdbdbd] whitespace-nowrap">
                  {new Date(s.joiningDate).toLocaleDateString("en-BD")}
                </td>
                <td className="px-4 py-3 text-[#bdbdbd]">
                  {s.salary ? `৳${Number(s.salary).toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${STATUS_COLORS[s.status] ?? ""}`}>
                    {s.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/staff/${s.id}/edit`}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#bdbdbd] hover:text-white transition-colors">
                      Edit
                    </Link>
                    <StaffActions staffId={s.id} currentStatus={s.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
