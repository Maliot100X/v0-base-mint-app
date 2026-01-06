import { NextResponse } from "next/server";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    const PINATA_JWT = process.env.PINATA_JWT;

    // 🔎 DEBUG — TEMPORARY
    console.log("PINATA_JWT exists:", !!PINATA_JWT);

    if (!PINATA_JWT) {
      return json(400, {
        ok: false,
        error: "Missing env PINATA_JWT. Add it in Vercel Environment Variables.",
      });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return json(400, {
        ok: false,
        error: "No file uploaded (field name: file)",
      });
    }

    const pinataForm = new FormData();
    pinataForm.append("file", file, file.name);

    // Optional metadata
    pinataForm.append(
      "pinataMetadata",
      JSON.stringify({
        name: file.name,
        keyvalues: {
          app: "BaseMint",
        },
      })
    );

    const r = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: pinataForm,
    });

    const text = await r.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // keep raw text
    }

    if (!r.ok) {
      return json(r.status, {
        ok: false,
        error: "Pinata upload failed",
        status: r.status,
        details: parsed ?? text,
      });
    }

    const cid = parsed?.IpfsHash;
    if (!cid) {
      return json(500, {
        ok: false,
        error: "Pinata response missing IpfsHash",
        details: parsed,
      });
    }

    return json(200, {
      ok: true,
      cid,
      ipfsUrl: `ipfs://${cid}`,
    });
  } catch (e: any) {
    return json(500, {
      ok: false,
      error: e?.message || "upload-ipfs failed",
    });
  }
}
