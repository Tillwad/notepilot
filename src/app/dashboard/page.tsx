"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Upload, Zap } from "lucide-react";

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<"FREE" | "PRO" | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      // const res = await fetch("/api/user");
      // const data = await res.json();
      setSubscription("FREE");
      setCredits(3); // z. B. 3 verbleibende Transkriptions-Credits
    };
    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout?redirect=/dashboard", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(false);
  };

  const totalCredits = subscription === "PRO" ? 999 : 5;
  const usedCredits = totalCredits - credits;
  const percentUsed = (usedCredits / totalCredits) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dein Dashboard</h1>
        <Badge
          variant="outline"
          className={
            subscription === "PRO"
              ? "text-green-600 border-green-500"
              : "text-purple-600 border-purple-500"
          }
        >
          {subscription === "PRO" ? "PRO-Nutzer" : "Kostenlos"}
        </Badge>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-xl border p-6 shadow-sm">
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
        </section>

        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Upload size={18} /> Letzter Upload
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Keine Datei hochgeladen –{" "}
            <a
              href="/dashboard/upload"
              className="text-purple-600 hover:underline"
            >
              jetzt starten
            </a>
          </p>
        </section>

        {subscription === "FREE" && (
          <section className="bg-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={18} /> Upgrade auf PRO
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Erhalte unbegrenzte Transkriptionen, schnelle Bearbeitung &
              Prioritätssupport.
            </p>
            <Button onClick={handleUpgrade} disabled={loading}>
              {loading ? "Weiterleitung…" : "Jetzt upgraden"}
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}
