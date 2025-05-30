"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Soup } from "lucide-react";
import { GiDonerKebab } from "react-icons/gi";
import VergleichSection from "@/components/VergleichSection";

type SubscriptionType = "FREE" | "BRONZE" | "SILBER" | "GOLD" | null;

type User = {
  id: string;
  hasPaid: boolean;
  credits: number;
  subscriptionId: string;
  subscriptionType: SubscriptionType;
  subscriptionExpiresAt: Date;
  subscriptionStatus: string;
  createdAt: Date;
};

export default function PricingPage() {
  const { user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [loginmodal, setLoginModal] = useState(false);
  const router = useRouter();

  const handleUpgrade = async (plan: string) => {
    if (!userData) return;
    let res;
    if (!userData.hasPaid) {
      res = await fetch(`/api/checkout?plan=${plan}&redirect=/pricing`, {
        method: "POST",
      });
    } else {
      res = await fetch(`/api/checkout/upgrade?plan=${plan}`, {
        method: "POST",
      });
    }
    const { url } = await res.json();
    router.push(url);
  };

  const handleCredits = async () => {
    const res = await fetch("/api/checkout/credits?redirect=/pricing", {
      method: "POST",
    });
    const { url } = await res.json();
    router.push(url);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchSubscription = async () => {
      if (!user) {
        timeoutId = setTimeout(fetchSubscription, 300); // 300ms warten und erneut versuchen
        return;
      }
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const userData = await res.json();
      if (!userData) return;
      setUserData(userData);
    };

    fetchSubscription();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  const isCurrentPlan = (type: SubscriptionType) =>
    userData?.subscriptionType === type;

  return (
    <>
      <section className="min-h-screen py-20 px-4 bg-white text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Preise</h1>
        <p className="text-secondary mb-12 text-sm md:text-base">
          Wähle den Plan, der zu dir passt. Starte kostenlos oder upgrade
          jederzeit.
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bronze */}
          <PlanCard
            title="Bronze"
            price="1,99€/Monat"
            description={
              <span className="inline-flex items-center gap-2">
                So viel wie ein großer Kaffee
                <Coffee className="w-4 h-4 text-muted-foreground" />
              </span>
            }
            features={[
              "GPT 3.5 turbo",
              "Unbegrenzte Audio-Uploads",
              "Themen-, ToDo- und Eventlisten",
            ]}
            isSelected={isCurrentPlan("BRONZE")}
            onClick={() => {
              if (!user) setLoginModal(true);
              else handleUpgrade("BRONZE");
            }}
            userData={userData}
          />

          {/* Silber */}
          <PlanCard
            title="Silber"
            price="7,99€/Monat"
            description={
              <span className="inline-flex items-center gap-2">
                So viel wie ein Döner
                <GiDonerKebab className="w-6 h-6 text-muted-foreground" />
              </span>
            }
            features={[
              "GPT-4o",
              "Alle Bronze-Features",
              "Unbegrenzter Audio-/Video-Upload",
              "Listen & Export/Teilen",
            ]}
            isSelected={isCurrentPlan("SILBER")}
            onClick={() => {
              if (!user) setLoginModal(true);
              else handleUpgrade("SILBER");
            }}
            popular
            userData={userData}
          />

          {/* Gold */}
          <PlanCard
            title="Gold"
            price="15,99€/Monat"
            description={
              <span className="inline-flex items-center gap-2">
                So viel wie ein gutes Essen
                <Soup className="w-4 h-4 text-muted-foreground" />
              </span>
            }
            features={[
              "GPT-4.1",
              "Alle Silber-Features",
              "Video-Speicherung + Vorschau mit Zeitstempeln",
              "Zusätzliche Uploads (PDF, Bilder)",
            ]}
            isSelected={true}
            onClick={() => {
              if (!user) setLoginModal(true);
              else handleUpgrade("GOLD");
            }}
            userData={userData}
          />
        </div>

        {/* Credits (Add-on) */}
        <div className="max-w-xl mx-auto mt-16">
          <div className="rounded-xl border p-6 shadow-sm hover:shadow-xl transition ease-in border-gray-200">
            <h2 className="text-lg font-semibold text-primary">Credits</h2>
            <p className="text-3xl font-bold text-accent mt-2">5€ = 15 Stück</p>
            <p className="text-sm text-secondary mb-4">Einmalig, kein Abo</p>
            <ul className="space-y-1 text-sm text-muted-foreground mb-6">
              <li>• Zugriff auf Silber-Features</li>
              <li>• Ideal für unregelmäßige Nutzung</li>
            </ul>
            <Button
              className="w-full"
              onClick={() => {
                if (!user) setLoginModal(true);
                else handleCredits();
              }}
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
      </section>
      <VergleichSection />
    </>
  );
}

function PlanCard({
  title,
  price,
  description,
  features,
  isSelected,
  onClick,
  popular = false,
  userData,
}: {
  title: string;
  price: string;
  description: React.ReactNode;
  features: string[];
  isSelected: boolean;
  onClick: () => void;
  popular?: boolean;
  userData: User | null;
}) {
  return (
    <div
      className={`${
        popular ? "border-2 border-accent" : "border-gray-200"
      } relative rounded-xl border p-6 shadow-sm flex flex-col justify-between text-left hover:shadow-xl transition ease-in`}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="text-3xl font-bold text-accent">{price}</p>
        <p className="text-sm text-secondary">{description}</p>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {features.map((f, i) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      </div>
      <Button
        className="mt-6 w-full cursor-pointer"
        onClick={onClick}
        disabled={isSelected}
      >
        {isSelected
          ? title === "Gold"
            ? "Nicht Verfügbar"
            : "Aktive"
          : userData
          ? "Jetzt upgraden"
          : "Jetzt starten"}
      </Button>
      {popular && (
        <div className="absolute -top-5 -right-5 bg-accent text-white rounded-full py-2 px-4 pointer-events-none">
          Beliebt
        </div>
      )}
    </div>
  );
}
