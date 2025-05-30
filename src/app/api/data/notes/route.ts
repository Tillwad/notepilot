import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const { noteId } = await req.json();
  if (!noteId) {
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  await prisma.event.deleteMany({
    where: { noteId },
  });

  await prisma.todo.deleteMany({
    where: { noteId },
  });

  await prisma.transcriptionJob.deleteMany({
    where: { noteId },
  });

  const res = await prisma.note.delete({
    where: { id: noteId },
  });

  if (!res) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const todos = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos, { status: 200 });
}
