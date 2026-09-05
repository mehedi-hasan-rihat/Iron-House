/**
 * /checkout?plan=<planId>
 *
 * Shows plan summary and initiates Moneybag hosted-checkout.
 * Requires the user to be logged in as a member — redirects to /login otherwise.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import CheckoutForm from "./CheckoutForm";

interface Props {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { plan: planId } = await searchParams;

  const session = await auth();

  // Not logged in → send to login, preserving intent
  if (!session?.user) {
    const dest = planId ? `/checkout?plan=${planId}` : "/checkout";
    redirect(`/login?callbackUrl=${encodeURIComponent(dest)}`);
  }

  // Staff / admin shouldn't land here
  if (session.user.role !== "member") {
    redirect("/admin/dashboard");
  }

  // Load available active plans
  const plans = await prisma.membershipPlan.findMany({
    where:   { isActive: true, trialEnabled: false },
    orderBy: { price: "asc" },
  });

  const selectedPlan = planId
    ? plans.find((p) => p.id === planId) ?? plans[0]
    : plans[0];

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) redirect("/login");

  return (
    <div className="min-h-screen bg-[#050505] text-[#f2f4e8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div>
          <a href="/" className="flex items-center gap-2 mb-10">
            <span className="h-2 w-2 rounded-full bg-[#BFE01D]" />
            <span className="font-display tracking-widest text-sm uppercase">Iron House</span>
          </a>
          <p className="label text-[#9aa87a]">Membership checkout</p>
          <h1 className="font-display text-3xl uppercase tracking-wide mt-1">
            Choose your plan
          </h1>
        </div>

        {/* Plan picker */}
        <div className="grid gap-3">
          {plans.map((p) => (
            <a
              key={p.id}
              href={`/checkout?plan=${p.id}`}
              className={`flex items-center justify-between border p-4 transition-colors ${
                p.id === selectedPlan?.id
                  ? "border-[#BFE01D] bg-[#0b0b0b]"
                  : "border-[#1a1a1a] bg-[#0b0b0b] hover:border-white/20"
              }`}
            >
              <div>
                <p className={`font-display uppercase text-lg ${p.id === selectedPlan?.id ? "text-[#BFE01D]" : "text-[#f2f4e8]"}`}>
                  {p.name}
                </p>
                <p className="text-xs text-[#9aa87a] mt-0.5">{p.durationDays} days</p>
              </div>
              <p className="font-display text-2xl">৳{Number(p.price).toLocaleString()}</p>
            </a>
          ))}
        </div>

        {/* Member info */}
        <div className="border border-[#BFE01D]/15 bg-[#0b0b0b] p-4 space-y-1">
          <p className="label text-[#9aa87a]">Paying as</p>
          <p className="font-display text-lg">{member.fullName}</p>
          <p className="font-mono text-xs text-[#9aa87a]">{member.memberId} · {member.phone}</p>
        </div>

        {/* Pay button — client component handles the fetch + redirect */}
        {selectedPlan && (
          <CheckoutForm planId={selectedPlan.id} planName={selectedPlan.name} amount={Number(selectedPlan.price)} />
        )}

        <p className="text-center text-[10px] text-[#9aa87a] uppercase tracking-widest">
          Secured by Moneybag · No card data stored on our servers
        </p>
      </div>
    </div>
  );
}
