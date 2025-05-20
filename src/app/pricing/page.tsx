"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/user";

type User = {
  id: string;
  hasPaid: boolean;
  credits: number;
  createdAt: Date;
};

export default function PricingPage() {
  const { user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [loginmodal, setLoginModal] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const { url } = await res.json();
    router.push(url);
  };

  const handleCredits = async () => {
    const res = await fetch("/api/checkout/credits", { method: "POST" });
    const { url } = await res.json();
    router.push(url);
  };

    const handleCancel = async () => {
        const res = await fetch("/api/checkout/cancel", { method: "POST" });
        const { url } = await res.json();
        router.push(url);
    };

  const fetchUserData = async () => {
    if (user) {
      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUserData(data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <section className="min-h-screen py-20 px-4 bg-white text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">Preise</h1>
      <p className="text-secondary mb-12 text-sm md:text-base">
        Wähle den Plan, der zu dir passt. Starte kostenlos oder upgrade
        jederzeit.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="relative rounded-xl border p-6 shadow-sm flex flex-col justify-between text-left hover:shadow-xl transition ease-in border-gray-200 translate-y-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">Free</h2>
            <p className="text-3xl font-bold text-accent">0€</p>
            <p className="text-sm text-secondary">
              Starte kostenlos mit 1 Transkription
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>• 1 AI-Transkript pro Nutzer</li>
              <li>• Zugriff auf Editor</li>
              <li>• Keine Kreditkarte nötig</li>
            </ul>
          </div>
          <Button
            className="mt-6 w-full cursor-pointer"
            onClick={() => router.push("/")}
            disabled={(!userData?.hasPaid || userData?.credits === 0) && user}
          >
            {!userData?.hasPaid ? user ? "Ausgewählt" : "Jetzt starten" : "Jetzt starten"}
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-xl border p-6 shadow-sm flex flex-col justify-between text-left hover:shadow-xl transition ease-in border-accent shadow-md">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">Pro</h2>
            <p className="text-3xl font-bold text-accent">9€/Monat</p>
            <p className="text-sm text-secondary">
              Unbegrenzte Nutzung mit GPT-4o
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>• Unbegrenzte Transkriptionen</li>
              <li>• Zugang zu GPT-4o-Modell</li>
              <li>• Export & Teilen von Notizen</li>
              <li>• Priorisierter Support</li>
            </ul>
          </div>
          <Button
            className="mt-6 w-full cursor-pointer"
            onClick={() => {
              if (!user) {
                setLoginModal(true);
              } else {
                handleUpgrade();
              }
            }}
            disabled={userData?.hasPaid}
          >
            {userData?.hasPaid ? "Ausgewählt" : "Jetzt starten"}{" "}
          </Button>
          <div className="absolute -top-5 -right-5 bg-accent text-white rounded-full pointer-events-none py-2 px-4">
            Beliebt
          </div>
        </div>

        {/* Credits Plan */}
        <div className="relative rounded-xl border p-6 shadow-sm flex flex-col justify-between text-left hover:shadow-xl transition ease-in border-gray-200 translate-y-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">Credits</h2>
            <p className="text-3xl font-bold text-accent">5€ = 10x</p>
            <p className="text-sm text-secondary">
              Perfekt für gelegentliche Nutzer
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>• 10 AI-Transkriptionen</li>
              <li>• Kein Abo</li>
              <li>• Zugang zu GPT-3.5</li>
            </ul>
          </div>
          <Button
            className="mt-6 w-full cursor-pointer"
            onClick={() => {
              if (!user) {
                setLoginModal(true);
              } else {
                handleCredits();
              }
            }}
            disabled={false}
          >
            Credits kaufen
          </Button>
        </div>
      </div>

      {loginmodal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
          onClick={() => setLoginModal(false)}
        >
          <SignIn />
        </div>
      )}

      <Button onClick={() => handleCancel()} className="mt-8 cursor-pointer">
        Abbrechen
        </Button>
    </section>
  );
}
