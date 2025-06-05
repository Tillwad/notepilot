"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function GoodbyePage() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const reasons = [
    "Ich komme vielleicht zurück",
    "Ich hatte technische Probleme",
    "Nicht das, was ich gesucht habe",
    "Zu teuer",
    "Ich habe eine Alternative gefunden",
  ];

  const moods = ["😡", "😕", "😐", "🙂", "🤩"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedReason || !selectedMood) {
      toast.error("Bitte wähle einen Grund und eine Stimmung aus.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      comment: formData.get("comment"),
      reason: formData.get("reason"),
      mood: formData.get("mood"),
    };

    console.log("Feedback-Daten:", payload);

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("API response status:", res.status);

    if (res.ok) {
      toast.success("Danke für dein Feedback!");
      router.push("/");
    } else {
      toast.error("Feedback konnte nicht gesendet werden.");
    }
  };

  return (
    <div className="min-h-[90vh] bg-white flex items-center justify-center px-4 py-12 text-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-gray-50 p-6 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-primary">
          Schade, dass du gehst!
        </h1>
        <p className="text-gray-600">
          Was hat dich dazu gebracht, deinen Account zu löschen?
        </p>

        {/* Gründe-Buttons */}
        <input type="hidden" name="reason" value={selectedReason} />
        <div className="flex flex-wrap gap-2 justify-center">
          {reasons.map((reason) => (
            <button
              type="button"
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedReason === reason
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Emoji-Abstimmung */}
        <input type="hidden" name="mood" value={selectedMood} />

        <div>
          <p className="text-sm text-gray-600 mb-2">
            Wie war dein Gesamteindruck?
          </p>
          <div className="flex justify-center gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`text-3xl ${
                  selectedMood === mood
                    ? "scale-125"
                    : "opacity-60 hover:opacity-100"
                } transition-transform`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Optionaler Kommentar */}
        <div className="text-left">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Möchtest du uns noch etwas mitgeben?
          </label>
          <textarea
            name="comment"
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Dein Feedback..."
          />
        </div>

        {/* Abschicken */}
        <button
          type="submit"
          className="w-full bg-primary text-white font-medium py-2 px-4 rounded hover:bg-primary/90 transition"
        >
          Feedback abschicken
        </button>

        <p className="text-xs text-gray-400">
          Danke, dass du NotePilot ausprobiert hast!
          <Heart className="inline-block w-4 h-4 text-accent ml-2" />
        </p>
      </form>
    </div>
  );
}
