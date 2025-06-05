"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="h-[10vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold text-[var(--foreground)]">
                <span className="font-allura">Note</span>
                <span className="text-accent">Pilot</span>
              </h1>
            </Link>
          </div>

          {/* Mobile: Profile Icon als Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none cursor-pointer"
            >
              {!isOpen ? (
                <Menu className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-accent hover:text-accent/80 transition"
            >
              Preise
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <span className="cursor-pointer">Anmelden</span>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" size="sm" className="cursor-pointer">
                  Jetzt Anfangen
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              {isLoaded && isSignedIn && (
                <>
                  <Link href="/dashboard/upload">Hochladen</Link>
                  <Link href="/dashboard">Dashboard</Link>
                  <UserButton />
                </>
              )}
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-[10vh] left-0 right-0 z-50 bg-white shadow-md md:hidden px-4 py-6 flex flex-col gap-4 animate-fade-in-down">
          <Link
            href="/pricing"
            className="text-sm font-semibold text-accent hover:text-accent/80 transition"
            onClick={() => setIsOpen(false)}
          >
            Preise
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <span className="cursor-pointer">Anmelden</span>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default" size="sm" className="cursor-pointer">
                Jetzt Anfangen
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/" onClick={() => setIsOpen(false)}>
              Hochladen
            </Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </nav>
  );
};
