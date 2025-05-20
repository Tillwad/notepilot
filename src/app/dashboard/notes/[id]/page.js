import { NoteDetailPage } from "./content";

export default function NoteDetailWrapper({ params }) {
  return <NoteDetailPage id={params.id} />;
}
