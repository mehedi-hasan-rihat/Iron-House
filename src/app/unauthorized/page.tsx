import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 text-[#f2f4e8]">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#BFE01D]" />
        <span className="font-display tracking-[0.4em] text-sm uppercase">Iron House</span>
      </div>
      <h1 className="font-display text-5xl uppercase tracking-wide text-[#BFE01D]">403</h1>
      <p className="text-[#9aa87a] text-sm">You don&apos;t have permission to access this page.</p>
      <Link
        href="/admin/dashboard"
        className="border border-[#BFE01D] text-[#BFE01D] text-xs uppercase tracking-[0.25em] px-6 py-3 hover:bg-[#BFE01D] hover:text-black transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
