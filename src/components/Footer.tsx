export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#050505] py-10">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-4 px-5 md:flex-row md:items-center md:px-10">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#BFE01D]" />
          <span className="font-display tracking-widest">FIT GYM CENTER</span>
        </div>
        <div className="text-xs text-[#bdbdbd]">
          © {new Date().getFullYear()} FIT GYM Center · Dhaka, Bangladesh
        </div>
        <div className="label">Built with discipline.</div>
      </div>
    </footer>
  );
}
