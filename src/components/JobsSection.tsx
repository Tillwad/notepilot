"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, ListRestart } from "lucide-react";
import Link from "next/link";

type Job = {
  id: string;
  status: "pending" | "processing" | "done" | "error" | "skipped";
  createdAt: string;
  noteId?: string;
  transcript?: string;
};

// Helper to slice jobs array based on maxJobs prop
function getVisibleJobs(jobs: Job[], maxJobs?: number) {
  if (typeof maxJobs === "number" && maxJobs > 0) {
    return jobs.slice(0, maxJobs);
  }
  return jobs;
}

export default function JobsSection({
  maxJobs,
  refreshKey,
}: {
  maxJobs?: number;
  refreshKey?: number;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/job/done`);
      const data = await res.json();
      const maxj = getVisibleJobs(data, maxJobs);
      setJobs(maxj);
    } catch (err) {
      // console.error("Fehler beim Laden der Jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [refreshKey]);

  const statusIcon = (status: Job["status"]) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "done":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "skipped":
        return <ListRestart className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="mt-0">
      {loading ? (
        <p className="text-gray-500 text-sm">Lade Transkriptionsjobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Noch keine Upload-Jobs vorhanden.
        </p>
      ) : (
        <ul className="space-y-3">
          {jobs.length > 0 &&
            jobs.map((job) => (
              <li
                key={job.id}
                className={`flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded p-3 transition ${
                  job.status === "done"
                    ? "cursor-pointer hover:bg-gray-100"
                    : "cursor-default opacity-70"
                }`}
              >
                {job.status === "done" && job.noteId ? (
                  <Link
                    href={`/dashboard/notes/${job.noteId}`}
                    className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full"
                  >
                    <span className="font-medium">
                      {job.transcript
                        ? job.transcript.slice(0, 30)
                        : "Untitled"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 md:mt-0">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleString("de-DE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                    <span className="ml-0 md:ml-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700 flex items-center gap-1">
                      {statusIcon(job.status)}
                      Fertig
                    </span>
                  </Link>
                ) : job.status === "skipped" ? (
                  <Link
                    href={`/dashboard/upload`}
                    className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full"
                    onClick={() => {
                      if (job.status === "skipped" || job.status === "error") {
                        fetch(`/api/job/start?jobId=${job.id}`, {
                          method: "POST",
                        })
                          .then(() => fetchJobs())
                          .catch((err) =>
                            console.error(
                              "Fehler beim Neustarten des Jobs:",
                              err,
                            ),
                          );
                      }
                    }}
                  >
                    <span className="font-medium">
                      {job.transcript
                        ? job.transcript.slice(0, 30)
                        : "Click um Job neu zu starten"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 md:mt-0">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleString("de-DE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                    <span className="ml-0 md:ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-black flex items-center gap-1">
                      {statusIcon(job.status)}
                      Skipped
                    </span>
                  </Link>
                ) : (
                  <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full">
                    <span className="font-medium">
                      {job.status === "pending" || job.status === "processing"
                        ? "Transkription läuft..."
                        : "Fehler beim Transkribieren"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 md:mt-0">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleString("de-DE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                    <span
                      className={`ml-0 md:ml-2 text-xs px-2 py-1 rounded ${
                        job.status === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      } flex items-center gap-1`}
                    >
                      {statusIcon(job.status)}
                      {job.status === "error" ? "Fehler" : job.status}
                    </span>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
