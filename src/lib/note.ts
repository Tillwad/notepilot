// src/lib/note.ts
import { prisma } from "@/lib/prisma";

export async function saveNote({
  userId,
  transcript,
  summary,
  decisions,
  actionItems,
}: {
  userId: string;
  transcript: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
}) {
  // User absichern
  await prisma.user.upsert({
    where: { id: userId },
    update: {}, // nothing to update
    create: { id: userId, createdAt: new Date() }, // create user if not exists
  });

  return prisma.note.create({
    data: {
      userId,
      transcript,
      summary,
      decisions,
      actionItems,
      title: summary?.split(".")[0] || "Meeting-Notiz",
    },
  });
}
export async function updateNote(id: string, data: Partial<{
  title: string;
  summary: string;
  transcript: string;
  decisions: string[];
  actionItems: string[];
}>) {
  return prisma.note.update({
    where: { id },
    data,
  });
}

export async function getNotes(id: string) {
  return prisma.note.findMany({
    where: { id },
  });
}