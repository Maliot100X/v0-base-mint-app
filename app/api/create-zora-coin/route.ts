import { NextResponse } from "next/server";
import { createCoinCall, CreateConstants } from "@zoralabs/coins-sdk";
import { Address } from "viem";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const PINATA_JWT = process.env.PINATA_JWT;

    if (!PINATA_JWT) {
      return NextResponse.json(
        { success: false, error: "Missing PINATA_JWT" },
        { status: 500 }
      );
    }

    const {
      creator,
      name,
      symbol,
      image,            // ipfs://CID (IMAGE)
      description,
      platformReferrer,
    } = await req.json();

    if (!creator || !name || !symbol || !image) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (creator, name, symbol, image)",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 1️⃣ BUILD ZORA-COMPATIBLE METADATA JSON
    // ----------------------------------------------------
    const metadata = {
      name,
      description: description || `${name} content coin`,
      image, // ipfs://IMAGE_CID
      external_url: "https://v0-base-mint-app.vercel.app",
      attributes: [
        { trait_type: "Platform", value: "BaseMint" },
        { trait_type: "Type", value: "Creator Coin" },
      ],
    };

    // ----------------------------------------------------
    // 2️⃣ UPLOAD METADATA JSON TO PINATA
    // ----------------------------------------------------
    const pinRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinataMetadata: {
            name: `${name}-metadata`,
          },
          pinataContent: metadata,
        }),
      }
    );

    const pinData = await pinRes.json();

    if (!pinRes.ok || !pinData?.IpfsHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload metadata to Pinata",
          details: pinData,
        },
        { status: 500 }
      );
    }

    const metadataUri = `ipfs://${pinData.IpfsHash}`;

    // ----------------------------------------------------
    // 3️⃣ CALL ZORA COINS SDK (THIS NOW WORKS)
    // ----------------------------------------------------
    const result = await createCoinCall({
      creator: creator as Address,
      name,
      symbol,
      metadata: {
        type: "RAW_URI",
        uri: metadataUri, // ✅ VALID ZORA METADATA
      },
      currency: CreateConstants.ContentCoinCurrencies.ZORA,
      chainId: 8453, // Base mainnet
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
      platformReferrer: platformReferrer as Address | undefined,
    });

    if (!result.calls || result.calls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Zora SDK returned no transaction calls",
        },
        { status: 500 }
      );
    }

    const tx = result.calls[0];

    return NextResponse.json({
      success: true,
      transaction: {
        to: tx.to,
        data: tx.data,
        value: tx.value?.toString() ?? "0",
      },
      predictedCoinAddress: result.predictedCoinAddress,
      metadataUri,
    });
  } catch (err: any) {
    console.error("Zora coin creation failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Zora coin creation failed",
      },
      { status: 500 }
    );
  }
}
