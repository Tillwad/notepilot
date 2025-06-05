// src/app/api/webhook/route.ts
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { clerkClient } from "@clerk/nextjs/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY!);

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
          subscriptionType:
            priceId === process.env.STRIPE_BRONZE_PRICE_ID
              ? "BRONZE"
              : "SILBER",
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

      const clerk = await clerkClient();
      const userClerk = await clerk.users.getUser(user.id);
      if (!userClerk) return new Response("Clerk user not found", { status: 404 });

      userClerk.emailAddresses.forEach(async (email) => {
        await resend.emails.send({
          from: "NotePilot <no-reply@feedback.notepilot.de>",
          to: email.emailAddress,
          subject: "Schade, dass du gehst - Erneuere dein NotePilot-Abo",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background: #f5f7fa; padding: 24px 0; text-align: center;">
          <img src="https://notepilot.de/logo.png" alt="NotePilot Logo" style="height: 48px;"/>
              </div>
              <div style="padding: 24px;">
          <h2 style="color: #222;">Schade, dass du dein Abo gekündigt hast</h2>
          <p>Hallo ${userClerk.firstName || "Nutzer"},</p>
          <p>Wir haben deine Kündigung erhalten und finden es schade, dich als Nutzer zu verlieren.</p>
          <p>Falls du es dir anders überlegst, kannst du dein NotePilot-Abonnement jederzeit ganz einfach <a href="https://notepilot.de/dashboard/account" style="color: #0070f3;">hier erneuern</a>.</p>
          <p>Vielen Dank, dass du NotePilot genutzt hast!</p>
          <p>Herzliche Grüße,<br/>Dein NotePilot-Team</p>
              </div>
            </div>
          `,
          text: `Hallo ${userClerk.firstName || "Nutzer"},\n\nWir haben deine Kündigung erhalten und finden es schade, dich als Nutzer zu verlieren.\n\nFalls du es dir anders überlegst, kannst du dein NotePilot-Abonnement jederzeit ganz einfach hier erneuern: https://notepilot.de/dashboard/account\n\nVielen Dank, dass du NotePilot genutzt hast!\n\nHerzliche Grüße,\nDein NotePilot-Team`,
        });
      });
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
