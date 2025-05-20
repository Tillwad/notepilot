"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import UploadField from "@/components/UploadSection";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Hochladen...");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("Erfolgreich hochgeladen!");
    } else {
      setStatus("Fehlgeschlagen.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Datei hochladen</h1>
        <UploadField />
    </div>
  );
}
