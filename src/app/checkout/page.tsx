import { Suspense } from "react";
import CheckoutResultPage from "./client"; // siehe unten

export default function Page() {
  return (
    <Suspense>
      <CheckoutResultPage />
    </Suspense>
  );
}
