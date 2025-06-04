import Link from "next/link";

export default function LegalPage() {
  return (
    <main className="h-[90vh] flex justify-center px-4 py-24 mt-8">
      <div className="max-w-xl w-full">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold mb-6 text-black">Rechtliches</h1>
        </div>

        <p className="text-gray-700 mb-6">
          Wenn Sie Fragen haben, kontaktieren Sie uns gerne per E-Mail unter:{" "}
          <Link
            href="mailto:kontakt@notepilot.de"
            className="text-primary underline"
          >
            kontakt@notepilot.de
          </Link>
        </p>

        <ul className="space-y-4 text-gray-800 font-medium">
          <li>
            <Link
              href="/impressum"
              className="hover:text-primary transition-colors underline"
            >
              Impressum
            </Link>
          </li>
          <li>
            <Link
              href="/datenschutz"
              className="hover:text-primary transition-colors underline"
            >
              Datenschutz
            </Link>
          </li>
          <li>
            <Link
              href="/agb"
              className="hover:text-primary transition-colors underline"
            >
              Allgemeine Geschäftsbedingungen (AGB)
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
