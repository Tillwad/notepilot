// app/api/webhook/clerk/route.ts
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = Object.fromEntries(req.headers);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(payload, headerPayload);
  } catch (err) {
    console.error("❌ Clerk Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  // Nur auf user.created reagieren
  if (eventType === "user.created") {
    const clerkId = data.id;

    try {
      await prisma.user.create({
        data: {
          id: clerkId,
        },
      });

      console.log("✅ Neuer User erstellt:", clerkId);
    } catch (err) {
      console.error("❌ Fehler beim Anlegen des Users:", err);
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
