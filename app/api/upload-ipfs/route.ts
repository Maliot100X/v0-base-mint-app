import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Pinata
    const pinataFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    pinataFormData.append("file", blob, file.name);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PINATA_JWT}`,
        },
        body: pinataFormData,
      }
    );

    const data = await response.json();

    if (!data.IpfsHash) {
      return NextResponse.json({ 
        success: false, 
        error: "Upload failed" 
      });
    }

    return NextResponse.json({
      success: true,
      ipfsUrl: `ipfs://${data.IpfsHash}`,
    });

  } catch (error: any) {
    console.error("IPFS Upload error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}