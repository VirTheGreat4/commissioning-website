import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Neo - Commission Art",
  description: "Commission custom cartoony chibi and portrait art.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FDF4FF] text-black antialiased font-sans">
        <Navbar />
        <main className="pt-24 pb-12 px-6 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
