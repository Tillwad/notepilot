import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { Navigation } from "@/components/navigation";
import  Footer from "@/components/footer";

import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const metadata: Metadata = {
  title: "NotePilot - Notizen aus Audio & Video",
  description: "Verwandle Meetings in strukturierte Stichpunkte & To-Dos mit NotePilot. Schnell. Sicher. Automatisiert.",
  keywords: ["KI Notizen", "Meeting Zusammenfassung", "Audio zu Text", "NotePilot"],
  metadataBase: new URL("https://www.notepilot.de"),
  openGraph: {
    title: "NotePilot",
    description: "Deine smarte Meeting-Notizhilfe.",
    url: "https://notepilot.de",
    images: [{ url: "/og-image.png" }],
    siteName: "NotePilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotePilot",
    description: "Deine smarte Meeting-Notizhilfe.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    noarchive: false,
    nosnippet: false,
  },
  verification: {
    google: "google-site-verification=your-google-verification-code",
    yandex: "yandex-verification: your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://notepilot.de",
    languages: {
      "de-DE": "https://notepilot.de",
    }
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        
        <body>
          <Navigation />
          <main className="">{children}</main>
          <Footer />
            <CookieConsentBanner /> {/* <- hier einfügen */}
        </body>
      </html>
    </ClerkProvider>
  );
}
