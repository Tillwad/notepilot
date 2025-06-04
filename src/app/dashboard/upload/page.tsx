"use client";

import UploadField from "@/components/UploadSection";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";
import JobsSection from "@/components/JobsSection";
import { useRouter } from "next/navigation";

type User = {
  subscriptionType: string;
  credits?: number;
};

export default function UploadPage() {
  const { user } = useUser();
  const [userData, setUser] = useState<User | null>(null);
  const [jobRefreshTrigger, setJobRefreshTrigger] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUser = async () => {
    if (!user) return;

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();
    setUser(data);
  };

  const startPolling = (id: string) => {
    if (!id || id === "undefined") return;
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      if (document.visibilityState !== "visible") return;

      const res = await fetch(`/api/job/status?jobId=${id}`);
      const data = await res.json();

      if (data.status === "done") {
        localStorage.removeItem("activeJobId");
        clearInterval(pollingRef.current!);
        pollingRef.current = null;
      } else if (data.status === "error") {
        localStorage.removeItem("activeJobId");
        clearInterval(pollingRef.current!);
        pollingRef.current = null;
        alert("Fehler: " + (data.error || "Unbekannter Fehler"));
      } else if (data.status === "processing") {
        setJobRefreshTrigger((prev) => prev + 1);
      } else if (data.status === "pending") {
        setJobRefreshTrigger((prev) => prev + 1);
      } else if (data.status === "skipped") {
        localStorage.removeItem("activeJobId");
        clearInterval(pollingRef.current!);
        pollingRef.current = null;
        alert("Kein Credit - Datei wurde übersprungen.");
      }
    }, 5000);
  };

  const handleNewJob = (id: string) => {
    localStorage.setItem("activeJobId", id);
    startPolling(id);
    setJobRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetchUser();
    if (!user) return;
    const savedJobId =
      typeof window !== "undefined"
        ? localStorage.getItem("activeJobId")
        : null;
    if (savedJobId && savedJobId !== "undefined") {
      startPolling(savedJobId);
      return;
    }

    (async () => {
      const res = await fetch(`/api/job/status?userId=${user.id}`);
      const data = await res.json();
      if (data.status === "pending" || data.status === "processing") {
        localStorage.setItem("activeJobId", data.jobId);
        startPolling(data.jobId);
      }
    })();
  }, [user]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  if (!user)
    return (
      <div className="text-center mt-12 text-gray-500">Nicht eingeloggt.</div>
    );

  if (!userData)
    return (
      <div className="text-center mt-12 text-gray-500">
        Lade Benutzerdaten ...
      </div>
    );

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
          Lade eine Audio- oder Videodatei hoch, um sie automatisch
          transkribieren und analysieren zu lassen.
        </p>

        <UploadField onUploadSuccess={fetchUser} onNewJobId={handleNewJob} />
      </section>

      <section className="bg-white border rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Deine Transkriptionsjobs</h2>
        <JobsSection refreshKey={jobRefreshTrigger} />
      </section>
    </div>
  );
}
