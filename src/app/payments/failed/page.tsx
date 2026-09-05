import Link from "next/link";

interface Props {
  searchParams: Promise<{ invoice?: string }>;
}

export default async function PaymentFailedPage({ searchParams }: Props) {
  const { invoice } = await searchParams;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">

        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full border-2 border-red-500 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M10 10L26 26M26 10L10 26" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-display text-3xl uppercase tracking-wider text-[#f2f4e8]">Payment failed</p>
          <p className="text-[#9aa87a] text-sm">Your payment could not be processed. No charge was made.</p>
          {invoice && (
            <p className="font-mono text-xs text-[#9aa87a]">Ref: {invoice}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/checkout"
            className="block text-center bg-[#BFE01D] text-black text-xs font-bold uppercase tracking-[0.25em] py-4 hover:opacity-85 transition-opacity"
          >
            Try again
          </Link>
          <Link
            href="/dashboard"
            className="block text-center text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors py-2"
          >
            Back to dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
