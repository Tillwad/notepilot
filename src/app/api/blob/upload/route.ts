// Datei: app/api/upload/route.ts
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Nicht autorisiert. Bitte melden Sie sich an." },
      { status: 401 },
    );
  }

  try {
    const jsonResponse = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["audio/*", "video/*"],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload completed", blob);
        if (typeof tokenPayload !== "string") {
          throw new Error("Invalid tokenPayload");
        }
        const { userId } = JSON.parse(tokenPayload);
        const job = await prisma.transcriptionJob.create({
          data: {
            userId,
            status: "pending",
            filePath: blob.url,
          },
        });

        console.log("✅ Job erstellt:", job.id);
      },
    });

    return NextResponse.json({
      ...jsonResponse,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}
