import { OpenAI } from "openai";
import { createReadStream } from "fs";
import { prisma } from "@/lib/prisma";
import { processTranscriptWithGPT } from "@/lib/gpt";
import { saveNote } from "@/lib/note";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import pLimit from "p-limit"; // ⬅️ Limitiert gleichzeitige Ausführung

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const execAsync = promisify(exec);

const CONCURRENCY_LIMIT = 3;
const limit = pLimit(CONCURRENCY_LIMIT);

async function mainLoop() {
  console.log("Transkriptions-Worker gestartet...");

  while (true) {
    try {
      const jobs = await prisma.transcriptionJob.findMany({
        where: { status: "pending" },
        include: { user: true },
        take: CONCURRENCY_LIMIT, // Nur so viele wie Worker-Slots
      });

      if (jobs.length === 0) {
        await sleep(3000);
        continue;
      }

      // Prüfen, ob User genügend Credits hat
      await Promise.all(
        jobs.map(async (job: any) => {
          const user = await prisma.user.findUnique({
            where: { id: job.userId },
          });
          if (!user || user.credits <= 0) {
            console.warn(`User ${job.userId} hat nicht genügend Credits.`);
            await prisma.transcriptionJob.update({
              where: { id: job.id },
              data: { status: "skipped" },
            });
            return null; // Job überspringen
          }
          limit(() => processJob(job));
        })
      );
    } catch (err) {
      console.error("Fehler in der Main-Loop:", err);
    }

    await sleep(1000); // kleine Pause vor nächster Runde
  }
}

async function processJob(job: Awaited<ReturnType<typeof prisma.transcriptionJob.findFirst>>) {
  console.log(`Bearbeite Job: ${job.id}`);
  await prisma.transcriptionJob.update({
    where: { id: job.id },
    data: { status: "processing" },
  });

  try {
    const filePath = await prepareFile(job.filePath);
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(filePath),
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
        credits: {
          decrement: 1, // Rückerstattung eines Credits bei Fehler
        },
      },
    });

    await fs.unlink(filePath);
    console.log(`Job ${job.id} abgeschlossen.`);
  } catch (err: any) {
    console.error(`Fehler bei Job ${job.id}:`, err.message || err);
    await prisma.user.update({
      where: { id: job.userId },
      data: {
        credits: {
          increment: 1, // Rückerstattung eines Credits bei Fehler
        },
      },
    });
    
    await prisma.transcriptionJob.update({
      where: { id: job.id },
      data: {
        status: "error",
        error: err.message || "Unbekannter Fehler",
      },
    });

    console.log(`Job ${job.id} als Fehler markiert und Credits zurückerstattet.`);
  }
}

async function prepareFile(originalPath: string): Promise<string> {
  const stats = await fs.stat(originalPath);
  if (stats.size < 25 * 1024 * 1024) return originalPath;

  const mp3Path = path.join(path.dirname(originalPath), `${uuidv4()}.mp3`);
  const command = `ffmpeg -y -i "${originalPath}" -ar 16000 -ac 1 -b:a 64k "${mp3Path}"`;
  await execAsync(command);
  await fs.unlink(originalPath);
  return mp3Path;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

mainLoop();
