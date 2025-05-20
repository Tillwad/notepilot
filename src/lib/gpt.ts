// src/lib/gpt.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function processTranscript(transcript: string, user: { hasPaid: boolean; credits: number }): Promise<{
  title: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
}> {

  const model = user.hasPaid
    ? "gpt-4o"
    : user.credits > 0
      ? "gpt-3.5-turbo"
      : null;

  if (!model) {
    throw new Error("User has no payment or credits to use the service.");
  }

  const prompt = `
Du bist ein Meeting-Analyst. Analysiere das folgende Meeting-Transkript und extrahiere daraus vier Dinge:

1. Einen kurzen, prägnanten Titel des Meetings.
2. Eine professionelle Zusammenfassung des Gesprächsverlaufs.
3. Eine Liste aller getroffenen Entscheidungen.
4. Eine Liste aller To-Dos bzw. Aufgaben mit konkreter Formulierung.

ACHTUNG!: Gib das Ergebnis ausschließlich im folgenden JSON-Format zurück:

{
  "title": "string",
  "summary": "string",
  "decisions": ["string", "..."],
  "actionItems": ["string", "..."]
}

Hier ist das Transkript:
""" 
${transcript}
"""
`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const raw = completion.choices[0].message.content;

  if (!raw) throw new Error("No content returned from GPT");

  try {
    const parsed = JSON.parse(raw);

    return {
      title: parsed.title?.trim() || "Meeting-Notiz",
      summary: parsed.summary?.trim() || "",
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
    };
  } catch (err) {
    console.error("GPT returned invalid JSON:", raw);
    throw new Error("Fehler beim Parsen der GPT-Antwort.");
  }
}
