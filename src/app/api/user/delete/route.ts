import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from "@vercel/blob";
import { clerkClient } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Delete related data first (example: posts, comments, sessions)
        // Get blob URLs from transcriptionJob and delete those blobs

        const transcriptionJobs = await prisma.transcriptionJob.findMany({
            where: { userId },
            select: { filePath: true }
        });
        
        for (const job of transcriptionJobs) {
            try {
                await del(new URL(job.filePath).pathname);
            } catch (err) {
                console.error("Fehler beim Löschen von Blob:", err);
            }
        }
        

        await prisma.transcriptionJob.deleteMany({ where: { userId } });
        const notes = await prisma.note.findMany({ where: { userId }, select: { id: true } });
        const noteIds = notes.map(note => note.id);
        
        // Lösche alle Todos, die zu diesen Notes gehören
        await prisma.todo.deleteMany({ where: { noteId: { in: noteIds } } });
        await prisma.note.deleteMany({ where: { userId } });

        // Delete the user
        await prisma.user.delete({ where: { id: userId } });
        
        // Delete the user from Clerk
        const clerk = await clerkClient();
        await clerk.users.deleteUser(userId);

        return NextResponse.json({ message: 'User and related data deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}