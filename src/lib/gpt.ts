// src/lib/gpt.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

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
