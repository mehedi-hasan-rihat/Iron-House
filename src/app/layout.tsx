import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight:   "400",
  subsets:  ["latin"],
  variable: "--font-display-loaded",
  display:  "swap",
});

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-sans-loaded",
  display:  "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-mono-loaded",
  display:  "swap",
});

export const metadata: Metadata = {
  title: "IRON HOUSE — Dhaka's Premium Fitness Center",
  description:
    "Discipline begins here. IRON HOUSE Dhaka — international equipment, certified trainers, women's fitness, and a luxury training experience.",
  openGraph: {
    title: "IRON HOUSE — Dhaka's Premium Fitness Center",
    description:
      "Discipline begins here. IRON HOUSE Dhaka — international equipment, certified trainers, women's fitness, and a luxury training experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        className="bg-[#050505] text-white antialiased"
        suppressHydrationWarning
        style={{
          fontFamily: "var(--font-sans-loaded, var(--font-sans))",
        }}
      >
        {children}
      </body>
    </html>
  );
}
