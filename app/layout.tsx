import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Load global odontogram styles
import "../components/odontogram/odontogram.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DentalProvider } from "@/store/useDentalStore";
import MainLayout from "@/components/MainLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "IDRS — Intelligent Dental Record System",
  description: "Dental Clinical Companion & Charting Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DentalProvider>
          <TooltipProvider>
            <MainLayout>{children}</MainLayout>
          </TooltipProvider>
        </DentalProvider>
      </body>
    </html>
  );
}
