import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
export const Navigation = () => {
  return (
    <nav className="h-[10vh] flex items-center ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                <span className="font-allura">Note</span>
                <span className="text-accent">Pilot</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4 cursor-pointer">
            <Link href="/pricing" className="text-sm font-semibold text-accent hover:text-accent/80 transition">
              Preise
              </Link>
            <SignedOut >
              <SignInButton mode="modal"><span className="cursor-pointer">Anmelden</span></SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" size="sm" className="cursor-pointer">
                  Jetzt Anfangen
                </Button>
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
