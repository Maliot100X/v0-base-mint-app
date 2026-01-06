import { NextRequest, NextResponse } from "next/server";
import { saveCreation } from "@/lib/creationStore";

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
