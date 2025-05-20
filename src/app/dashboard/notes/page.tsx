import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user";

type Note = {
  id: string;
  title?: string | null;
  summary?: string | null;
  createdAt: Date;
  userId: string;
};

export default async function NotesPage() {
  const { userId } = await auth();
  if (!userId) return <p className="text-center">Nicht eingeloggt.</p>;
  const user = await getUser(userId);

  const notes: Note[] = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Meine Notizen</h1>
      <p>User has paied: {user?.hasPaid ? "True" : "False"}</p>
      <p>Users credits: {user?.credits}</p>
      {notes.length === 0 && <p>Du hast noch keine Notizen erstellt.</p>}
      {notes.map((note: Note) => (
        <Link key={note.id} href={`/dashboard/notes/${note.id}`} className="block p-4 border rounded hover:bg-gray-50">
          <h2 className="font-semibold text-lg">{note.title || "(Kein Titel)"}</h2>
          <p className="text-sm text-gray-500">{note.summary?.slice(0, 100)}...</p>
        </Link>
      ))}
    </div>
  );
}