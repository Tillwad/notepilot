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
    const subscriptionType = session.metadata.selectedPlan;

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

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (!lineItems || lineItems.data.length === 0) {
      return new Response("No line items found", { status: 404 });
    }

    const purchasedPriceId = lineItems.data[0]?.price?.id;
    if (!purchasedPriceId)
      return new Response("Missing purchased price ID", { status: 404 });

    switch (purchasedPriceId) {
      case process.env.STRIPE_BRONZE_PRICE_ID:
        console.log("Bronze plan purchased");
        await prisma.user.update({
          where: { id: user.id },
          data: {
            hasPaid: true,
            subscriptionType: subscriptionType,
          },
        });
        break;
      case process.env.STRIPE_SILVER_PRICE_ID:
        console.log("Silver plan purchased");
        await prisma.user.update({
          where: { id: user.id },
          data: {
            hasPaid: true,
            subscriptionType: subscriptionType,
          },
        });
        break;
      case process.env.STRIPE_GOLD_PRICE_ID:
        console.log("Gold plan purchased");
        await prisma.user.update({
          where: { id: user.id },
          data: {
            hasPaid: true,
            subscriptionType: subscriptionType,
          },
        });
        break;
      case process.env.STRIPE_PRODUCT_PRICE_ID_CRE:
        console.log("Credits purchased");
        await prisma.user.update({
          where: { id: user.id },
          data: {
            hasPaid: true,
            credits: { increment: 15 },
          },
        });
        break;
      default:
        console.log("Unknown plan purchased");
    }
  } else if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as any;
    const stripeCustomerId = subscription.customer;
    const status = subscription.status;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    console.log("Subscription created:", subscription);

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) return new Response("User not found", { status: 404 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeProductId: subscription.items.data[0].price.product,
        subscriptionStatus: status,
        subscriptionExpiresAt: currentPeriodEnd,
      },
    });
  } else if (event.type === "customer.subscription.updated") {
    console.log("Subscription updated");
    const subscription = event.data.object as any;
    const stripeCustomerId = subscription.customer as string;
    const status = subscription.status;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    const priceId = subscription.items.data[0].price.id;

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) return new Response("User not found", { status: 404 });

    if (status === "active") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: status,
          subscriptionExpiresAt: currentPeriodEnd,
          subscriptionType: priceId === process.env.STRIPE_BRONZE_PRICE_ID
            ? "BRONZE" : "SILBER",
        },
      });
    }
    if (status === "past_due") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: status,
        },
      });
    }
    if (subscription.cancel_at_period_end) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "canceled",
        },
      });

      // customer email send:
    }
  } else if (event.type === "customer.subscription.deleted") {
    console.log("Subscription deleted");
    const subscription = event.data.object as any;
    const stripeCustomerId = subscription.customer as string;

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
    });
    if (!user) return new Response("User not found", { status: 404 });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: null,
        subscriptionStatus: "ended",
        hasPaid: false,
        subscriptionType: "FREE",
      },
    });
  }

  return new Response("ok");
}
