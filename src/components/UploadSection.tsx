"use client";

import { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignIn, SignInButton, useUser } from "@clerk/nextjs";

export default function UploadField() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loginmodal, setLoginModal] = useState(false);
  //   const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      //   const ffmpegInstance = new FFmpeg();
      //   await ffmpegInstance.load();
      //   setFfmpeg(ffmpegInstance);
    };
    load();
  }, []);

  const handleTranscribe = async () => {
    if (!file /*|| !ffmpeg*/) {
      setStatus("Bitte wähle eine Datei aus.");
      return;
    }

    setStatus("Wird verarbeitet...");

    let audioBlob: Blob;

    if (file.type.startsWith("video/")) {
      //   await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      //   await ffmpeg.exec(["-i", "input.mp4", "-q:a", "0", "-map", "a", "output.mp3"]);
      //   const data = await ffmpeg.readFile("output.mp3");
      //   audioBlob = new Blob([data], { type: "audio/mp3" });
    } else {
      //   audioBlob = file;
    }

    audioBlob = file;

    const formData = new FormData();
    formData.append(
      "file",
      new File([audioBlob], "audio.mp3", { type: "audio/mp3" })
    );

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setStatus("Fehler bei der Transkription");
      return;
    }

    const { transcript } = await res.json();
    setStatus("🤖 ChatGPT verarbeitet das Protokoll...");

    const gptRes = await fetch("/api/process", {
      method: "POST",
      body: JSON.stringify({ transcript }),
      headers: { "Content-Type": "application/json" },
    });

    if (!gptRes.ok) {
      setStatus("❌ Fehler bei der GPT-Verarbeitung");
      return;
    }

    const { noteId } = await gptRes.json();
    setStatus("✅ Erfolgreich gespeichert!");
    router.push(`/notes/${noteId}`);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <form
        className="mt-8 mx-4 md:mx-0 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl z-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleTranscribe();
        }}
      >
        <input
          type="file"
          accept="audio/*,video/*"
          onClick={(e => {
            if (!user) {
              e.preventDefault();
              setLoginModal(true);
            }
          })}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setStatus(null);
            setTranscript(null);
          }}
          className="cursor-pointer w-full border rounded px-4 py-2 text-sm shadow-sm"
          disabled={status === "Wird verarbeitet..."}
        />
        <Button
          type="submit"
          disabled={
            !file ||
            status === "Wird verarbeitet..." ||
            status === "Fertig!"
          }
          className="flex gap-2 items-center"
        >
          <Upload className="w-4 h-4" />
          Hochladen
        </Button>
      </form>

      {loginmodal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setLoginModal(false)}
        >
          <div
            className=""
            onClick={e => e.stopPropagation()}
          >
            <SignIn />
          </div>
        </div>)}

      {status && <p className="text-sm text-gray-600">{status}</p>}

      {transcript && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded w-full max-w-xl whitespace-pre-wrap text-left text-sm text-gray-800 dark:text-gray-200">
          {transcript}
        </pre>
      )}
    </div>
  );
}
