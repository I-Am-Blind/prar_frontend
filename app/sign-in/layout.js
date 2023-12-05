import { Inter } from "next/font/google";
import "../globals.css";

const manrope = Manrope({ subsets: ["cyrillic"], weight: "variable" });

export const metadata = {
  title: "Prar Labs Auth",
  description: "Authentication",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={manrope.className}>{children}</body>
      </html>
  );
}
