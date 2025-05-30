// src/lib/gpt.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function processTranscript(transcript: string, user: { hasPaid: boolean; credits: number }): Promise<{
  title: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  eventsItems: {
    title: string;
    location?: string;
    date?: string;
    time?: string;
  }[];
}> {

  // const model = user.hasPaid
  //   ? "gpt-4o"
  //   : user.credits > 0
  //     ? "gpt-3.5-turbo"
  //     : null;

  const model = "gpt-3.5-turbo";

  if (!model) {
    throw new Error("User has no payment or credits to use the service.");
  }

const prompt = `
Du bist ein hochqualifizierter Meeting-Analyst.

Analysiere das folgende Meeting-Transkript und extrahiere präzise und strukturiert die folgenden Informationen:

1. **Titel** - Ein kurzer, prägnanter Titel, der den Inhalt des Meetings gut zusammenfasst.
2. **Zusammenfassung** - Eine professionelle, sachliche Zusammenfassung des Gesprächsverlaufs in 2-5 Sätzen.
3. **Entscheidungen** - Eine Liste aller klar getroffenen Entscheidungen.
4. **Aufgaben** - Eine Liste konkreter To-Dos mit aktiven Formulierungen ("Erstelle...", "Schicke...", "Bereite vor...").
5. **Events** - Eine Liste aller besprochenen Termine oder zeitlich relevanten Ereignisse im folgenden Format:
\`\`\`ts
{
  "title": "string",       // Titel des Events
  "location": "string",    // Optional, falls vorhanden
  "date": "YYYY-MM-DD",    // Im ISO-Format
  "time": "HH:MM"          // Optional, falls erwähnt
}
\`\`\`

ACHTUNG: Gib das **komplette Ergebnis ausschließlich im folgenden JSON-Format** zurück - kein Freitext, keine Erklärungen:

\`\`\`json
{
  "title": "string",
  "summary": "string",
  "decisions": ["string", "..."],
  "actionItems": ["string", "..."],
  "events": [
    {
      "title": "string",
      "location": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM"
    }
  ]
}
\`\`\`

Hier ist das Meeting-Transkript:
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
    const jsonString = extractJsonContent(raw);
    const parsed = JSON.parse(jsonString);

    console.log("Parsed JSON:", parsed);

    return {
      title: parsed.title?.trim() || "Meeting-Notiz",
      summary: parsed.summary?.trim() || "",
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      eventsItems: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch (err) {
    console.error("GPT returned invalid JSON:", raw);
    throw new Error("Fehler beim Parsen der GPT-Antwort.");
  }
}

function extractJsonContent(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return match ? match[1] : text;
}


export async function processTranscriptWithGPT(transcript: string): Promise<{
  title: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  eventsItems: {
    title: string;
    location?: string;
    date?: string;
    time?: string;
  }[];
}> {
  const systemPrompt = `
Du bist ein Assistent, der Meeting-Transkripte in strukturierte Notizen verwandelt. 
Bitte analysiere den folgenden Text und liefere die Ergebnisse als JSON-Objekt mit den Feldern:
- "title": kurze Überschrift des Meetings
- "summary": prägnante Zusammenfassung (max. 3 Sätze)
- "decisions": Liste wichtiger Entscheidungen
- "todos": Liste konkreter ToDos
- "events": Liste von Terminen oder Ereignissen mit Titel, optionalem Ort, Datum (YYYY-MM-DD) und optionaler Uhrzeit (HH:MM)
Sprich Deutsch und sei konkret.
`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: transcript },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.5,
    response_format: { type: "json_object" }, // GPT-4o / gpt-4-turbo only
  });

  const json = JSON.parse(completion.choices[0].message.content!);

  return {
    title: json.title || "Meeting",
    summary: json.summary || "",
    decisions: json.decisions || [],
    actionItems: json.todos || [],
    eventsItems: json.events || [],
  };
}
