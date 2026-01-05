import { v4 as uuidv4 } from "uuid";

export type CoinIntentStatus = "prepared" | "minted" | "cancelled";

export interface CoinIntent {
  id: string;
  contentId: string;
  creatorAddress: string;
  creatorName: string;
  creatorCoinAddress?: string; // Emerge-style pairing
  tokenName: string;
  ticker: string;
  description: string;
  supply: string; // "1000000000" (1B)
  status: CoinIntentStatus;
  createdAt: number;
}

const coinIntents: CoinIntent[] = [];

/**
 * Emerge-aligned meta:
 * - creatorName should be the creator identity (Farcaster display / base name / fallback addr)
 * - token name: "<creatorName>'s Creator Token"
 * - ticker: derived from creatorName, but never "BASE" default; fallback "BMINT"
 */
function generateTokenMeta(params: { creatorName: string; contentText: string }) {
  const creatorName = (params.creatorName || "").trim() || "BaseMint";
  const cleaned = creatorName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // derive ticker but keep it sane
  let ticker = cleaned.slice(0, 5) || "BMINT";
  if (ticker === "BASE") ticker = "BMINT";
  if (ticker.length < 3) ticker = "BMINT";

  const tokenName = `${creatorName}'s Creator Token`;

  const description =
    `$${ticker} is ${creatorName}'s creator coin on BaseMint — minted from a specific piece of content and paired to a creator identity. ` +
    `Every coin is an onchain story: permissionless, composable, and built for viral distribution on Base.`;

  return { tokenName, ticker, description };
}

export function createCoinIntent(params: {
  contentId: string;
  creatorAddress: string;
  creatorName: string;
  contentText: string;
  creatorCoinAddress?: string;
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
    creatorCoinAddress: params.creatorCoinAddress,
    tokenName: meta.tokenName,
    ticker: meta.ticker,
    description: meta.description,
    supply: "1000000000", // 1B
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
