import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WayPay — Smart Wallet for India",
  description: "Add money, send payments, and manage your finances seamlessly with WayPay. Powered by Stripe.",
  keywords: ["wallet", "payments", "India", "fintech", "digital wallet", "UPI"],
  authors: [{ name: "WayPay" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-white text-surface-900">
        {children}
      </body>
    </html>
  );
}
