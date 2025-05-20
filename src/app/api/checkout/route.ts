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

  const url = new URL(req.url); // <-- Zugriff auf Query-Params
  const redirectPath = url.searchParams.get("redirect") || "/dashboard";

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail gefunden");

  const user = await getUser(userId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID_SUB!,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?redirect=${redirectPath}&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?redirect=${redirectPath}&canceled=true`,
    ...(!user?.stripeCustomerId
      ? { customer_email: email }
      : { customer: user.stripeCustomerId }),
    metadata: {
      customerId: userId,
    },
  });

  return NextResponse.json({ url: session.url });
}
