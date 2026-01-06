import { NextResponse } from "next/server";

export const runtime = "edge";

function json(status: number, body: any) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const PINATA_JWT = process.env.PINATA_JWT;

    if (!PINATA_JWT) {
      return json(400, {
        ok: false,
        error: "Missing PINATA_JWT env var",
      });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return json(400, {
        ok: false,
        error: "No file uploaded (field name must be 'file')",
      });
    }

    const pinataForm = new FormData();
    pinataForm.append("file", file, file.name);

    pinataForm.append(
      "pinataMetadata",
      JSON.stringify({
        name: file.name,
        keyvalues: { app: "BaseMint" },
      })
    );

    const r = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: pinataForm,
      }
    );

    const text = await r.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    if (!r.ok) {
      return json(r.status, {
        ok: false,
        error: "Pinata upload failed",
        details: parsed,
      });
    }

    if (!parsed?.IpfsHash) {
      return json(500, {
        ok: false,
        error: "Pinata response missing IpfsHash",
        details: parsed,
      });
    }

    return json(200, {
      ok: true,
      cid: parsed.IpfsHash,
      ipfsUrl: `ipfs://${parsed.IpfsHash}`,
    });
  } catch (err: any) {
    return json(500, {
      ok: false,
      error: err?.message || "upload-ipfs failed",
    });
  }
}
