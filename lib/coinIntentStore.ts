import { v4 as uuidv4 } from "uuid";

export type CoinIntentStatus = "prepared" | "minted" | "cancelled";

export interface CoinIntent {
  id: string;
  contentId: string;
  creatorAddress: string;
  creatorName: string;
  creatorCoinAddress?: string;
  tokenName: string;
  ticker: string;
  description: string;
  imageUrl?: string;
  supply: string; // 1B
  status: CoinIntentStatus;
  createdAt: number;
}

const coinIntents: CoinIntent[] = [];

function generateTokenMeta(params: { creatorName: string }) {
  const creatorName = params.creatorName || "BaseMint";
  const cleaned = creatorName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  let ticker = cleaned.slice(0, 5);
  if (!ticker || ticker === "BASE" || ticker.length < 3) ticker = "BMINT";

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
  imageUrl?: string;
  creatorCoinAddress?: string;
}) {
  const meta = generateTokenMeta({ creatorName: params.creatorName });

  const intent: CoinIntent = {
    id: uuidv4(),
    contentId: params.contentId,
    creatorAddress: params.creatorAddress,
    creatorName: params.creatorName,
    creatorCoinAddress: params.creatorCoinAddress,
    tokenName: meta.tokenName,
    ticker: meta.ticker,
    description: meta.description,
    imageUrl: params.imageUrl,
    supply: "1000000000",
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
