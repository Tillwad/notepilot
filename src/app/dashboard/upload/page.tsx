"use client";

import UploadField from "@/components/UploadSection";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";
import JobsSection from "@/components/JobsSection";

type User = {
  subscriptionType: string;
  credits?: number;
};

export default function UploadPage() {
  const { user } = useUser();
  const [userData, setUser] = useState<User | null>(null);
  const [jobRefreshTrigger, setJobRefreshTrigger] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Lade aktuelle User-Daten
  const fetchUser = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Fehler beim Laden des Benutzers:", err);
    }
  };

  // Stoppe aktives Polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Frische Jobs und Benutzer neu auf
  const refreshJobsAndUser = () => {
    setJobRefreshTrigger((prev) => prev + 1);
    fetchUser();
  };

  // Status-Verarbeitung
  const handleJobStatus = (status: string, data: any) => {
    switch (status) {
      case "done":
      case "error":
      case "skipped": {
        stopPolling();
        localStorage.removeItem("activeJobId");
        refreshJobsAndUser();
        if (status === "error") alert("Fehler: " + (data.error || "Unbekannter Fehler"));
        if (status === "skipped") alert("Kein Credit – Datei wurde übersprungen.");
        break;
      }
      case "processing":
      case "pending": {
        refreshJobsAndUser();
        break;
      }
    }
  };

  // Starte Polling
  const startPolling = (jobId: string) => {
    if (!jobId || jobId === "undefined") return;
    stopPolling();

    pollingRef.current = setInterval(async () => {
      if (document.visibilityState !== "visible") return;

      try {
        const res = await fetch(`/api/job/status?jobId=${jobId}`);
        const data = await res.json();
        handleJobStatus(data.status, data);
      } catch (err) {
        console.error("Polling-Fehler:", err);
        stopPolling();
      }
    }, 5000);
  };

  // Wird aufgerufen, sobald ein neuer Job erstellt wurde
  const handleNewJob = (id: string) => {
    localStorage.setItem("activeJobId", id);
    startPolling(id);
  };

  // Lade User beim Start
  useEffect(() => {
    fetchUser();
  }, [user]);

  // Wiederaufnahme von aktiven Jobs beim Reload
  useEffect(() => {
    const jobId = localStorage.getItem("activeJobId");
    if (jobId && jobId !== "undefined") {
      startPolling(jobId);
    }
  }, []);

  // Aufräumen bei Unmount
  useEffect(() => stopPolling, []);

  if (!user)
    return <div className="text-center mt-12 text-gray-500">Nicht eingeloggt.</div>;

  if (!userData)
    return <div className="text-center mt-12 text-gray-500">Lade Benutzerdaten ...</div>;

  return (
    <div className="max-w-3xl mx-auto py-6 px-0 mb:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Datei Hochladen</h1>
        <Badge variant="outline" className="text-purple-600 border-purple-500">
          {userData.subscriptionType === "FREE"
            ? `Credits: ${userData.credits ?? 0}`
            : userData.subscriptionType}
        </Badge>
      </div>

      <section className="bg-white border rounded-xl shadow-sm p-6">
        <p className="text-sm text-gray-600 mb-4">
          Lade eine Audio- oder Videodatei hoch, um sie automatisch transkribieren und analysieren zu lassen.
        </p>

        <UploadField
          onUploadSuccess={fetchUser}
          onUploadError={fetchUser}
          onNewJobId={handleNewJob}
        />
      </section>

      <section className="bg-white border rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Deine Transkriptionsjobs</h2>
        <JobsSection refreshKey={jobRefreshTrigger} />
      </section>
    </div>
  );
}
