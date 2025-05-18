// meetingnotegpt/src/app/jobs/page.tsx
import Link from "next/link";

export default async function NotesPage() {

  return (
    <div className="space-y-4">
      {/* {notes.map((note) => (
        <Link href={`/jobs/${note.id}`} key={note.id} className="block p-4 border rounded hover:bg-gray-50">
          <h2 className="text-lg font-semibold">{note.title}</h2>
          <p className="text-sm text-gray-500">{note.summary}</p>
        </Link>
      ))} */}
      <a>test</a>
    </div>
  );
}