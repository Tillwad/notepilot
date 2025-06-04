"use client";

import { useState } from "react";

export default function TranscriptBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  const limit = 600;
  const isLong = text.length > limit;
  const displayedText = expanded || !isLong ? text : text.slice(0, limit) + "…";

  return (
    <div>
      <pre className="flex flex-col bg-gray-50 border text-sm text-gray-800 p-4 rounded whitespace-pre-wrap  ">
        {displayedText}
      </pre>
      {isLong && (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-sm text text-accent mt-2 hover:underline cursor-pointer"
          >
            {expanded ? "Weniger anzeigen" : "Mehr lesen"}
          </button>
        </div>
      )}
    </div>
  );
}
