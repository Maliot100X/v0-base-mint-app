import { NextResponse } from "next/server";
import { createCoinCall, CreateConstants } from "@zoralabs/coins-sdk";
import { Address } from "viem";

export async function POST(req: Request) {
  try {
    const { creator, name, symbol, platformReferrer } = await req.json();

    if (!creator || !name || !symbol) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }

    console.log("Creating Zora coin:", { creator, name, symbol });

    // Use a valid IPFS metadata URI that already exists
    const result = await createCoinCall({
      creator: creator as Address,
      name,
      symbol,
      metadata: {
        type: "RAW_URI" as const,
        uri: "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe",
      },
      currency: CreateConstants.ContentCoinCurrencies.ZORA,
      chainId: 8453,
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
      platformReferrer: platformReferrer as Address,
    });

    if (!result.calls || result.calls.length === 0) {
      throw new Error("No transaction data from Zora SDK");
    }

    const transaction = result.calls[0];

    return NextResponse.json({
      success: true,
      transaction: {
        to: transaction.to,
        data: transaction.data,
        value: transaction.value.toString(),
      },
      coinAddress: result.predictedCoinAddress,
    });

  } catch (error: any) {
    console.error("Zora coin error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}