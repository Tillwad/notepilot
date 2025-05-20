import { Suspense } from "react";
import CheckoutResultPage from "./client"; // siehe unten

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Lade...</div>}>
      <CheckoutResultPage />
    </Suspense>
  );
}
