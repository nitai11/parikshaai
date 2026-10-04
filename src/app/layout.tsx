import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParikshaAI - भारत का #1 AI Exam Prep & Mock Test App",
  description: "कोचिंग नोट्स और किताबों की फोटो से 5 सेकंड में AI मॉक टेस्ट बनाएं और 1v1 बैटल में दोस्तों को हराएं।",
  applicationName: "ParikshaAI",
  appleWebApp: {
    capable: true,
    title: "ParikshaAI",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full bg-gray-50 text-gray-900 overflow-x-hidden">{children}</body>
    </html>
  );
}
