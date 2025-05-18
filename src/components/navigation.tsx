import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";
export const Navigation = () => {
  return (
    <nav className="bg-[var(--background)] border-b border-[var(--foreground)]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              Note
              <span className="text-accent">Pilot</span>
            </h1>
            </ Link>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                Anmelden
              </SignInButton>
              <SignUpButton mode="modal">
                Registrieren
              </SignUpButton>
            </SignedOut>
            <SignedIn>
                <Link href="/">Hochladen</Link>
              <Link href="/notes">Notizen</Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};