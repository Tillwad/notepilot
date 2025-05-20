export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createWriteStream } from "fs";
import tmp from "tmp";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/user";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUser(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.hasPaid && user.credits <= 0) {
    return NextResponse.json(
      { error: "User has no credits left" },
      { status: 402 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "text",
    });

    return NextResponse.json({ transcript: transcription });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    return NextResponse.json(
      { error: "Transcription failed", detail: error.message },
      { status: 500 }
    );
  }
}
