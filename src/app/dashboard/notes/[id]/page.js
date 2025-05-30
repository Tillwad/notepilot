"use server";
import NoteDetailPage from "./content";

export default async function NoteDetailWrapper({ params }) {
  return <NoteDetailPage id={params.id} />;
}
