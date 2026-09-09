import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function SuspendedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // If they somehow got un-suspended, send them back to dashboard
  const member = await prisma.member.findUnique({ where: { userId: session.user.id } });
  if (member?.status !== "SUSPENDED") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 px-5 text-[#f2f4e8]">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-orange-400" />
        <span className="font-display tracking-[0.4em] text-sm uppercase">Iron House</span>
      </div>

      <div className="max-w-sm w-full border border-orange-400/30 bg-orange-400/5 p-8 text-center space-y-4">
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 bg-orange-400/15 text-orange-400">
          Account Suspended
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wide text-[#f2f4e8]">
          Access Restricted
        </h1>
        <p className="text-[#9aa87a] text-sm leading-relaxed">
          Your account has been suspended. You cannot access the gym or your dashboard
          until this is resolved by our team.
        </p>
        <div className="border-t border-orange-400/15 pt-4 space-y-2 text-xs text-[#9aa87a]">
          <p>To resolve this, please contact us:</p>
          <a href="tel:+8801601797188"
            className="block font-mono text-orange-400 hover:text-orange-300 transition-colors">
            +880 1601 797 188
          </a>
          <a href="https://wa.me/8801601797188"
            className="block font-mono text-orange-400 hover:text-orange-300 transition-colors">
            WhatsApp
          </a>
        </div>
      </div>

      <Link
        href="/api/auth/signout"
        className="text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] hover:text-[#f2f4e8] transition-colors"
      >
        Sign out
      </Link>
    </div>
  );
}
