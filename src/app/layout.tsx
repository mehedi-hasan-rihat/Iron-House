import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IRON HOUSE — Dhaka's Premium Fitness Center",
  description:
    "Not a gym. A standard. International equipment, certified coaches, and a community in Gulshan, Dhaka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0a0a0a] text-[#ededed] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
