"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function CheckoutResultPage() {
  const params = useSearchParams();
  const router = useRouter();

  const success = params.get("success") === "true";
  const canceled = params.get("canceled") === "true";

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (success) {
        router.push("/");
      } else if (canceled) {
        router.push("/pricing");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [success, canceled, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      {success && (
        <div className="space-y-4">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">Zahlung erfolgreich!</h1>
          <p className="text-secondary">Vielen Dank! Dein Konto wurde aktualisiert.</p>
        </div>
      )}

      {canceled && (
        <div className="space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">Zahlung abgebrochen</h1>
          <p className="text-secondary">Du kannst jederzeit erneut upgraden.</p>
        </div>
      )}

      {(success || canceled) && (
        <p className="text-sm text-muted-foreground">Du wirst in wenigen Sekunden weitergeleitet ...</p>
      )}

      {!success && !canceled && (
        <p className="text-sm text-muted-foreground">Lade Zahlungsstatus ...</p>
      )}
    </div>
  );
}
