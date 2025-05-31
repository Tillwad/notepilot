// src/app/api/user/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, email } = await req.json();

  if (!userId || !email) return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });

  console.log("Creating user with ID:", userId, "and email:", email);

  try {
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
      },
    });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
