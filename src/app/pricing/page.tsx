"use client";

import { Button } from "@/components/ui/button";
import { SignIn, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GiDonerKebab } from "react-icons/gi";
import VergleichSection from "@/components/VergleichSection";
import {
  Check,
  Rocket,
  Video,
  ListTodo,
  FileAudio,
  Soup,
  Coffee,
  Infinity,
  Share,
  CreditCard,
  CalendarOff,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    title: "Bronze",
    price: "1,99€/Monat",
    description: (
      <span className="inline-flex items-center gap-2">
        So viel wie ein großer Kaffee
        <Coffee className="w-4 h-4 text-muted-foreground" />
      </span>
    ),
    features: [
      { label: "GPT 3.5 turbo", icon: Sparkles, },
      { label: "Unbegrenzte Audio-Uploads", icon: FileAudio },
      { label: "Themen-, ToDo- und Eventlisten", icon: ListTodo },
    ],
    planId: "BRONZE",
    popular: false,
    enabled: false, // aktuell deaktiviert
  },
  {
    title: "Silber",
    price: "7,99€/Monat",
    description: (
      <span className="inline-flex items-center gap-2">
        So viel wie ein Döner
        <GiDonerKebab className="w-6 h-6 text-muted-foreground" />
      </span>
    ),
    features: [
      { label: "GPT-4o", icon: Sparkles },
      { label: "Unbegrenzter Audio-/Video-Upload", icon: Infinity },
      { label: "Themen-, ToDo- und Eventlisten", icon: ListTodo },
      { label: "Listen & Export/Teilen", icon: Share },
    ],
    planId: "SILBER",
    popular: true,
    enabled: true, // <— zum späteren Ein-/Ausblenden
  },
  {
    title: "Gold",
    price: "15,99€/Monat",
    description: (
      <span className="inline-flex items-center gap-2">
        So viel wie ein gutes Essen
        <Soup className="w-5 h-5 text-muted-foreground" />
      </span>
    ),
    features: [
      { label: "GPT-4.1", icon: Sparkles },
      { label: "Alle Silber-Features", icon: Check },
      { label: "Video-Speicherung + Vorschau", icon: Video },
      { label: "PDF- und Bild-Uploads", icon: FileAudio },
    ],
    planId: "GOLD",
    popular: false,
    enabled: false, // aktuell deaktiviert
  },
  {
    title: "Credits",
    price: "5€ = 15 Stück",
    description: (
      <span className="inline-flex items-center gap-2">
        Einmalig, kein Abo
      </span>
    ),
    features: [
      { label: "Zugriff auf Silber-Features", icon: Check },
      { label: "Ideal für unregelmäßige Nutzung", icon: ListTodo },
      { label: "Keine monatlichen Kosten", icon: CalendarOff },
      { label: "Einfach per Kreditkarte", icon: CreditCard },
    ],
    planId: "CREDITS",
    popular: false,
    enabled: true, // damit sie angezeigt wird
    isCredit: true, // <— Sondermarkierung für Button-Handling
  }
];

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
  const router = useRouter();

  const [userData, setUserData] = useState<User>({
    id: "",
    hasPaid: false,
    credits: 0,
    subscriptionId: "",
    subscriptionType: null,
    subscriptionExpiresAt: new Date(),
    subscriptionStatus: "",
    createdAt: new Date(),
  });
  const [loginmodal, setLoginModal] = useState(false);

  // Lade Benutzerdaten (z. B. aus deiner eigenen DB)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json();
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
      } finally {
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpgrade = async (plan: string) => {
    if (!userData) return;
    const endpoint = userData.hasPaid
      ? `/api/checkout/upgrade?plan=${plan}`
      : `/api/checkout?plan=${plan}&redirect=/pricing`;

    const res = await fetch(endpoint, { method: "POST" });
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

        <div className="max-w-6xl mx-auto w-full px-4">
        <div className="flex flex-col lg:flex-row gap-10 justify-center items-stretch">
  {plans
    .filter((plan) => plan.enabled)
    .map((plan) => (
      <div key={plan.planId} className="w-full lg:w-1/2 h-full">
        <PlanCard
          title={plan.title}
          price={plan.price}
          description={plan.description}
          features={plan.features}
          isSelected={isCurrentPlan(plan.planId as SubscriptionType)}
          onClick={() => {
            if (!user) return setLoginModal(true);
            if (plan.isCredit) handleCredits();
            else handleUpgrade(plan.planId);
          }}
          popular={plan.popular}
          userData={userData}
        />
      </div>
    ))}
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
      {/* <VergleichSection /> */}
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
  features: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  isSelected: boolean;
  onClick: () => void;
  popular?: boolean;
  userData: User | null;
}) {
  return (
    <div
      className={`${
        popular ? "border-2 border-accent" : "border-gray-200"
      } h-full relative rounded-xl border p-6 shadow-sm flex flex-col justify-between text-left hover:shadow-xl transition ease-in`}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="text-3xl font-bold text-accent">{price}</p>
        <p className="text-sm text-secondary">{description}</p>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {features.map(({ label, icon: Icon }, i) => (
            <li key={i} className="flex items-center gap-2">
              <Icon className="w-4 h-4" /> {label}
            </li>
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
    : title === "Credits"
    ? "Credits kaufen"
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
