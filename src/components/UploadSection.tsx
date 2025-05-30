"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";


export default function UploadField({ onUploadSuccess, onNewJobId }: { onUploadSuccess?: () => void, onNewJobId?: (jobId: string) => void }) {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/job/start", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Fehler beim Hochladen:", error);
      return;
    }

    const {jobId} = await res.json();
    
    setLoading(false);
    setFile(null);

    if (onNewJobId) onNewJobId(jobId);
    if (onUploadSuccess) onUploadSuccess();

  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpload();
            setLoading(true);
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
            <Upload className="w-4 h-4" />
            Hochladen
          </Button>
        </form>
    </div>
  );
}
