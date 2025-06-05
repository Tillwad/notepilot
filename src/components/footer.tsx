"use client";

import Link from "next/link";
import { Mail, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-accent text-sm">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-secondary">
        {/* Branding */}
        <div className="space-y-3">
          <h4 className="text-xl font-semibold text-primary">
            <span className="font-allura text-primary font-bold">Note</span>
            <span className="text-white font-bold">Pilot</span>
          </h4>
          <p className="text-sm text-white">
            Die smarte Lösung für Meeting-Zusammenfassungen, To-Dos &
            Entscheidungen.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3 text-white">
          <h4 className="font-semibold text-primary">Navigation</h4>
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/notes"
                className="hover:opacity-80 transition"
              >
                Notizen
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:opacity-80 transition">
                Preise
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:opacity-80 transition">
                Legal
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontakt / Social */}
        <div className="space-y-3 text-white">
          <h4 className="font-semibold text-primary">Kontakt</h4>
          <p className="text-sm">Du hast Fragen? Schreib uns gern!</p>
          <div className="flex gap-4 mt-2 text-base">
            <Link
              href="mailto:kontakt@notepilot.de"
              className="hover:opacity-80"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </Link>
            <Link
              href="https://istagram.com/_notepilot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
              aria-label="GitHub"
            >
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-400 py-4 border-t">
        © {new Date().getFullYear()}{" "}
        <span className="font-allura text-primary font-bold">Note</span>
        <span className="text-base font-bold">Pilot</span>. Alle Rechte
        vorbehalten.
      </div>
    </footer>
  );
}
