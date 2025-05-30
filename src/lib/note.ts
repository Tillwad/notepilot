// src/lib/note.ts
import { prisma } from "@/lib/prisma";

export async function saveNote({
  userId,
  title,
  transcript,
  summary,
  decisions,
  actionItems,
  eventsItems,
}: {
  userId: string;
  title?: string;
  transcript: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  eventsItems: {
    title: string;
    location?: string;
    date?: string;
    time?: string;
  }[];
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
      title,
      todos: {
        create: actionItems.map((text) => ({
          text,
          checked: false, // default-Wert, kann auch weggelassen werden
        })),
      },
      eventItems: {
        create: eventsItems.map((event) => ({
          title: event.title,
          location: event.location ? event.location : undefined,
          date:
            event.date &&
            isValidDate(event.date) &&
            event.time &&
            isValidTime(event.time)
              ? new Date(`${event.date}T${event.time}:00`)
              : undefined,
        })),
      },
    },
  });
}

export async function updateTodo(todoId: string, checked: boolean) {
  return prisma.todo.update({
    where: { id: todoId },
    data: { checked },
  });
}

export async function getNotes(id: string) {
  return prisma.note.findMany({
    where: { id },
  });
}

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date); // e.g. "2025-06-01"
}

function isValidTime(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time); // e.g. "10:30"
}
