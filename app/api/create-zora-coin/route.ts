import { NextResponse } from "next/server";
import { createCoinCall, CreateConstants, validateMetadataURIContent } from "@zoralabs/coins-sdk";
import { Address } from "viem";

export const runtime = "nodejs";

/**
 * Creates a Zora coin TX (user-signed) from Draft image + description.
 * - Uploads metadata JSON to Pinata (uses PINATA_JWT)
 * - Builds metadataUri = ipfs://<cid>
 * - Calls createCoinCall() to get {to,data,value} for wallet send
 */
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
      image, // ipfs://<cid> of image (from your draft)
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

    // 1) Build metadata JSON (Zora Coins metadata expects a metadata JSON, not the raw image uri)
    const metadata = {
      name,
      description: description || `${name} content coin`,
      image, // ipfs://IMAGE_CID
      external_url: "https://v0-base-mint-app.vercel.app",
      attributes: [
        { trait_type: "Platform", value: "BaseMint" },
        { trait_type: "Type", value: "Content Coin" },
      ],
    };

    // 2) Upload metadata JSON to Pinata
    const pinRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pinataMetadata: { name: `${name}-metadata` },
        pinataContent: metadata,
      }),
    });

    const pinText = await pinRes.text();
    let pinData: any;
    try {
      pinData = JSON.parse(pinText);
    } catch {
      pinData = { raw: pinText };
    }

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

    // 3) Validate metadata (try), but DO NOT hard-fail your flow on gateway problems
    //    If validation fails due to gateway/cert issues, we skip validation in createCoinCall.
    let shouldSkipValidation = false;
    try {
      await validateMetadataURIContent(metadataUri);
    } catch (e) {
      shouldSkipValidation = true;
      console.warn("Metadata validation failed; will skip in createCoinCall.", e);
    }

    // 4) Ask Zora SDK for tx calldata
    const result = await createCoinCall({
      creator: creator as Address,
      name,
      symbol,
      metadata: { type: "RAW_URI" as const, uri: metadataUri },
      currency: CreateConstants.ContentCoinCurrencies.CREATOR_COIN_OR_ZORA, // best default
      chainId: 8453, // Base mainnet
      startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
      platformReferrer: platformReferrer as Address | undefined,
      skipMetadataValidation: shouldSkipValidation,
    });

    if (!result.calls || result.calls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Zora SDK returned no transaction calls",
          debug: { metadataUri, shouldSkipValidation },
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
      shouldSkipValidation,
    });
  } catch (err: any) {
    console.error("create-zora-coin failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "create-zora-coin failed",
      },
      { status: 500 }
    );
  }
}
