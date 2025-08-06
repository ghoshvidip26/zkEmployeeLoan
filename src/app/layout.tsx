import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Providers from "./providers";

export const metadata: Metadata = {
  title: "zkEmployeeLoan - Zero-Knowledge Employee Loan Platform",
  description:
    "Secure employee loan management with zero-knowledge proof verification. Privacy-first financial services built on Horizen technology.",
  icons: ["/logo/karma-gap-logo.svg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
