// /app/api/cancel-subscription/route.ts

import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  console.log("Cancel subscription for user:", userId);

  // Fetch user subscription from DB
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.stripeSubscriptionId) {
    return new Response("Subscription not found", { status: 404 });
  }

  // Cancel subscription
  await stripe.subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: true, // or set to false to cancel immediately
  });

  return new Response("Subscription cancellation scheduled", { status: 200 });
}
