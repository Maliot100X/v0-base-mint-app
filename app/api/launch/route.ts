import { NextResponse } from "next/server";
import { createCoinCall } from '@zoralabs/coins-sdk';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userAddress, name, ticker } = body;

    // Use the low-level call to bypass the SDK's internal fetch bugs
    const { parameters } = await createCoinCall({
      creator: userAddress as `0x${string}`,
      name: name,
      symbol: ticker,
      metadata: {
        type: "RAW_URI",
        uri: "ipfs://QmZ9v9TfS6pX2v3G5m4a8f9G7h6j5k4l3m2n1o0p9q8r7" 
      },
      payoutRecipient: userAddress as `0x${string}`,
      chainId: 8453,
      platformReferrer: "0x1909b332397144aeb4867B7274a05Dbb25bD1Fec"
    });

    return NextResponse.json({
      success: true,
      parameters: {
        address: parameters[0].to,
        data: parameters[0].data,
        value: parameters[0].value.toString(),
      }
    });
  } catch (error: any) {
    console.error("Zora API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}