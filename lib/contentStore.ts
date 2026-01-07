// lib/contentStore.ts
// Internal content layer (drafts). Persisted to localStorage (client only).

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
  createdAt: number; // unix ms
};

/** ---------------- STORAGE ---------------- */

const STORAGE_KEY = "basemint_drafts_v2";

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
  } catch {}
}

function saveToStorage() {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(_drafts));
  } catch {}
}

function ensureLoaded() {
  if (_drafts.length === 0) loadFromStorage();
}

function nowMs() {
  return Date.now();
}

function genId() {
  return `dc_${nowMs()}_${Math.random().toString(16).slice(2, 10)}`;
}

function normWallet(addr: string) {
  return (addr || "").trim().toLowerCase();
}

/** ---------------- DRAFTS ---------------- */

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
    title: input.title.trim(),
    description: input.description.trim(),
    prompt: input.prompt.trim(),
    imageUrl: input.imageUrl.trim(),
    status: "draft",
    createdAt: nowMs(),
  };

  _drafts = [draft, ..._drafts];
  saveToStorage();
  return draft;
}

export function getAllDraftContent(): DraftContent[] {
  ensureLoaded();
  return [..._drafts];
}

export function getDraftsByCreator(wallet: string): DraftContent[] {
  ensureLoaded();
  const w = normWallet(wallet);
  if (!w) return [];
  return _drafts.filter((d) => d.creatorWallet === w);
}

/** ---------------- REGISTRATION ---------------- */

export function markDraftAsRegistered(id: string): DraftContent | null {
  ensureLoaded();
  const idx = _drafts.findIndex((d) => d.id === id);
  if (idx === -1) return null;

  _drafts[idx] = { ..._drafts[idx], status: "registered" };
  saveToStorage();
  return _drafts[idx];
}

export function markDraftAsCoined(id: string): DraftContent | null {
  ensureLoaded();
  const idx = _drafts.findIndex((d) => d.id === id);
  if (idx === -1) return null;

  _drafts[idx] = { ..._drafts[idx], status: "coined" };
  saveToStorage();
  return _drafts[idx];
}

export function __dangerousResetContentStore() {
  _drafts = [];
  saveToStorage();
}
