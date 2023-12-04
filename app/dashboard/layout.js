import { Inter, Manrope } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/Context/Auth";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({subsets : ['cyrillic'],weight:"variable"})

export const metadata = {
  title: "Prar Labs Auth",
  description: "Authentication",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${manrope.className} bg-dash`}>{children}</body>
      </html>
    </AuthProvider>
  );
}
