export default function AGBPage() {
  return (
    <main className="min-h-[90vh] px-4 py-24 mt-8 flex justify-center">
      <div className="max-w-3xl w-full text-gray-800 text-sm leading-6">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <p>
          <strong>1. Geltungsbereich</strong>
          <br />
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
          Leistungen und Angebote von NotePilot, betrieben durch Till Wadehn,
          DGTILL IT Beratung und Web Design, über die Plattform{" "}
          <strong>notepilot.de</strong>.
        </p>

        <p>
          <strong>2. Leistungen von NotePilot</strong>
          <br />
          NotePilot bietet eine Plattform zur Umwandlung von Audio- und
          Videodateien in strukturierte Notizen, Stichpunkte und To-Dos mithilfe
          Künstlicher Intelligenz (OpenAI). Der Zugriff erfolgt über eine
          Weboberfläche. Die Nutzung erfolgt entweder kostenlos mit
          eingeschränktem Funktionsumfang oder im Rahmen eines kostenpflichtigen
          Abonnements.
        </p>

        <p>
          <strong>3. Registrierung & Benutzerkonto</strong>
          <br />
          Für die Nutzung ist eine Registrierung erforderlich. Nutzer sind
          verpflichtet, bei der Anmeldung wahrheitsgemäße Angaben zu machen und
          ihre Zugangsdaten vertraulich zu behandeln.
        </p>

        <p>
          <strong>4. Vertragsabschluss & Preise</strong>
          <br />
          Der Vertrag kommt mit der Auswahl eines Abonnements über Stripe und
          Bestätigung der Zahlung zustande. Die Preise sind auf{" "}
          <strong>notepilot.de</strong> einsehbar und verstehen sich inkl. USt.,
          sofern nicht anders angegeben.
        </p>

        <p>
          <strong>5. Zahlungsabwicklung</strong>
          <br />
          Die Zahlungsabwicklung erfolgt über Stripe. Die Nutzungsgebühr wird je
          nach Plan monatlich oder jährlich automatisch abgebucht.
        </p>

        <p>
          <strong>6. Widerrufsrecht für Verbraucher</strong>
          <br />
          Verbraucher haben ein 14-tägiges Widerrufsrecht. Bei vollständiger
          Leistungserbringung (z. B. Sofort-Transkription) vor Ablauf der Frist
          entfällt das Widerrufsrecht.
        </p>

        <p>
          <strong>7. Nutzungsrechte & Inhalte</strong>
          <br />
          Hochgeladene Inhalte verbleiben im Eigentum der Nutzer. Der Nutzer
          räumt NotePilot jedoch ein einfaches Nutzungsrecht zur Verarbeitung
          und Anzeige innerhalb der Plattform ein. Eine dauerhafte Speicherung
          oder Veröffentlichung erfolgt nicht.
        </p>

        <p>
          <strong>8. Verfügbarkeit</strong>
          <br />
          NotePilot bemüht sich um eine hohe Verfügbarkeit. Wartungsarbeiten
          oder externe Ausfälle (z. B. bei OpenAI oder Stripe) können jedoch zu
          Einschränkungen führen.
        </p>

        <p>
          <strong>9. Haftung</strong>
          <br />
          NotePilot haftet nur für Schäden aus der Verletzung wesentlicher
          Vertragspflichten (Kardinalpflichten) oder bei grober Fahrlässigkeit.
          Für KI-generierte Inhalte wird keine Gewähr übernommen.
        </p>

        <p>
          <strong>10. Kündigung</strong>
          <br />
          Das Abonnement kann jederzeit zum Ende der Laufzeit über das
          Benutzerkonto gekündigt werden. Kostenlose Accounts können jederzeit
          gelöscht werden.
        </p>

        <p>
          <strong>11. Änderungen der AGB</strong>
          <br />
          NotePilot behält sich vor, diese AGB zu ändern. Nutzer werden
          rechtzeitig über Änderungen informiert. Widerspricht der Nutzer nicht
          innerhalb von 14 Tagen, gelten die neuen Bedingungen als akzeptiert.
        </p>

        <p>
          <strong>12. Gerichtsstand & Recht</strong>
          <br />
          Es gilt deutsches Recht. Gerichtsstand ist - soweit gesetzlich
          zulässig - Berlin.
        </p>

        <p className="mt-8 text-gray-500 italic">Stand: Mai 2025</p>
      </div>
    </main>
  );
}
