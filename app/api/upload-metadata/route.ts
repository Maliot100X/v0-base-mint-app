import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const PINATA_JWT = process.env.PINATA_JWT;
    if (!PINATA_JWT) {
      return NextResponse.json(
        { error: "Missing PINATA_JWT" },
        { status: 500 }
      );
    }

    const metadata = await req.json();
    if (!metadata?.name || !metadata?.image) {
      return NextResponse.json(
        { error: "Invalid metadata payload" },
        { status: 400 }
      );
    }

    const r = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinataMetadata: {
            name: metadata.name,
          },
          pinataContent: metadata,
        }),
      }
    );

    const data = await r.json();

    if (!r.ok || !data?.IpfsHash) {
      return NextResponse.json(
        { error: "Pinata metadata upload failed", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      metadataUri: `ipfs://${data.IpfsHash}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Metadata upload error" },
      { status: 500 }
    );
  }
}
