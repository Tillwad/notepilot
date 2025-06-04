import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const userId = searchParams.get("userId");

  if (!jobId) {
    // return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    if (!userId) {
      return NextResponse.json(
        { error: "Missing jobId or userId" },
        { status: 400 },
      );
    } else {
      // Wenn nur userId angegeben ist, den letzten Job des Benutzers abrufen
      const job = await prisma.transcriptionJob.findFirst({
        where: { userId, status: "pending" },
        select: {
          id: true,
          status: true,
          error: true,
          noteId: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (!job) {
        return NextResponse.json(
          { error: "No pending job found for user" },
          { status: 404 },
        );
      }
      return NextResponse.json(job);
    }
  }

  const job = await prisma.transcriptionJob.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      status: true,
      error: true,
      noteId: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
