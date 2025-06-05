"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutResultPage() {
  const params = useSearchParams();
  const router = useRouter();

  const success = params.get("success") === "true";
  const canceled = params.get("canceled") === "true";
  const redirect = params.get("redirect") || "/dashboard";

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (success || canceled) {
        router.push(redirect);
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, [success, canceled, router]);

  const handleManualRedirect = () => router.push(redirect);

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      {success && (
        <div className="space-y-4">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">
            Zahlung erfolgreich!
          </h1>
          <p className="text-secondary">
            Vielen Dank! Dein Konto wurde aktualisiert.
          </p>
        </div>
      )}

      {canceled && (
        <div className="space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">
            Zahlung abgebrochen
          </h1>
          <p className="text-secondary">Du kannst jederzeit erneut upgraden.</p>
        </div>
      )}

      {(success || canceled) && (
        <div>
          <p className="text-sm text-muted-foreground">
            Du wirst in wenigen Sekunden weitergeleitet ...
          </p>
          {success ? (
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleManualRedirect}
            >
              Weiter zu deinem Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleManualRedirect}
            >
              Zurück zur Startseite
            </Button>
          )}
        </div>
      )}

      {!success && !canceled && (
        <p className="text-sm text-muted-foreground">Lade Zahlungsstatus ...</p>
      )}
    </div>
  );
}
