import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="hi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full bg-gray-50 text-gray-900 overflow-x-hidden">
        {children}
        {/* 📊 Vercel Real-Time Analytics & Traffic Insights */}
        <Analytics />
        <SpeedInsights />

        {/* 📈 Google Analytics 4 (Optional: activates if NEXT_PUBLIC_GA_ID is set) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

