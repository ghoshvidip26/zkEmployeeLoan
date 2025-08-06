import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Organization Dashboard - zkEmployeeLoan",
  description:
    "Manage your organization's employee loan programs with zero-knowledge proof verification and secure data management.",
  icons: ["/logo/karma-gap-logo.svg"],
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
