// lib/contentStore.ts
// Internal content layer (drafts). Now persisted to localStorage (client only).

export type DraftContentStatus = "draft" | "coined";

export type DraftContent = {
  id: string;
  creatorWallet: string;
  creatorFid?: number;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string; // usually ipfs://...
  status: DraftContentStatus;
  createdAt: number; // unix ms
};

const STORAGE_KEY = "basemint_drafts_v1";

let _drafts: DraftContent[] = [];

function isBrowser() {
  return typeof window !== "undefined";
}

function loadFromStorage() {
  if (!isBrowser()) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) _drafts = parsed as DraftContent[];
  } catch {
    // ignore
  }
}

function saveToStorage() {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(_drafts));
  } catch {
    // ignore
  }
}

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

function ensureLoaded() {
  // lazy-load once per session
  if (_drafts.length === 0) loadFromStorage();
}

/**
 * Create a new DraftContent record (status="draft").
 */
export function createDraftContent(input: {
  creatorWallet: string;
  creatorFid?: number;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
}): DraftContent {
  ensureLoaded();

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

  _drafts = [draft, ..._drafts];
  saveToStorage();
  return draft;
}

/**
 * Return all records, newest-first.
 */
export function getAllDraftContent(): DraftContent[] {
  ensureLoaded();
  return [..._drafts];
}

/**
 * Return records for a specific creator wallet, newest-first.
 */
export function getDraftsByCreator(creatorWallet: string): DraftContent[] {
  ensureLoaded();
  const w = normWallet(creatorWallet);
  if (!w) return [];
  return _drafts.filter((d) => d.creatorWallet === w);
}

/**
 * Mark a record as "coined".
 */
export function markDraftAsCoined(id: string): DraftContent | null {
  ensureLoaded();
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

  saveToStorage();
  return updated;
}

export function __dangerousResetContentStore() {
  _drafts = [];
  saveToStorage();
}
