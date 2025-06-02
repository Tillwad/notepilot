// Datei: app/api/upload/route.ts
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const { userId } = await auth();

  console.log("Received upload request:", {
    userId,
    body,
  });

  let jobId: string | null = null;

  try {
    const jsonResponse = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        return {
          allowedContentTypes: ["audio/*", "video/*"],
          tokenPayload: JSON.stringify({ userId }),
          validUntil: Math.floor(Date.now() / 1000) + 600 +10000,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload  }) => {
        console.log('blob upload completed', blob, tokenPayload);
        if (!userId) return;
        const job = await prisma.transcriptionJob.create({
          data: {
            userId,
            status: "pending",
            filePath: blob.url,
            deleteAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        jobId = job.id;
      },
    });

    console.log("Upload completed successfully:", jsonResponse);
    return NextResponse.json({
      ...jsonResponse,
      jobId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }
}
