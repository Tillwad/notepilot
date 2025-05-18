
import { notFound } from "next/navigation";

export default async function NoteDetailPage() {

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">test</h1>
      <p className="text-gray-700 whitespace-pre-wrap">test</p>
      {/* Option to edit or delete */}
    </div>
  );
}