import { NextResponse } from "next/server";
import { createWriteStream, createReadStream } from "fs";
import { promisify } from "util";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import pLimit from "p-limit";
import { exec } from "child_process";
import { OpenAI } from "openai";

import { prisma } from "@/lib/prisma";
import { processTranscriptWithGPT } from "@/lib/gpt";
import { saveNote } from "@/lib/note";

const execAsync = promisify(exec);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const CONCURRENCY_LIMIT = 3;
const limit = pLimit(CONCURRENCY_LIMIT);

export async function GET() {
  console.log("Transkriptions-Cron gestartet...");

  try {
    const jobs = await prisma.transcriptionJob.findMany({
      where: { status: "pending" },
      include: { user: true },
      take: CONCURRENCY_LIMIT,
    });

    if (jobs.length === 0) {
      return NextResponse.json({ message: "Keine offenen Jobs" });
    }

    const validJobs = await Promise.all(
      jobs.map(async (job) => {
        const user = await prisma.user.findUnique({
          where: { id: job.userId },
        });

        if (!user || user.credits <= 0) {
          await prisma.transcriptionJob.update({
            where: { id: job.id },
            data: { status: "skipped" },
          });
          return null;
        }

        return job;
      }),
    );

    await Promise.all(
      validJobs
        .filter((job): job is NonNullable<typeof job> => job !== null)
        .map((job) => limit(() => processJob(job))),
    );

    return NextResponse.json({ message: "Jobs verarbeitet." });
  } catch (err) {
    console.error("Fehler im Cron-Job:", err);
    return NextResponse.json(
      { error: "Cron-Job fehlgeschlagen" },
      { status: 500 },
    );
  }
}

async function processJob(job: {
  id: string;
  userId: string;
  filePath: string;
}) {
  console.log(`Verarbeite Job ${job.id}...`);
  await prisma.transcriptionJob.update({
    where: { id: job.id },
    data: { status: "processing" },
  });

  const tmpPath = path.join("/tmp", `${uuidv4()}.mp3`);

  try {
    // Datei von blobUrl herunterladen
    const res = await fetch(job.filePath);
    if (!res.ok) throw new Error(`Fehler beim Laden der Datei: ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(tmpPath, buffer);

    const finalPath = await prepareFile(tmpPath);

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(finalPath),
      model: "whisper-1",
      response_format: "text",
    });

    const gptResult = await processTranscriptWithGPT(transcription);
    const note = await saveNote({
      userId: job.userId,
      transcript: transcription,
      ...gptResult,
    });

    await prisma.transcriptionJob.update({
      where: { id: job.id },
      data: {
        status: "done",
        noteId: note.id,
        transcript: transcription,
      },
    });

    await prisma.user.update({
      where: { id: job.userId },
      data: {
        credits: { decrement: 1 },
      },
    });

    await fs.unlink(finalPath);
    console.log(`Job ${job.id} erfolgreich abgeschlossen.`);
  } catch (err: any) {
    console.error(`Fehler bei Job ${job.id}:`, err.message);

    await prisma.user.update({
      where: { id: job.userId },
      data: {
        credits: { increment: 1 },
      },
    });

    await prisma.transcriptionJob.update({
      where: { id: job.id },
      data: {
        status: "error",
        error: err.message || "Unbekannter Fehler",
      },
    });

    try {
      await fs.unlink(tmpPath);
    } catch {}
  }
}

async function prepareFile(localPath: string): Promise<string> {
  const stats = await fs.stat(localPath);

  if (stats.size < 25 * 1024 * 1024) return localPath;

  const mp3Path = path.join("/tmp", `${uuidv4()}.mp3`);
  const command = `ffmpeg -y -i "${localPath}" -ar 16000 -ac 1 -b:a 64k "${mp3Path}"`;

  await execAsync(command);
  await fs.unlink(localPath);
  return mp3Path;
}
