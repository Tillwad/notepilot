// src/app/api/webhook/route.ts
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed");
    const session = event.data.object as any;
    const stripeCustomerId = session.customer as string;
    const customerId = session.metadata.customerId;

    if (!customerId)
      return new Response("Missing customer ID", { status: 404 });

    const user = await prisma.user.findFirst({ where: { id: customerId } });
    if (!user) return new Response("User not found", { status: 404 });

    // Stripe-ID beim ersten Mal setzen
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }
    console.log("Subscription added to user:", user.id);

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (!lineItems || lineItems.data.length === 0) {
      return new Response("No line items found", { status: 404 });
    }

    const purchasedPriceId = lineItems.data[0]?.price?.id;
    if (!purchasedPriceId)
      return new Response("Missing purchased price ID", { status: 404 });

    console.log("Purchased Price ID:", purchasedPriceId);

    if (purchasedPriceId == process.env.STRIPE_PRODUCT_PRICE_ID_CRE) {
      // Gekauft: Credits
      console.log("Trying add Credits to user:", user.id);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { increment: 10 },
        },
      });
      console.log("Credits added to user:", user.id);
    } else if (purchasedPriceId == process.env.STRIPE_PRODUCT_PRICE_ID_SUB) {
      // Gekauft: Pro Abo
      await prisma.user.update({
        where: { id: user.id },
        data: {
          hasPaid: true,
        },
      });
    } else {
      console.log("Unknown product purchased:", purchasedPriceId);
      return new Response("Unknown product purchased", { status: 404 });
    }
  } else if (
    event.type === "customer.subscription.created"
  ) {
    console.log("Subscription event:", event.type);
    const subscription = event.data.object as any;
    const stripeCustomerId = subscription.customer as string;
    const status = subscription.status;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) return new Response("User not found", { status: 404 });

    // Stripe-ID beim ersten Mal setzen
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }
    console.log("Subscription added to user:", user.id);
    console.log("Subscription status:", status);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: status,
        subscriptionExpiresAt: currentPeriodEnd,
        hasPaid: status === "active" || status === "trialing",
      },
    });
  } else if (event.type === "customer.subscription.updated") {
    console.log("Subscription updated");
    const subscription = event.data.object as any;
    const stripeCustomerId = subscription.customer as string;

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) return new Response("User not found", { status: 404 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "canceled",
      },
    });
  }

  return new Response("ok");
}
