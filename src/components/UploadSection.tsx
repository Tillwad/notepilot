"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";

export default function UploadField({
  onUploadSuccess,
  onUploadError,
  onNewJobId,
}: {
  onUploadSuccess?: () => void;
  onUploadError?: () => void;
  onNewJobId?: (jobId: string) => void;
}) {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });

      if (!blob.url) {
        throw new Error("Upload abgeschlossen, aber url fehlt.");
      }

      const res = await fetch("/api/job/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blobUrl: blob.url,
        }),
      });

      if (!res.ok) {
        throw new Error("Fehler beim Starten des Jobs: " + res.statusText);
      }
      const { jobId } = await res.json();

      fetch("/api/worker/transcription");

      setFile(null);
      if (onNewJobId) onNewJobId(jobId);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload fehlgeschlagen:", err);
      if (onUploadError) onUploadError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="mt-8 mx-4 md:mx-0 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl"
      >
        <input
          type="file"
          accept="audio/*,video/*,.m4a,.mp3,.mp4,.wav"
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
            }
          }}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="cursor-pointer w-full border rounded px-4 py-2 text-sm shadow-sm"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={!file || loading}
          className="flex gap-2 items-center"
        >
          {!loading ? (
            <Upload className="w-4 h-4" />
          ) : (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          )}
          Hochladen
        </Button>
      </form>
    </div>
  );
}
