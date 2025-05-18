export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createWriteStream } from "fs";
import tmp from "tmp";
import { createReadStream } from "fs";
import { Readable } from "stream";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Temporäre Datei anlegen
  const tmpFile = tmp.fileSync({ postfix: ".mp3" });
  
  const writeStream = createWriteStream(tmpFile.name);
  Readable.from(buffer).pipe(writeStream);

  await new Promise<void>((resolve) => {
    writeStream.on("finish", () => resolve());
  });

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(tmpFile.name),
      model: "whisper-1",
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
