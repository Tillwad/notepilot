import { prisma } from "@/lib/prisma";

export async function getAllJobs(userId: string) {
    return await prisma.transcriptionJob.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}