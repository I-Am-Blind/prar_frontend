"use client"
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
const manrope = Manrope({ subsets: ["cyrillic"], weight: "variable" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={manrope.className}>{children}
      <Toaster />
      </body>
    </html>
  );
}
