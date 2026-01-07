// lib/contentStore.ts
// Draft + registration state (client-only, persisted)

export type DraftContentStatus = "draft" | "registered" | "coined";

export type DraftContent = {
  id: string;
  creatorWallet: string;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
  status: DraftContentStatus;
  createdAt: number;
};

const STORAGE_KEY = "basemint_drafts_v2";

let _drafts: DraftContent[] = [];

function isBrowser() {
  return typeof window !== "undefined";
}

function load() {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) _drafts = parsed;
    }
  } catch {}
}

function save() {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_drafts));
  } catch {}
}

function ensureLoaded() {
  if (_drafts.length === 0) load();
}

function genId() {
  return `dc_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

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
    creatorWallet: input.creatorWallet.toLowerCase(),
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

export function getDraftsByCreator(wallet: string): DraftContent[] {
  ensureLoaded();
  return _drafts.filter(
    (d) => d.creatorWallet === wallet.toLowerCase()
  );
}

export function markDraftAsRegistered(id: string) {
  ensureLoaded();
  const i = _drafts.findIndex((d) => d.id === id);
  if (i === -1) return;
  _drafts[i] = { ..._drafts[i], status: "registered" };
  save();
}

export function markDraftAsCoined(id: string) {
  ensureLoaded();
  const i = _drafts.findIndex((d) => d.id === id);
  if (i === -1) return;
  _drafts[i] = { ..._drafts[i], status: "coined" };
  save();
}
