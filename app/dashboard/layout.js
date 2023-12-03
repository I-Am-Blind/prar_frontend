import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/Context/Auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prar Labs Auth",
  description: "Authentication",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dash`}>{children}</body>
      </html>
    </AuthProvider>
  );
}
