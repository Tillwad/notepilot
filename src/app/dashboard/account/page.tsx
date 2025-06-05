"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap, ShieldX } from "lucide-react";
import { toast } from "sonner";

type SubscriptionType = "FREE" | "BRONZE" | "SILBER" | "GOLD" | null;

type User = {
  id: string;
  hasPaid: boolean;
  credits: number;
  stripeSubscriptionId: string;
  subscriptionType: SubscriptionType;
  subscriptionExpiresAt: Date;
  subscriptionStatus: string; // e.g. active, canceled, past_due
  createdAt: Date;
};

const PLAN_OPTIONS = [
  {
    type: "BRONZE",
    label: "Bronze",
    priceId: process.env.STRIPE_BRONZE_PRICE_ID || null,
  },
  {
    type: "SILBER",
    label: "Silber",
    priceId: process.env.STRIPE_SILBER_PRICE_ID || null,
  },
  {
    type: "GOLD",
    label: "Gold",
    priceId: process.env.STRIPE_GOLD_PRICE_ID || null,
  },
];

export default function AccountPage() {
  const { user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchSubscription = async () => {
      if (!user) {
        timeoutId = setTimeout(fetchSubscription, 300);
        return;
      }

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (data) setUserData(data);
    };

    fetchSubscription();
    return () => timeoutId && clearTimeout(timeoutId);
  }, [user]);

  const handleSubscriptionAction = async (action: "cancel" | "reactivate") => {
    if (!userData) return;
    if (action === "cancel") {
      const confirmed = confirm("Möchtest du dein Abo wirklich kündigen?");
      if (!confirmed) return;
      const res = await fetch(
        `/api/checkout/update?action=${action}&userId=${userData.id}`,
        {
          method: "POST",
        }
      );
      if (res.ok) {
        alert("Abo wurde gekündigt.");
        window.location.reload();
      } else {
        alert("Fehler bei der Abo-Verwaltung.");
      }
    }

    if (action === "reactivate") {
      const confirmed = confirm("Möchtest du dein Abo wirklich reaktivieren?");
      if (!confirmed) return;
      const res = await fetch(
        `/api/checkout/update?action=${action}&userId=${userData.id}`,
        {
          method: "POST",
        }
      );
      if (res.ok) {
        alert("Abo wurde reaktiviert.");
        window.location.reload();
      } else {
        alert("Fehler bei der Abo-Verwaltung.");
      }
    }
  };

  const handleUpgrade = async (plantype: string) => {
    if (!userData) return;
    if (userData.subscriptionType === plantype) {
      return toast("Du hast bereits dieses Abo.");
    }

    setSelectedPlan(plantype);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan || !userData) return;

    setIsUpgrading(true);
    try {
      if (userData.subscriptionType === "FREE") {
        const res = await fetch(
          `/api/checkout?plan=${selectedPlan}&redirect=/dashboard/account`,
          { method: "POST" }
        );
        if (res.ok) {
          const { url } = await res.json();
          window.location.href = url;
        } else {
          console.error("Upgrade fehlgeschlagen:", res.statusText);
          toast.error("Upgrade fehlgeschlagen.");
        }
      } else {
        const res = await fetch(`/api/checkout/upgrade?plan=${selectedPlan}`, {
          method: "POST",
        });
        if (res.ok) {
          toast.success("Abo aktualisiert!");
          window.location.reload();
        } else {
          toast.error("Upgrade fehlgeschlagen.");
        }
      }
    } catch (err) {
      toast.error("Fehler beim Upgrade.");
    } finally {
      setIsUpgrading(false);
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (userData?.stripeSubscriptionId !== null) {
      toast.error(
        "Du musst dein Abo kündigen, bevor du deinen Account löschen kannst."
      );
      return;
    }
    setShowDeleteModal(true);
  };

  if (!userData) {
    return (
      <p className="text-center mt-8 text-gray-500">Lade Kontoinformationen…</p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 ">
      <h1 className="text-3xl font-bold mb-6">Dein Konto</h1>

      <div className="space-y-6">
        {/* Abo Info Section */}
        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap size={18} /> Abo-Informationen
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Aktuelles Abo:{" "}
            <strong>{userData.subscriptionType ?? "Kein Abo"}</strong>
          </p>
          {userData.subscriptionExpiresAt &&
            userData.subscriptionType !== "FREE" && (
              <p className="text-sm text-gray-600">
                Läuft ab am:{" "}
                <strong>
                  {new Date(userData.subscriptionExpiresAt).toLocaleDateString(
                    "de-DE"
                  )}
                </strong>
              </p>
            )}
          {userData.subscriptionStatus === "canceled" && (
            <Button
              className="mt-4"
              onClick={() => handleSubscriptionAction("reactivate")}
              variant="default"
            >
              Abo reaktivieren
            </Button>
          )}
          <div className="flex gap-4 mt-4 flex-wrap">
            {PLAN_OPTIONS.filter(
              (p) =>
                p.type !== userData.subscriptionType &&
                p.type !== "GOLD" &&
                p.type !== "BRONZE"
            ).map((plan) => (
              <Button
                key={plan.type}
                onClick={() => handleUpgrade(plan.type)}
                className="cursor-pointer"
              >
                Upgrade zu {plan.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Account löschen Section */}
        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-red-600">
            <ShieldX size={18} /> Gefährliche Section
          </h2>
          {userData.subscriptionStatus === "active" &&
            userData.stripeSubscriptionId && (
              <>
                <p className="text-sm text-gray-600 mt-2">
                  Wenn du deinen Abo kündigst, wird dein Account auf das
                  kostenlose Abo zurückgesetzt.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 color-red-600 border-red-600 hover:bg-red-0 text-destructive hover:text-destructive cursor-pointer"
                  onClick={() => handleSubscriptionAction("cancel")}
                >
                  Abo kündigen
                </Button>
              </>
            )}
          <p className="text-sm text-gray-600 mt-2">
            Wenn du deinen Account löschst, wird dein gesamtes Profil dauerhaft
            entfernt.
          </p>

          <Button
            variant="destructive"
            className="mt-4 cursor-pointer"
            onClick={handleDeleteAccount}
          >
            Account löschen
          </Button>
        </section>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Account wirklich löschen?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Dein gesamter Account wird dauerhaft entfernt. Diese Aktion kann
                nicht rückgängig gemacht werden.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                  onClick={async () => {
                    const res = await fetch("/api/user/delete", {
                      method: "DELETE",
                      body: JSON.stringify({ userId: user?.id }),
                      headers: { "Content-Type": "application/json" },
                    });

                    if (res.ok) {
                      setShowDeleteModal(false);
                      toast("Dein Account wurde gelöscht.");
                      router.push("/goodbye");
                    } else {
                      toast("Fehler beim Löschen des Accounts.");
                    }
                  }}
                >
                  Ja, löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpgradeModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Abo auf {selectedPlan} upgraden?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {userData.subscriptionType === "FREE"
                  ? "Du wirst zur Zahlung weitergeleitet." :
                   "Dein aktuelles Abo " + userData.subscriptionType + " wird auf " + selectedPlan + " aktualisiert."}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setSelectedPlan(null);
                  }}
                >
                  Abbrechen
                </button>
                <button
                  className="px-4 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90"
                  onClick={confirmUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? "Upgraden..." : "Upgrade bestätigen"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
