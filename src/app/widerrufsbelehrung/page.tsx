import Link from "next/link";

export default function WiderrufPage() {
  return (
    <main className="min-h-[90vh] px-4 py-24 mt-8 flex justify-center">
      <div className="max-w-3xl w-full text-gray-800 text-sm leading-6">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">
          Widerrufsbelehrung
        </h1>

        <p className="mb-4">
          Verbraucher haben das folgende Widerrufsrecht. Ein Verbraucher ist jede
          natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die
          überwiegend weder ihrer gewerblichen noch ihrer selbstständigen
          beruflichen Tätigkeit zugerechnet werden können.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">Widerrufsrecht</h2>
        <p className="mb-4">
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage
          ab dem Tag des Vertragsschlusses.
        </p>

        <p className="mb-4">
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (DGTILL IT Beratung und Web Design, Till Wadehn, Breisgauer Str. 27, 14129 Berlin, E-Mail: kontakt@notepilot.de)
          mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter
          Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
          informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
            über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
            absenden.
          </p>

          <p>
            <strong>2. Folgen des Widerrufs</strong>
            <br />
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
            die wir von Ihnen erhalten haben, einschließlich der Lieferkosten
            (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben,
            dass Sie eine andere Art der Lieferung als die von uns angebotene,
            günstigste Standardlieferung gewählt haben), unverzüglich und
            spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem
            die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
            eingegangen ist.
            <br />
            Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das
            Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn,
            mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
            werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
          </p>

          <p>
            <strong>3. Besondere Hinweise bei digitalen Inhalten</strong>
            <br />
            Bei digitalen Inhalten (z. B. Transkriptionsservices, KI-Analysen)
            erlischt Ihr Widerrufsrecht, wenn Sie ausdrücklich zugestimmt haben,
            dass wir vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrags
            beginnen, und Sie Ihre Kenntnis davon bestätigt haben, dass Sie mit
            Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.
          </p>

          <p>
            <strong>4. Muster-Widerrufsformular</strong>
            <br />
            (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
            Formular aus und senden Sie es zurück.)
          </p>

          <div className="border rounded p-4 bg-gray-50 text-gray-700 text-sm">
            <p>
              An: DGTILL IT Beratung und Web Design <br />
              Inhaber: Till Wadehn <br />
              Breisgauer Str. 27 <br />
              14129 Berlin <br />
              E-Mail: kontakt@notepilot.de
            </p>

            <p className="mt-4">
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
              Vertrag über den Kauf der folgenden Dienstleistung:
              <br />
              ___________________________________________
              <br />
              Bestellt am (*)/erhalten am (*):
              <br />
              ___________________________________________
              <br />
              Name des/der Verbraucher(s):
              <br />
              ___________________________________________
              <br />
              Anschrift des/der Verbraucher(s):
              <br />
              ___________________________________________
              <br />
              Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
              <br />
              ___________________________________________
              <br />
              Datum:
              <br />
              ___________________________________________
              <br />
              (*) Unzutreffendes streichen
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Letzte Aktualisierung: Juni 2025
          </p>
        </div>
    </main>
  );
}

