"use client";

import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="min-h-[90vh] px-4 py-24 mt-8 flex justify-center">
      <div className="max-w-3xl w-full text-gray-800 text-sm leading-6">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">
          Datenschutzerklärung
        </h1>

        <div className="mb-6 leading-7">
          <p>
            <strong>1. Verantwortlicher</strong>
            <br />
            Verantwortlich für die Datenverarbeitung ist:
            <br />
            DGTILL IT Beratung und Web Design
            <br />
            Inhaber: Till Wadehn
            <br />
            Breisgauer Str. 27, 14129 Berlin Deutschland
            <br />
            E-Mail: kontakt@notepilot.de
          </p>

          <p>
            <strong>2. Zugriffsdaten & Hosting</strong>
            <br />
            Beim Aufruf dieser Website werden automatisch Informationen
            (sog. Server-Logfiles) durch den Hostinganbieter Vercel
            gespeichert:
            <br />
            IP-Adresse, Browsertyp, Betriebssystem, Referrer, Datum und
            Uhrzeit.
            <br />
            Dies dient der Systemsicherheit. Rechtsgrundlage ist Art. 6
            Abs. 1 lit. f DSGVO.
          </p>

          <p>
            <strong>3. Nutzerkonto und Authentifizierung (Clerk)</strong>
            <br />
            Zur Verwaltung von Benutzerkonten nutzen wir den Dienst
            „Clerk“. Dabei werden Daten wie Name, E-Mail,
            Anmeldeverlauf und ggf. Profilbild verarbeitet.
            <br />
            Anbieter: Clerk Inc., 548 Market St, San Francisco, CA 94104,
            USA.
            <br />
            Die Datenverarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b
            DSGVO (zur Vertragserfüllung) und ggf. Art. 6 Abs. 1 lit. a
            DSGVO (Einwilligung).
          </p>

          <p>
            <strong>4. Zahlungsabwicklung (Stripe)</strong>
            <br />
            Für die Zahlungsabwicklung verwenden wir Stripe. Stripe
            verarbeitet u.a. Name, Zahlungsdaten, E-Mail, IP-Adresse.
            <br />
            Anbieter: Stripe Inc., 510 Townsend Street, San Francisco, CA
            94103, USA.
            <br />
            Es findet eine Übermittlung in die USA statt. Stripe ist nach
            dem EU-U.S. Data Privacy Framework zertifiziert.
            <br />
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
          </p>

          <p>
            <strong>5. Transkription & KI-Verarbeitung (OpenAI)</strong>
            <br />
            Bei Nutzung der Transkriptionsfunktion (Audio/Video zu Text)
            werden Inhalte an die OpenAI API gesendet und verarbeitet.
            <br />
            Anbieter: OpenAI, L.L.C., 3180 18th St, San Francisco, CA 94110,
            USA.
            <br />
            Die Verarbeitung erfolgt auf Basis Ihrer Einwilligung (Art. 6
            Abs. 1 lit. a DSGVO).
            <br />
            Die Inhalte werden temporär verarbeitet, aber nicht dauerhaft
            gespeichert.
          </p>

          <p>
            <strong>6. Webanalyse (Google Analytics & Search Console)</strong>
            <br />
            Diese Website verwendet Google Analytics, einen
            Webanalysedienst der Google LLC (1600 Amphitheatre Parkway,
            Mountain View, CA 94043, USA).
            <br />
            Google verwendet Cookies und erfasst pseudonymisierte
            Nutzungsdaten (z. B. Geräteinformationen, Standort,
            Verweildauer).
            <br />
            Die IP-Adresse wird anonymisiert gespeichert.
            <br />
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
            <br />
            Widerruf ist jederzeit über Cookie-Banner oder
            Browser-Einstellungen möglich.
          </p>

          <p>
            <strong>7. Cookies</strong>
            <br />
            Wir verwenden nur technisch notwendige Cookies sowie Cookies
            zur Analyse (nur mit Einwilligung).
            <br />
            Sie können Ihre Cookie-Einstellungen jederzeit anpassen.
          </p>

          <p>
            <strong>8. Ihre Rechte als Betroffener</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
          </ul>

          <p>
            <strong>9. Beschwerderecht</strong>
            <br />
            Sie haben das Recht, sich bei der zuständigen
            Aufsichtsbehörde zu beschweren:
            <br />
            Berliner Beauftragte für Datenschutz und
            Informationsfreiheit
            <br />
            Friedrichstraße 219, 10969 Berlin
            <br />
            <Link
              href="https://www.datenschutz-berlin.de"
              className="underline text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.datenschutz-berlin.de
            </Link>
          </p>

          <p>
            <strong>10. Aktualisierung</strong>
            <br />
            Diese Datenschutzerklärung wurde zuletzt im Mai 2025
            aktualisiert und kann sich künftig ändern.
          </p>
        </div>
      </div>
    </main>
  );
}
