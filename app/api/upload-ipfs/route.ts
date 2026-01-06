import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const PINATA_JWT = process.env.PINATA_JWT;

    if (!PINATA_JWT) {
      return NextResponse.json(
        { ok: false, error: "Missing PINATA_JWT" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const pinataForm = new FormData();
    pinataForm.append("file", file);

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: pinataForm,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Pinata failed", details: json },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      cid: json.IpfsHash,
      ipfsUrl: `ipfs://${json.IpfsHash}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "upload-ipfs crashed" },
      { status: 500 }
    );
  }
}
