// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/user";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await getUser(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
