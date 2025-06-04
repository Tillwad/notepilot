"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, Zap } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import Link from "next/link";
import JobsSection from "@/components/JobsSection";

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<
    "FREE" | "BRONZE" | "SILBER" | "GOLD" | null
  >(null);
  const [credits, setCredits] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(false);
  const [subscriptionDate, setSubscriptionDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastJobs, setLastJobs] = useState<any[]>([]);
  const [upgrade, setUpgrade] = useState(true);
  const [status, setStatus] = useState<
    "active" | "canceled" | "past_due" | "ended"
  >("ended");
  const { user } = useUser();

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
      setSubscription(userData.subscriptionType);
      setCredits(userData.credits);
      setIsPaid(userData.hasPaid);
      setStatus(userData.subscriptionStatus || "ended");
      setSubscriptionDate(userData.subscriptionExpiresAt);
    };

    fetchSubscription();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  useEffect(() => {
    const fetchLastJobs = async () => {
      if (!user) return;
      const res = await fetch("/api/job/done?userId=" + user.id);
      if (!res.ok) {
        // console.error("Fehler beim Abrufen der letzten Jobs:", res.statusText);
        return;
      }
      const jobs = await res.json();
      if (!jobs || jobs.length === 0) {
        setLastJobs([]);
        return;
      }
      setLastJobs(jobs.slice(0, 3)); // Zeige die letzten 3 Jobs an
    };
    fetchLastJobs();
  }, [user]);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout?redirect=/dashboard", {
      method: "POST",
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(false);
  };

  const handleCredits = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout/credits?redirect=/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(false);
  };

  const totalCredits = subscription === "FREE" && isPaid ? 15 : 3;
  const percentUsed = (credits / totalCredits) * 100;

  return (
    <div className="max-w-3xl mx-auto py-6 px-0 mb:px-6 w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dein Dashboard</h1>
        <Badge
          variant="outline"
          className={
            subscription === "BRONZE" ||
            subscription === "SILBER" ||
            subscription === "GOLD"
              ? "text-green-600 border-green-500"
              : "text-purple-600 border-purple-500"
          }
        >
          {subscription === "BRONZE" ||
          subscription === "SILBER" ||
          subscription === "GOLD"
            ? "PRO-Nutzer"
            : "Kostenlos"}
        </Badge>
      </div>

      <div className="space-y-6">
        {upgrade && subscription !== "GOLD" && (
          <section className="relative bg-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setUpgrade(false)}
            />
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={18} />{" "}
              {(() => {
                switch (subscription) {
                  case "FREE":
                    return "Upgrade auf Bronze";
                  case "BRONZE":
                    return "Upgrade auf Silber";
                  case "SILBER":
                    return "Pro Features";
                  default:
                    return "Upgrade";
                }
              })()}
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Erhalte unbegrenzte Transkriptionen, schnelle Bearbeitung &amp;
              Prioritätssupport.
            </p>
            {subscription === "SILBER" ? (
              <Link href="/dashboard/upload">
                <Button variant="outline" className="cursor-pointer">
                  Jetzt starten
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? "Weiterleitung…" : "Jetzt upgraden"}
              </Button>
            )}
          </section>
        )}
        {subscription === "FREE" ? (
          <section className="relative bg-white border rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap size={18} /> Deine Nutzung
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Verbleibende Transkriptionen: <strong>{credits}</strong> von{" "}
              {totalCredits}
            </p>
            {/* <Progress value={percentUsed} className="mt-4 h-2" /> */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            {credits === 0 && (
              <Button
                onClick={handleCredits}
                disabled={loading}
                className="cursor-pointer mt-4"
              >
                {loading ? "Weiterleitung…" : "Credits aufladen"}
              </Button>
            )}
          </section>
        ) : (
          <section className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap size={18} /> Dein Abo
            </h2>

            {/* Subscription-Typ */}
            <p className="text-sm text-gray-600 mt-1">
              Aktives Abo:{" "}
              <strong>
                {subscription ? subscription : "Kein aktives Abo"}
              </strong>
            </p>

            {/* Ablaufdatum */}
            {subscriptionDate && (
              <div>
                <p className="text-sm text-gray-600">
                  {status === "active" ? "Erneuert am" : ""} Läuft ab am:{" "}
                  <strong>
                    {new Date(subscriptionDate).toLocaleDateString("de-DE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </strong>
                </p>
                {status === "past_due" && (
                  <p className="text-sm text-red-600 mt-2">
                    Dein Abo ist überfällig! Bitte aktualisiere deine
                    Zahlungsinformationen.
                  </p>
                )}
                {status === "canceled" && (
                  <div className="flex items-center justify-between ">
                    <p className="text-sm text-red-600 mt-2">
                      Dein Abo wurde gekündigt.
                    </p>
                    <Link href="/dashboard/upload">
                      <Button className="mt-2">Reaktiviren</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Upload size={18} /> Letzte Jobs
          </h2>
          {lastJobs.length === 0 ? (
            <p className="text-sm text-gray-600 mt-1">
              Keine Datei hochgeladen -{" "}
              <a
                href="/dashboard/upload"
                className="text-purple-600 hover:underline"
              >
                jetzt starten
              </a>
            </p>
          ) : (
            <JobsSection maxJobs={3} />
          )}
        </section>
      </div>
    </div>
  );
}
