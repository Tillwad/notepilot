"use client";

import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-accent text-base text-sm">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-secondary">
        {/* Branding */}
        <div className="space-y-3">
          <h4 className="text-xl font-semibold text-primary"><span className="font-allura text-primary font-bold">Note</span><span className="text-primary font-bold">Pilot</span></h4>
          <p className="text-sm">
            Die smarte Lösung für AI-generierte Meeting-Zusammenfassungen, To-Dos & Entscheidungen.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="font-semibold text-primary">Navigation</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:text-accent transition">Start</Link>
            </li>
            <li>
              <Link href="/notes" className="hover:text-accent transition">Notizen</Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-accent transition">Preise</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-accent transition">Datenschutz</Link>
            </li>
          </ul>
        </div>

        {/* Kontakt / Social */}
        <div className="space-y-3">
          <h4 className="font-semibold text-primary">Kontakt</h4>
          <p className="text-sm">Du hast Fragen? Schreib uns gern!</p>
          <div className="flex gap-4 mt-2 text-base">
            <Link href="mailto:team@meetingnotegpt.com" className="hover:text-accent" aria-label="Email">
              <Mail className="w-5 h-5" />
            </Link>
            <Link href="https://github.com/dein-repo" target="_blank" rel="noopener noreferrer" className="hover:text-accent" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="https://twitter.com/deinhandle" target="_blank" rel="noopener noreferrer" className="hover:text-accent" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-muted-foreground py-4 border-t">
        © {new Date().getFullYear()} <span className="font-allura text-primary font-bold">Note</span><span className="text-base font-bold">Pilot</span>. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
