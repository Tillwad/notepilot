import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  console.log("Feedback-API aufgerufen");

  try {
    const body = await req.json();
    const { comment, reason, mood } = body;

    console.log("Feedback-Daten:", { comment, reason, mood });

    if (!comment) {
      return NextResponse.json(
        { error: "Kommentar ist erforderlich." },
        { status: 400 }
      );
    }

    console.log("Feedback erhalten:", { comment, reason, mood });
    await resend.emails.send({
      from: "NotePilot Feedback <no-reply@feedback.notepilot.de>",
      to: ["till.wadehn@gmail.com"],
      subject: `Neues Feedback von der Goodbye-Seite`,
      html: `
    <h2>Feedback erhalten</h2>
    <p><strong>Grund:</strong> ${reason || "-"}</p>
    <p><strong>Stimmung:</strong> ${mood || "-"}</p>
    <p><strong>Kommentar:</strong><br/>${comment}</p>
  `,
      text: `Grund: ${reason || "-"}\nStimmung: ${mood || "-"}\nKommentar:\n${comment}`,
    });

    console.log("Feedback-E-Mail gesendet");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Feedback-Empfang:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
