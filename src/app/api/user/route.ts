// src/app/api/user/route.ts
import { prisma } from "@/lib/prisma";
import { get } from "http";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/user";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await getUser(userId);

  return NextResponse.json(user);
}
