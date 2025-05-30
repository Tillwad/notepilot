import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import TranscriptBlock from "@/components/notes/TranscriptBlock";
import TodoChecklist from "@/components/notes/TodoCheckList";
import EventChecklist from "@/components/notes/EventSection";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Mic2, Calendar } from "lucide-react";

export default async function NoteDetailPage({ id }: { id: string }) {
  const { userId } = await auth();
  if (!userId)
    return <p className="text-center mt-12 text-gray-500">Nicht eingeloggt.</p>;

  const note = await prisma.note.findFirst({
    where: { id: id, userId },
    include: {
      todos: true,
      eventItems: true, // `actionItems` enthält jetzt alle Todos
    },
  });

  if (!note) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-6 px-0 md:px-6 space-y-6">
      {/* Titel */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meeting</h1>
        <Badge variant="outline" className="text-accent border-accent">
          {note.createdAt.toLocaleDateString() ===
          new Date().toLocaleDateString()
            ? note.createdAt.toLocaleString()
            : note.createdAt.toLocaleDateString()}
        </Badge>
      </div>

      <section className="bg-white border rounded-xl shadow-sm p-6 gap-4 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {note.title || "Unbenannte Notiz"}
        </h1>

        {/* Zusammenfassung */}
        {note.summary && (
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              Beschreibung
            </p>
            <p className="text-gray-700">{note.summary}</p>
          </div>
        )}
      </section>

      {/* Entscheidungen */}
      {note.decisions.length > 0 && (
        <section className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FileText className="mr-2"/>

          <h2 className="text-lg font-semibold text-gray-800">
            Entscheidungen 
          </h2>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {note.decisions.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* To-Dos mit Checkboxen */}
      {note.todos.length !== 0 && (
        <section className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
            <CheckCircle className="mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">To-Dos</h2>
            </div>
          <TodoChecklist todos={note.todos} />
        </section>
      )}

      {/* Ereignisse */}
      {note.eventItems.length > 0 && (
        <section className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Calendar className="mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Ereignisse
          </h2>
          </div>
          {/* Hier
          {/* <ul className="list-disc list-inside text-gray-700">
            {note.eventItems.map((event: any, i: number) => (
              <li key={i}>
                <strong>{event.title}</strong>
                {event.location && ` (${event.location})`}
                {event.date &&
                  ` am ${new Date(event.date).toLocaleDateString()}`}
                {event.time && ` um ${event.time}`}
              </li>
            ))}
          </ul> */}
          <EventChecklist events={note.eventItems} />
        </section>
      )}

      {/* Transkript mit "Mehr lesen"-Funktion */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Mic2 className="mr-2" />
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Originales Transkript
        </h2>
        </div>
        <TranscriptBlock text={note.transcript} />
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-8">
        {note.createdAt.toLocaleString()} | Erstellt von dir
      </footer>
    </main>
  );
}
