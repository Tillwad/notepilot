"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function StartPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      setLoading(true);
      if (!user) {
        console.error("Benutzer ist nicht geladen oder existiert nicht");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (res.status === 404) {
          const createRes = await fetch("/api/user/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
            }),
          });

          if (!createRes.ok) {
            throw new Error("Fehler beim Erstellen des Benutzers");
          }

          router.push("/dashboard");
          return;
        }

        if (!res.ok) {
          throw new Error("Fehler beim Abrufen der Benutzerdaten");
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Fehler:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchOrCreateUser();
    }
  }, [user, isLoaded, router]);

  return (
    <main className="min-h-[90vh] flex items-center justify-center bg-white px-4">
      {loading ? "Lade..." : "Weiterleitung..."}
    </main>
  );
}
