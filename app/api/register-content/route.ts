import { NextResponse } from "next/server";

/**
 * IMPORTANT:
 * This endpoint is JSON ONLY.
 * No files, no Pinata, no Edge runtime.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { creator, metadataUri } = await req.json();

    if (!creator || !metadataUri) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing creator or metadataUri",
        },
        { status: 400 }
      );
    }

    /**
     * We are NOT minting yet.
     * We are only acknowledging that this content
     * is ready to be minted / coinable.
     */
    return NextResponse.json({
      success: true,
      registered: true,
      creator,
      metadataUri,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "register-content failed",
      },
      { status: 500 }
    );
  }
}
