import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function GET() {
  const expired = await prisma.transcriptionJob.findMany({
    where: { deleteAt: { lte: new Date() } },
  });

  for (const job of expired) {
    if (job.filePath?.startsWith('https://blob.vercel-storage.com/')) {
      try {
        await del(new URL(job.filePath).pathname);
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
      }
    }
    await prisma.transcriptionJob.delete({ where: { id: job.id } });
  }

  return NextResponse.json({ deleted: expired.length });
}