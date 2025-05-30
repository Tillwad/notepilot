"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  title?: string | null;
  summary?: string | null;
  createdAt: Date;
  userId: string;
};

export default function NotesPage() {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    if (!user?.id) {
      return [];
    }

    try {
      const res = await fetch(`/api/data/notes?userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const notes: Note[] = await res.json();
      return notes;
    } catch (error) {
      console.error("Fehler beim Abrufen der Notizen:", error);
    }
  };

  useEffect(() => {
    fetchNotes().then((notes) => {
      setNotes(notes || []);
    });
  }, [user]);

  const handleDelete = async (noteId: string) => {
    if (!confirm("Bist du sicher, dass du diese Notiz löschen möchtest?")) {
      return;
    }
    try {
      await fetch("/api/data/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      });
    } catch (error) {
      console.error("Fehler beim Löschen der Notiz:", error);
    }

    alert("Notiz erfolgreich gelöscht.");
  };

  if (!user)
    return <p className="text-center mt-12 text-gray-500">Nicht eingeloggt.</p>;

  return (
    <main className="max-w-3xl mx-auto py-6 px-0 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Meine Notizen</h1>

      {notes.length === 0 ? (
        <p className="text-gray-600">Du hast noch keine Notizen erstellt.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note: Note) => (
            <div
              key={note.id}
              className="block bg-white border rounded-xl shadow-sm hover:shadow-md transition-all p-5 relative"
            >
              <Link
                href={`/dashboard/notes/${note.id}`}
                className="block"
                tabIndex={-1}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-lg text-gray-900">
                    {note.title || "Ohne Titel"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 z-10 cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      await handleDelete(note.id);
                      fetchNotes().then((notes) => setNotes(notes || []));
                    }}
                  >
                    <X className="inline-block min-w-4 h-4 rounded-full mr-1" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {note.summary?.slice(0, 120) ||
                    "Keine Zusammenfassung vorhanden"}
                  …
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Erstellt am:{" "}
                  {new Date(note.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
