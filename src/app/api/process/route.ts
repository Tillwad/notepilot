export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { processTranscript } from "@/lib/gpt";
import { saveNote } from "@/lib/note";
import { getUser, updateUser } from "@/lib/user";
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { transcript } = await req.json();
  if (!transcript)
    return NextResponse.json(
      { error: "No transcript provided" },
      { status: 400 }
    );

  try {
    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { summary, decisions, actionItems } = await processTranscript(
      transcript,
      { hasPaid: user.hasPaid, credits: user.credits }
    );

    if (!user.hasPaid && user.credits > 0) {
      updateUser(userId, {
        credits: user.credits - 1,
      });
    } else if (!user.hasPaid && user.credits <= 0) {
      return NextResponse.json(
        { error: "User has no credits left" },
        { status: 402 }
      );
    }

    const note = await saveNote({
      userId,
      transcript,
      summary,
      decisions,
      actionItems,
    });
    return NextResponse.json({ noteId: note.id });
  } catch (error: any) {
    console.error("Processing failed:", error);
    return NextResponse.json(
      { error: "Failed to process note" },
      { status: 500 }
    );
  }
}
