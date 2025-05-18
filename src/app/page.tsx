"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function UploadPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const handleTranscribe = async () => {
    if (!file) return;
    setStatus("Wird verarbeitet...");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setStatus("Fehler bei der Transkription");
      return;
    }

    const data = await res.json();
    setTranscript(data.transcript);
    setStatus("Fertig!");
  };

  if (!user) {
    return <p className="text-center">Bitte logge dich ein, um fortzufahren.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)}  disabled={status === "Wird verarbeitet..."}/>
      <button
        onClick={handleTranscribe}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!file || status === "Wird verarbeitet..."}
      >
        Transkribieren
      </button>
      {status && <p>{status}</p>}
      {transcript && (
        <pre className="bg-gray-100 p-4 rounded w-full whitespace-pre-wrap text-left">
          {transcript}
        </pre>
      )}
    </div>
  );
}