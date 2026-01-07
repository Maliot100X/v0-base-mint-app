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
  createdAt: number;
};

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
    if (Array.isArray(parsed)) _drafts = parsed;
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
  return `dc_${nowMs()}_${Math.random().toString(16).slice(2, 8)}`;
}

function normWallet(addr: string) {
  return (addr || "").trim().toLowerCase();
}

/* ================================
   CORE EXPORTS (DO NOT REMOVE)
================================ */

export function createDraftContent(input: {
  creatorWallet: string;
  creatorFid?: number;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
}): DraftContent {
  ensureLoaded();

  const draft: DraftContent = {
    id: genId(),
    creatorWallet: normWallet(input.creatorWallet),
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
  return _drafts.filter((d) => d.creatorWallet === w);
}

export function markDraftRegistered(id: string): DraftContent | null {
  ensureLoaded();
  const i = _drafts.findIndex((d) => d.id === id);
  if (i === -1) return null;

  _drafts[i] = { ..._drafts[i], status: "registered" };
  saveToStorage();
  return _drafts[i];
}

export function markDraftAsCoined(id: string): DraftContent | null {
  ensureLoaded();
  const i = _drafts.findIndex((d) => d.id === id);
  if (i === -1) return null;

  _drafts[i] = { ..._drafts[i], status: "coined" };
  saveToStorage();
  return _drafts[i];
}

/* ================================
   DEV / RESET (SAFE)
================================ */

export function __dangerousResetContentStore() {
  _drafts = [];
  saveToStorage();
}
