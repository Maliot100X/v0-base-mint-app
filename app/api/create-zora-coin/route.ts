import { NextResponse } from "next/server";
import { createCoinCall, CreateConstants } from "@zoralabs/coins-sdk";
import { Address } from "viem";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const {
      creator,
      name,
      symbol,
      image,        // ipfs://CID
      description,
      platformReferrer,
    } = await req.json();

    if (!creator || !name || !symbol || !image) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const PINATA_JWT = process.env.PINATA_JWT;
    if (!PINATA_JWT) {
      throw new Error("Missing PINATA_JWT");
    }

    // 1️⃣ Build Zora metadata JSON
    const metadata = {
      name,
      symbol,
      description: description || "",
      image,
    };

    // 2️⃣ Upload metadata JSON to Pinata
    const pinRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!pinRes.ok) {
      const err = await pinRes.text();
      throw new Error("Pinata JSON upload failed: " + err);
    }

    const pinJson = await pinRes.json();
    const metadataUri = `ipfs://${pinJson.IpfsHash}`;

    // 3️⃣ Call Zora Coins SDK (THIS NOW RETURNS CALLS)
    const result = await createCoinCall({
      creator: creator as Address,
      name,
      symbol,
      metadata: {
        type: "RAW_URI",
        uri: metadataUri, // ✅ JSON, not image
      },
      currency: CreateConstants.ContentCoinCurrencies.ZORA,
      chainId: 8453, // Base mainnet
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
      platformReferrer: platformReferrer as Address | undefined,
    });

    if (!result.calls || result.calls.length === 0) {
      throw new Error("Zora SDK returned no calls");
    }

    const tx = result.calls[0];

    return NextResponse.json({
      success: true,
      metadataUri,
      predictedCoinAddress: result.predictedCoinAddress,
      transaction: {
        to: tx.to,
        data: tx.data,
        value: tx.value?.toString() ?? "0",
      },
    });
  } catch (err: any) {
    console.error("Zora coin creation failed:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
