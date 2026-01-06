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

const STORAGE_KEY = "basemint.coinIntents.v1";

function safeRead(): CoinIntent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CoinIntent[];
  } catch {
    return [];
  }
}

function safeWrite(intents: CoinIntent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intents));
  } catch {
    // ignore write failures (private mode, storage full, etc.)
  }
}

function upsert(intent: CoinIntent) {
  const intents = safeRead();
  const idx = intents.findIndex((i) => i.id === intent.id);
  if (idx >= 0) intents[idx] = intent;
  else intents.push(intent);
  safeWrite(intents);
}

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

  upsert(intent);
  return intent;
}

export function getCoinIntentsByCreator(address: string) {
  const intents = safeRead();
  return intents.filter((i) => i.creatorAddress === address);
}

export function getCoinIntentByContent(contentId: string) {
  const intents = safeRead();
  return intents.find((i) => i.contentId === contentId);
}

/**
 * Phase-1 helper: if you "Coin It" again, we want the same intent back,
 * not a new one (prevents preview regressions).
 */
export function getOrCreateCoinIntent(params: {
  contentId: string;
  creatorAddress: string;
  creatorName: string;
  contentText: string;
  imageUrl?: string;
  creatorCoinAddress?: string;
}) {
  const existing = getCoinIntentByContent(params.contentId);
  if (existing) return existing;
  return createCoinIntent(params);
}
