import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUser(userId);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json(); 
  const blobUrl = body.blobUrl;

  if (!blobUrl)
    return NextResponse.json({ error: "Missing blobUrl" }, { status: 400 });

  const job = await prisma.transcriptionJob.create({
    data: {
      userId,
      status: "pending",
      filePath: blobUrl,
    },
  });

  return NextResponse.json({ jobId: job.id });
}
