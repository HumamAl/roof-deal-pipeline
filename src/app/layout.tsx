import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { TabNavigation } from "@/components/layout/tab-navigation";
import { APP_CONFIG } from "@/lib/config";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roof Deal Pipeline | Demo by Humam",
  description: "Automated roofing CRM pipeline — property scraping, data enrichment, and deal management for Pipedrive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme activates the CSS theme system — Layout Builder sets APP_CONFIG.aesthetic
    // which flows through here to drive all visual treatment via CSS variables.
    <html lang="en" data-theme={APP_CONFIG.aesthetic}>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <TabNavigation />
        {children}
      </body>
    </html>
  );
}
