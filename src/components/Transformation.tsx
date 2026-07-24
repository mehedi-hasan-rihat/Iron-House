"use client";
import { motion } from "framer-motion";

export default function Transformation() {
  return (
    <section className="relative bg-[#0b0b0b] py-24 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">

        {/* Quote col */}
        <div className="md:col-span-5">
          <span className="label">(06) — Transformation</span>
          <h2 className="mt-3 text-display">
            −18<span className="text-[#BFE01D]">kg</span><br />
            in 22<br />weeks.
          </h2>
          <p className="mt-8 max-w-md text-lg text-[#bdbdbd]">
            &ldquo;I walked in tired of my body. I walked out with something I built.
            FIT GYM CENTER didn&apos;t just change my weight — it changed my discipline.&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#BFE01D]/10 border border-[#BFE01D]/30 flex items-center justify-center">
              <span className="text-[#BFE01D] font-display">S</span>
            </div>
            <div>
              <div className="font-medium">Sadia Karim</div>
              <div className="text-sm text-[#bdbdbd]">Member · 2 years</div>
            </div>
          </div>
        </div>

        {/* Before / after col */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          <motion.img
            src="https://iron-house.lovable.app/assets/hero-3-DMy7cVqT.jpg"
            alt="Transformation before"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="aspect-3/4 w-full object-cover grayscale"
            loading="lazy"
          />
          <motion.img
            src="https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg"
            alt="Transformation after"
            initial={{ y: 120, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="aspect-3/4 w-full object-cover mt-12"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
