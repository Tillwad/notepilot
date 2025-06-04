import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  var jobs = await prisma.transcriptionJob.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ message: "No jobs found" }, { status: 404 });
  }

  return NextResponse.json(jobs);
}
