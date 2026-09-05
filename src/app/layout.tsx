import type { Metadata } from "next";
import { Archivo, Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SessionProvider from "@/components/SessionProvider";

/* Display — variable Archivo. The `wdth` axis is what buys the expanded
   editorial look; `font-variation-settings` in globals.css drives it. */
const archivo = Archivo({
  subsets:  ["latin"],
  axes:     ["wdth"],
  variable: "--font-display-loaded",
  display:  "swap",
});

/* Accent — the serif italic used for a single word inside a headline. */
const instrumentSerif = Instrument_Serif({
  weight:   "400",
  style:    ["normal", "italic"],
  subsets:  ["latin"],
  variable: "--font-serif-loaded",
  display:  "swap",
});

const geist = Geist({
  subsets:  ["latin"],
  variable: "--font-sans-loaded",
  display:  "swap",
});

const geistMono = Geist_Mono({
  subsets:  ["latin"],
  variable: "--font-mono-loaded",
  display:  "swap",
});

export const metadata: Metadata = {
  title: "IRON HOUSE — Dhaka's Premium Fitness Center",
  description:
    "Discipline begins here. Iron House Dhaka — international equipment, certified trainers, women's fitness, and a luxury training experience.",
  openGraph: {
    title: "IRON HOUSE — Dhaka's Premium Fitness Center",
    description:
      "Discipline begins here. Iron House Dhaka — international equipment, certified trainers, women's fitness, and a luxury training experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body
        className="bg-[#050505] text-white antialiased"
        suppressHydrationWarning
        style={{
          fontFamily: "var(--font-sans-loaded, var(--font-sans))",
        }}
      >
        <SessionProvider>
          <Cursor />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
