"use client";
import { motion } from "framer-motion";

const EXP1 = "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg";

export default function About() {
  return (
    <section className="relative bg-[#050505] py-24 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 md:grid-cols-12 md:px-10">

        {/* Image col */}
        <div className="md:col-span-4">
          <span className="label">(01) — The House</span>
          <div className="mt-8 aspect-[3/4] overflow-hidden">
            <motion.img
              src={EXP1}
              alt="Trainer coaching an athlete"
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Copy col */}
        <div className="md:col-span-8 md:pl-12">
          <h2 className="text-display">
            Not a gym.<br />
            A <span className="italic font-normal text-[#bdbdbd]" style={{ fontFamily: 'Georgia, serif' }}>standard.</span>
          </h2>

          <div className="mt-12 grid gap-10 text-[#bdbdbd] md:grid-cols-2">
            <p className="text-lg leading-relaxed">
              We built FIT GYM CENTER for the people who show up when nobody&apos;s
              watching. For the ones who understand that transformation isn&apos;t
              loud — it&apos;s consistent. Every square meter of our floor is
              engineered around one idea: give you no excuse.
            </p>
            <p className="text-lg leading-relaxed">
              International equipment. Certified coaches. A community that lifts
              each other — literally. From Gulshan to the rest of Dhaka, we are
              raising the standard of what a fitness experience should feel like
              in Bangladesh.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-[#1a1a1a] pt-10 md:grid-cols-4">
            {[["01","Discipline"],["02","Coaching"],["03","Equipment"],["04","Community"]].map(([n, t]) => (
              <div key={n}>
                <div className="label">{n}</div>
                <div className="mt-2 font-display text-2xl">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
