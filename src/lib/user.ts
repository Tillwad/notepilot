// src/lib/user.ts
import { prisma } from "@/lib/prisma";


export async function getUser(userId: string) {
  if (!userId) throw new Error("Missing userId");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}

export async function updateUser(userId: string, data: Partial<{ hasPaid: boolean; credits: number }>) {
  if (!userId) throw new Error("Missing userId");

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return user;
}