// src/app/notes/[id]/page.tsx
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return <p className="text-center">Nicht eingeloggt.</p>;

  const note = await prisma.note.findFirst({
    where: { id: params.id, userId },
  });

  if (!note) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <div>
        <h2 className="font-semibold">Zusammenfassung</h2>
        <p>{note.summary}</p>
      </div>
      <div>
        <h2 className="font-semibold">Entscheidungen</h2>
        <ul className="list-disc list-inside">
          {note.decisions.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">To-Dos</h2>
        <ul className="list-disc list-inside">
          {note.actionItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">Originales Transkript</h2>
        <pre className="bg-gray-100 p-4 whitespace-pre-wrap text-sm">{note.transcript}</pre>
      </div>
    </div>
  );
}