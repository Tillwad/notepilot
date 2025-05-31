import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="h-auto min-h-[90vh] flex justify-center px-4 py-24 mt-24">
      <div className="max-w-xl w-full text-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-black">Impressum</h1>
        </div>

        {/* <div className="space-y-4 text-sm leading-6">
          <p>
            <strong>Angaben gemäß § 5 TMG</strong>
          </p>
          <p>
            DGTILL IT Beratung und Web Design
            <br />
            Inhaber: Till Wadehn
            <br />
            Breisgauer Str. 27
            <br />
            14129 Berlin, Deutschland
          </p>

          <p>
            E-Mail:{" "}
            <a
              href="mailto:kontakt@notepilot.de"
              className="text-primary underline"
            >
              kontakt@notepilot.de
            </a>
          </p>

          <p>
            Geschäftsbezeichnung: DGTILL IT Beratung und Web Design
            <br />
            Rechtsform: nicht eingetragenes Einzelunternehmen
            <br />
            Betriebsform: Hauptniederlassung
            <br />
            Beteiligung öffentlicher Hand: Nein
            <br />
            Betriebsart: Sonstiges
          </p>

          <p>
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
            <br />
            Till Wadehn
            <br />
            Musterstraße 1<br />
            12345 Musterstadt
          </p>
        </div> */}
        <div className="space-y-4 text-sm leading-6">
          <p>
            Till Wadehn
            <br />
            Wadehn, Till (Einzelunternehmer)
            <br />
            DGTILL IT Beratung und Web Design
            <br />
            Breisgauer Str. 27
            <br />
            14129 Berlin, Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: kotnakt@notepilot.de
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europ&auml;ische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <Link
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </Link>
            .<br /> Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>

          <h2>
            Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle
          </h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>

          <p>
            Quelle:{" "}
            <a href="https://www.e-recht24.de/impressum-generator.html">
              https://www.e-recht24.de/impressum-generator.html
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
