// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID_SUB!, // Get this from Stripe Dashboard
        quantity: 1,
      },
    ],
    mode: "subscription", // or 'subscription'
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    ...(user.stripeCustomerId && { customer: user.stripeCustomerId }),
    metadata: {
      customerId: userId, // <-- Clerk-User-ID hier rein!
    },
  });

  return NextResponse.json({ url: session.url });
}
