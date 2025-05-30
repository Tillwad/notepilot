// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getUser } from "@/lib/user";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const plan = (url.searchParams.get("plan") || "BRONZE").toUpperCase();
  const redirectPath = url.searchParams.get("redirect") || "/dashboard";

  if (!["BRONZE", "SILBER", "GOLD"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  var priceId: string | undefined;
  switch (plan) {
    case "SILBER":
      priceId = process.env.STRIPE_SILVER_PRICE_ID;
      break;
    case "GOLD":
      priceId = process.env.STRIPE_GOLD_PRICE_ID;
      break;
    default:
      priceId = process.env.STRIPE_BRONZE_PRICE_ID;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail gefunden");

  const user = await getUser(userId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?redirect=${redirectPath}&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?redirect=${redirectPath}&canceled=true`,
    ...(user.stripeCustomerId
      ? { customer: user.stripeCustomerId }
      : { customer_email: email }),
    client_reference_id: userId,
    metadata: {
      customerId: userId,
      selectedPlan: plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
