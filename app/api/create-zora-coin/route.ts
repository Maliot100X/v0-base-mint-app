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
      image,              // ipfs://CID from your draft
      platformReferrer,   // optional
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

    console.log("Creating Zora coin", {
      creator,
      name,
      symbol,
      image,
    });

    // 🔒 Zora Coins SDK — prepares a USER-SIGNED transaction
    const result = await createCoinCall({
      creator: creator as Address,
      name,
      symbol,
      metadata: {
        type: "RAW_URI",
        uri: image, // ✅ USE YOUR DRAFT IPFS IMAGE
      },
      currency: CreateConstants.ContentCoinCurrencies.ZORA,
      chainId: 8453, // Base mainnet
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
      platformReferrer: platformReferrer as Address | undefined,
    });

    if (!result.calls || result.calls.length === 0) {
      throw new Error("No transaction calls returned from Zora SDK");
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
    });
  } catch (err: any) {
    console.error("Zora coin creation failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message ?? "Zora coin creation failed",
      },
      { status: 500 }
    );
  }
}
