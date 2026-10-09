import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTG Studio",
  description: "Custom Hand-Drawn Pop Art & Chibi Commissions",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFFDF5] text-black antialiased font-sans overflow-x-hidden min-h-screen flex flex-col">
        <BackgroundCanvas />
        <Navbar />
        <main className="pt-16 md:pt-20 px-3 sm:px-6 w-full max-w-7xl mx-auto flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
