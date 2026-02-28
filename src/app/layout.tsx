import type { Metadata } from "next";
import { Outfit, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const splineMonoFont = Spline_Sans_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debloat AI | Windows Optimization Suite",
  description: "AI-powered Windows optimization tool. Remove bloatware, boost performance, and reclaim your system's full potential.",
  keywords: ["Windows optimization", "bloatware removal", "system performance", "debloat", "AI optimization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfitFont.variable} ${splineMonoFont.variable}`}>
      <body
        className="antialiased overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
