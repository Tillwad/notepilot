"use client";
import { SignUp } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="h-[90vh] max-w-2xl mx-auto py-12 px-6 flex flex-col items-center">
      <SignUp signInUrl="/sign-in" forceRedirectUrl={"/start"} />

      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
        <svg
          className="relative block w-full h-20 text-accent rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </main>
  );
}
