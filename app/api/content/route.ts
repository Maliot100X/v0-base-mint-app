import { NextRequest, NextResponse } from "next/server";
import { saveCreation, getRecentCreations } from "@/lib/creationStore";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const creation = {
    id: crypto.randomUUID(),
    creator: body.creatorAddress,
    imageUrl: body.imageUrl,
    title: body.title,
    description: body.description,
    createdAt: Date.now(),
  };

  await saveCreation(creation);

  return NextResponse.json({ creation });
}

export async function GET() {
  const creations = await getRecentCreations(50);
  return NextResponse.json({ creations });
}
