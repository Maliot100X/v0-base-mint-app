import { NextResponse } from "next/server";
import { createCoinCall, CreateConstants } from "@zoralabs/coins-sdk";
import { Address } from "viem";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      creator,
      name,
      symbol,
      image,
      description,
      platformReferrer,
    } = body;

    if (!creator || !name || !symbol || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔹 Build proper metadata JSON
    const metadata = {
      name,
      symbol,
      description: description || "",
      image,
      attributes: [
        { trait_type: "source", value: "BaseMint" },
        { trait_type: "type", value: "Creator Coin" },
      ],
    };

    // 🔹 Upload metadata JSON to IPFS via Pinata
    const pinataRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!pinataRes.ok) {
      const text = await pinataRes.text();
      throw new Error("Pinata metadata upload failed: " + text);
    }

    const pinataData = await pinataRes.json();
    const metadataUri = `ipfs://${pinataData.IpfsHash}`;

    // 🔹 Create Zora coin transaction
    const result = await createCoinCall({
      creator: creator as Address,
      name,
      symbol,
      metadata: {
        type: "RAW_URI",
        uri: metadataUri,
      },
      currency: CreateConstants.ContentCoinCurrencies.ZORA,
      chainId: 8453, // Base mainnet
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
      platformReferrer: platformReferrer as Address,
    });

    if (!result.calls || result.calls.length === 0) {
      throw new Error("Zora SDK returned no calls");
    }

    const tx = result.calls[0];

    return NextResponse.json({
      success: true,
      predictedCoinAddress: result.predictedCoinAddress,
      transaction: {
        to: tx.to,
        data: tx.data,
        value: tx.value.toString(),
      },
    });
  } catch (err: any) {
    console.error("create-zora-coin error:", err);
    return NextResponse.json(
      { error: err.message || "Create coin failed" },
      { status: 500 }
    );
  }
}
