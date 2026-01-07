// lib/contentStore.ts
// Internal content layer with real Zora registration support (client only).

export type DraftContentStatus = "draft" | "registered" | "coined";

export type DraftContent = {
  id: string;
  creatorWallet: string;
  creatorFid?: number;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string; // ipfs://...
  status: DraftContentStatus;
  createdAt: number;

  // 🔑 REAL ZORA CONTENT REFERENCE
  contentContract?: string;
  tokenId?: string;
  registrationTx?: string;
};

const STORAGE_KEY = "basemint_drafts_v2";

let _drafts: DraftContent[] = [];

function isBrowser() {
  return typeof window !== "undefined";
}

function load() {
  if (!isBrowser()) return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) _drafts = parsed;
  } catch {}
}

function save() {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_drafts));
}

function ensureLoaded() {
  if (_drafts.length === 0) load();
}

function genId() {
  return `dc_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function norm(addr: string) {
  return (addr || "").toLowerCase();
}

/* ---------------- DRAFTS ---------------- */

export function createDraftContent(input: {
  creatorWallet: string;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
}): DraftContent {
  ensureLoaded();

  const draft: DraftContent = {
    id: genId(),
    creatorWallet: norm(input.creatorWallet),
    title: input.title,
    description: input.description,
    prompt: input.prompt,
    imageUrl: input.imageUrl,
    status: "draft",
    createdAt: Date.now(),
  };

  _drafts = [draft, ..._drafts];
  save();
  return draft;
}

export function getDraftsByCreator(wallet: string) {
  ensureLoaded();
  return _drafts.filter((d) => d.creatorWallet === norm(wallet));
}

/* ---------------- REGISTRATION ---------------- */

export function markDraftRegistered(input: {
  draftId: string;
  contentContract: string;
  tokenId: string;
  txHash: string;
}) {
  ensureLoaded();

  const i = _drafts.findIndex((d) => d.id === input.draftId);
  if (i === -1) return null;

  _drafts[i] = {
    ..._drafts[i],
    status: "registered",
    contentContract: input.contentContract,
    tokenId: input.tokenId,
    registrationTx: input.txHash,
  };

  save();
  return _drafts[i];
}
