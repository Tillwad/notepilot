import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/job";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  var jobs = await getAllJobs(userId);

    if (!jobs || jobs.length === 0) {
        return NextResponse.json({ message: "No jobs found" }, { status: 404 });
    }

  return NextResponse.json(jobs);
}
