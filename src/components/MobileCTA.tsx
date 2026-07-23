export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-[#1a1a1a] bg-[#050505]/95 backdrop-blur md:hidden">
      <a href="tel:+8801700000000"          className="flex items-center justify-center py-4 text-xs uppercase tracking-[0.2em] text-white">Call</a>
      <a href="https://wa.me/8801700000000" className="flex items-center justify-center border-x border-[#1a1a1a] py-4 text-xs uppercase tracking-[0.2em] text-[#BFE01D]">WhatsApp</a>
      <a href="#contact"                    className="flex items-center justify-center py-4 text-xs uppercase tracking-[0.2em] text-white">Directions</a>
    </div>
  );
}
