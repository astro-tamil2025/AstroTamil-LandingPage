import type { Metadata } from "next";
import { Geist_Mono, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "./components/Header";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nakshatra Talks",
  description: "Daily horoscopes and astrology guidance in Tamil.",
  icons: {
    icon: "/images/header/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${playfair.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
