// lib/contentStore.ts
// Phase 1–3: Internal content layer (NO Zora / NO onchain calls)

import { createCoinIntent } from "./coinIntentStore";

export type DraftContentStatus = "draft" | "coined";

export type DraftContent = {
  id: string;
  creatorWallet: string;
  creatorFid?: number;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
  status: DraftContentStatus;
  createdAt: number; // unix ms
};

let _drafts: DraftContent[] = [];

function nowMs() {
  return Date.now();
}

function genId() {
  const rand = Math.random().toString(16).slice(2, 10);
  return `dc_${nowMs()}_${rand}`;
}

function normWallet(addr: string) {
  return (addr || "").trim().toLowerCase();
}

/**
 * Create a new DraftContent record (status="draft").
 * ALSO prepares a CoinIntent (Phase 3).
 */
export function createDraftContent(input: {
  creatorWallet: string;
  creatorFid?: number;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
}): DraftContent {
  const creatorWallet = normWallet(input.creatorWallet);
  if (!creatorWallet) {
    throw new Error("createDraftContent: creatorWallet is required");
  }

  const draft: DraftContent = {
    id: genId(),
    creatorWallet,
    creatorFid: input.creatorFid,
    title: (input.title || "").trim(),
    description: (input.description || "").trim(),
    prompt: (input.prompt || "").trim(),
    imageUrl: (input.imageUrl || "").trim(),
    status: "draft",
    createdAt: nowMs(),
  };

  // newest-first
  _drafts = [draft, ..._drafts];

  /**
   * 🔗 PHASE 3 BRIDGE:
   * Automatically prepare a CoinIntent for this content.
   * NO UI. NO mint. NO blockchain.
   */
  try {
    createCoinIntent({
      contentId: draft.id,
      creatorAddress: creatorWallet,
      creatorName:
        draft.title ||
        (draft.creatorFid ? `Farcaster #${draft.creatorFid}` : "BaseMint Creator"),
      contentText: `${draft.title}\n${draft.description}`,
    });
  } catch (err) {
    console.error("CoinIntent creation failed (non-fatal):", err);
  }

  return draft;
}

/**
 * Return all content records (draft + coined), newest-first.
 */
export function getAllDraftContent(): DraftContent[] {
  return [..._drafts];
}

/**
 * Return records for a specific creator wallet, newest-first.
 */
export function getDraftsByCreator(creatorWallet: string): DraftContent[] {
  const w = normWallet(creatorWallet);
  if (!w) return [];
  return _drafts.filter((d) => d.creatorWallet === w);
}

/**
 * Mark a record as "coined".
 * Phase 4 will call this after onchain mint succeeds.
 */
export function markDraftAsCoined(id: string): DraftContent | null {
  const targetId = (id || "").trim();
  if (!targetId) return null;

  const idx = _drafts.findIndex((d) => d.id === targetId);
  if (idx === -1) return null;

  const updated: DraftContent = {
    ..._drafts[idx],
    status: "coined",
  };

  const next = [..._drafts];
  next[idx] = updated;
  _drafts = next;
  return updated;
}

/**
 * Debug helper (safe to remove later).
 */
export function __dangerousResetContentStore() {
  _drafts = [];
}
