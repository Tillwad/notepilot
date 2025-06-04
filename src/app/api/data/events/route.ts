import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const { eventId } = await req.json();
  if (!eventId) {
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  const res = await prisma.event.delete({
    where: { id: eventId },
  });

  if (!res) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { eventId, title, location, date, time } = await req.json();
  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 },
    );
  }

  // Dynamisch das Update-Objekt bauen
  const data: {
    title?: string;
    location?: string;
    date?: string;
    time?: string;
  } = {};
  if (typeof title === "string") data.title = title;
  if (typeof location === "string") data.location = location;
  if (typeof date === "string") data.date = date;
  if (typeof time === "string") data.time = time;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const res = await prisma.event.update({
      where: { id: eventId },
      data,
    });

    return NextResponse.json(
      { message: "Event updated", event: res },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
}