import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { subDays } from "date-fns";

export async function GET() {
  const oneDayAgo = subDays(new Date(), 1);

  // Hole alle Benutzer mit mehr als 3 Jobs
  const usersWithManyJobs = await prisma.user.findMany({
    where: {
      jobs: {
        some: {}, // nur User mit mindestens einem Job
      },
    },
    select: {
      id: true,
      _count: {
        select: { jobs: true },
      },
    },
  });

  const userIds = usersWithManyJobs
    .filter((u) => u._count.jobs > 3)
    .map((u) => u.id);

  if (userIds.length === 0) {
    return NextResponse.json({ deleted: 0, reason: "No users with >3 jobs" });
  }

  // Finde alle alten Jobs dieser Nutzer
  const expired = await prisma.transcriptionJob.findMany({
    where: {
      userId: { in: userIds },
      createdAt: { lt: oneDayAgo },
      status: "done",
    },
  });

  for (const job of expired) {
    if (job.filePath?.startsWith("https://blob.vercel-storage.com/")) {
      try {
        await del(new URL(job.filePath).pathname);
      } catch (err) {
        console.error("Fehler beim Löschen von Blob:", err);
      }
    }

    await prisma.transcriptionJob.delete({ where: { id: job.id } });
  }

  return NextResponse.json({ deleted: expired.length });
}
