import { v4 as uuidv4 } from "uuid";

export type CoinIntentStatus = "prepared" | "minted" | "cancelled";

export interface CoinIntent {
  id: string;
  contentId: string;
  creatorAddress: string;
  creatorName: string;
  tokenName: string;
  ticker: string;
  description: string;
  status: CoinIntentStatus;
  createdAt: number;
}

const coinIntents: CoinIntent[] = [];

/**
 * Deterministically generate token metadata
 * NO AI, NO RANDOM — safe defaults
 */
function generateTokenMeta(params: {
  creatorName: string;
  contentText: string;
}) {
  const baseName = params.creatorName || "BaseMint Creator";

  const clean = baseName.replace(/[^a-zA-Z0-9]/g, "");
  const ticker = clean.slice(0, 6).toUpperCase() || "BMINT";

  return {
    tokenName: `${baseName} Creator Coin`,
    ticker,
    description: `$${ticker} is the official creator coin for ${baseName} on BaseMint. This coin represents a piece of creator content transformed into an onchain asset — permissionless, composable, and native to Base.`,
  };
}

export function createCoinIntent(params: {
  contentId: string;
  creatorAddress: string;
  creatorName: string;
  contentText: string;
}) {
  const meta = generateTokenMeta({
    creatorName: params.creatorName,
    contentText: params.contentText,
  });

  const intent: CoinIntent = {
    id: uuidv4(),
    contentId: params.contentId,
    creatorAddress: params.creatorAddress,
    creatorName: params.creatorName,
    tokenName: meta.tokenName,
    ticker: meta.ticker,
    description: meta.description,
    status: "prepared",
    createdAt: Date.now(),
  };

  coinIntents.push(intent);
  return intent;
}

export function getCoinIntentsByCreator(address: string) {
  return coinIntents.filter((i) => i.creatorAddress === address);
}

export function getCoinIntentByContent(contentId: string) {
  return coinIntents.find((i) => i.contentId === contentId);
}
