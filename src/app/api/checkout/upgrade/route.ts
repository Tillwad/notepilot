import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/user";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await getUser(userId);
  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const plan = (url.searchParams.get("plan") || "BRONZE").toUpperCase();

  if (!["BRONZE", "SILBER", "GOLD"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let priceId: string | undefined;
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

  if (!userData.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 400 },
    );
  }

  const subscription = await stripe.subscriptions.retrieve(
    userData.stripeSubscriptionId,
  );

  // Gehe davon aus, dass es nur EIN Subscription-Item gibt
  const currentItemId = subscription.items.data[0].id;

  const session = await stripe.subscriptions.update(
    userData.stripeSubscriptionId,
    {
      items: [
        {
          id: currentItemId,
          deleted: true,
        },
        {
          price: priceId,
          quantity: 1,
        },
      ],
      proration_behavior: "create_prorations",
      collection_method: "charge_automatically",
    },
  );

  if (!session) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ status: 200 });
}
