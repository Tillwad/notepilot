"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState<null | boolean>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (saved === "true") setConsent(true);
    if (saved === "false") setConsent(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setConsent(true);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie_consent", "false");
    setConsent(false);
  };

  return (
    <>
      {/* Lade Analytics nur bei Zustimmung */}
      {consent && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-4C9YNW5B6Z"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4C9YNW5B6Z', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Banner anzeigen, wenn noch keine Entscheidung */}
      {consent === null && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto bg-white border border-gray-300 shadow-md rounded-xl p-4 z-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-800">
            Diese Website verwendet Cookies, um Google Analytics zu laden (anonymisiert). Mit deiner Zustimmung hilfst du uns, die Seite zu verbessern.
          </div>
          <div className="flex gap-2">
            <button
              onClick={declineCookies}
              className="px-4 py-1 rounded border border-gray-400 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
              Ablehnen
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-1 rounded bg-primary text-white text-sm cursor-pointer hover:bg-primary-dark transition-colors"
            >
              Zustimmen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
