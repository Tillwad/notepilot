// /app/api/cancel-subscription/route.ts

import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // const { userId } = await auth();
  // if (!userId) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const action = url.searchParams.get("action")?.toLowerCase();
  const userId = url.searchParams.get("userId");
  if (!action || !userId) {
    return new Response("Missing action or userId", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.stripeSubscriptionId) {
    return new Response("Subscription not found", { status: 404 });
  }

  let result;
  switch (action) {
    case "cancel":
      result = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      break;
    case "reactivate":
      result = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
      break;
    default:
      return new Response("Invalid action", { status: 400 });
  }

  if (!result) {
    return new Response("Failed to update subscription", { status: 500 });
  }

  return new Response("Subscription updated", { status: 200 });
}
