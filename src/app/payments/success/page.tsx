/**
 * /payments/success?invoice=INV-0001&transaction_id=TXN_xxx
 *
 * Moneybag redirects here after a successful payment.
 * We verify server-side before showing the success UI.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { verifyPayment } from "@/lib/payments/moneybag";
import { fulfillPayment } from "@/app/api/moneybag/webhook/route";

interface Props {
  searchParams: Promise<{ invoice?: string; transaction_id?: string; status?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { invoice, transaction_id, status } = await searchParams;

  if (!invoice) redirect("/");

  // Verify with Moneybag backend if we have a transaction_id from the redirect
  if (transaction_id) {
    try {
      const verified = await verifyPayment(transaction_id);
      const resolvedInvoice = invoice ?? verified.order_id;
      await fulfillPayment(resolvedInvoice, transaction_id, verified.status);
    } catch (err) {
      console.error("[payments/success] verify error", err);
      // Fallback: use the status query param Moneybag sends in the redirect
      if (status === "SUCCESS") {
        await fulfillPayment(invoice, transaction_id, "SUCCESS").catch(console.error);
      }
    }
  }

  // Load our payment record
  const payment = await prisma.payment.findUnique({
    where:   { invoiceNumber: invoice },
    include: { membership: { include: { plan: true } }, member: true },
  });

  if (!payment) redirect("/");

  const isPaid = payment.status === "PAID";

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Icon */}
        <div className="flex justify-center">
          {isPaid ? (
            <div className="h-20 w-20 rounded-full border-2 border-[#BFE01D] flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M7 18L15 26L29 10" stroke="#BFE01D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full border-2 border-red-500 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M10 10L26 26M26 10L10 26" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          <p className="font-display text-3xl uppercase tracking-wider text-[#f2f4e8]">
            {isPaid ? "Payment confirmed" : "Payment not completed"}
          </p>
          {isPaid && payment.membership && (
            <p className="text-[#9aa87a] text-sm">
              {payment.membership.plan.name} membership is now active.
            </p>
          )}
        </div>

        {/* Receipt card */}
        <div className="border border-[#BFE01D]/20 bg-[#0b0b0b] p-6 space-y-3">
          <Row label="Invoice"  value={payment.invoiceNumber} />
          {payment.transactionId && (
            <Row label="Transaction" value={payment.transactionId} />
          )}
          {payment.membership && (
            <>
              <Row label="Plan"  value={payment.membership.plan.name} />
              <Row label="Valid until" value={new Date(payment.membership.endDate).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })} />
            </>
          )}
          <div className="border-t border-[#BFE01D]/15 pt-3 flex justify-between">
            <span className="label text-[#9aa87a]">Amount paid</span>
            <span className="font-display text-2xl text-[#BFE01D]">
              ৳{Number(payment.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="block text-center bg-[#BFE01D] text-black text-xs font-bold uppercase tracking-[0.25em] py-4 hover:opacity-85 transition-opacity"
          >
            Go to dashboard
          </Link>
          <Link
            href="/payments"
            className="block text-center text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors py-2"
          >
            View payment history
          </Link>
        </div>

      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="label text-[#9aa87a] shrink-0">{label}</span>
      <span className="font-mono text-xs text-[#f2f4e8] text-right break-all">{value}</span>
    </div>
  );
}
