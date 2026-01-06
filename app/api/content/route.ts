import { NextRequest, NextResponse } from "next/server";

type ContentItem = {
  id: string;
  creatorAddress: string;
  creatorName: string;
  imageUrl: string;
  title: string;
  description?: string;
  createdAt: number;
};

const GLOBAL_KEY = "basemint.global.content";

function readStore(): ContentItem[] {
  try {
    const raw = globalThis[GLOBAL_KEY as any];
    if (!raw) return [];
    return raw as ContentItem[];
  } catch {
    return [];
  }
}

function writeStore(items: ContentItem[]) {
  (globalThis as any)[GLOBAL_KEY] = items;
}

export async function GET() {
  const items = readStore();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const item: ContentItem = {
    id: crypto.randomUUID(),
    creatorAddress: body.creatorAddress,
    creatorName: body.creatorName,
    imageUrl: body.imageUrl,
    title: body.title,
    description: body.description,
    createdAt: Date.now(),
  };

  const items = readStore();
  items.unshift(item);
  writeStore(items);

  return NextResponse.json({ item });
}
