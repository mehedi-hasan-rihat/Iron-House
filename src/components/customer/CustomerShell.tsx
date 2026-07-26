"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, User, LogOut } from "lucide-react";

const ACC = "#BFE01D";
const NAV = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/membership",  label: "Membership",  icon: CreditCard      },
  { href: "/payments",    label: "Payments",    icon: CreditCard      },
  { href: "/profile",     label: "Profile",     icon: User            },
];

export default function CustomerShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: { user: { email?: string | null; name?: string | null } };
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* top nav */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACC }} />
            <span className="font-display text-sm tracking-[0.35em] uppercase">Fit Gym Center</span>
          </div>
          <div className="flex items-center gap-1">
            {NAV.map(({ href, icon: Icon }) => (
              <Link key={href} href={href}
                className={`p-2 rounded-sm transition-colors ${pathname.startsWith(href) ? "text-[#BFE01D]" : "text-[#bdbdbd] hover:text-white"}`}>
                <Icon size={18} />
              </Link>
            ))}
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-[#bdbdbd] hover:text-white transition-colors ml-1">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* bottom tab nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1a1a1a] bg-[#050505]/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center gap-1 py-3 text-[9px] uppercase tracking-[0.2em] transition-colors
                  ${active ? "text-[#BFE01D]" : "text-[#bdbdbd]"}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* content */}
      <main className="mx-auto max-w-3xl px-5 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
