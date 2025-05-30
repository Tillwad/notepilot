// app/api/job/start/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/user";
import path from "path";
import os from "os";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUser(userId);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  let job;

  if (jobId) {
    // Update existing job, no file required
    job = await prisma.transcriptionJob.update({
      where: { id: jobId, userId },
      data: {
        status: "pending",
      },
    });
  } else {
    // Create new job, file required
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const tmpDir = os.tmpdir();
    const tmpPath = path.join(tmpDir, `${uuidv4()}-${file.name}`);
    await writeFile(tmpPath, buffer);

    job = await prisma.transcriptionJob.create({
      data: {
        userId,
        status: "pending",
        filePath: tmpPath,
      },
    });
  }

  if (!job)
    return NextResponse.json(
      { error: "Failed to create or update job" },
      { status: 500 }
    );

  return NextResponse.json({ jobId: job.id });
}
