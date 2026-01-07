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

const KEY = "basemint_drafts_v2";
let drafts: DraftContent[] = [];

function load() {
  if (typeof window === "undefined") return;
  drafts = JSON.parse(localStorage.getItem(KEY) || "[]");
}

function save() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(drafts));
}

function id() {
  return `dc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function createDraftContent(input: {
  creatorWallet: string;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
}) {
  load();
  const d: DraftContent = {
    id: id(),
    creatorWallet: input.creatorWallet.toLowerCase(),
    title: input.title,
    description: input.description,
    prompt: input.prompt,
    imageUrl: input.imageUrl,
    status: "draft",
    createdAt: Date.now(),
  };
  drafts.unshift(d);
  save();
  return d;
}

export function getDraftsByCreator(wallet: string) {
  load();
  return drafts.filter((d) => d.creatorWallet === wallet.toLowerCase());
}

export function markDraftRegistered(id: string) {
  load();
  const i = drafts.findIndex((d) => d.id === id);
  if (i !== -1) {
    drafts[i].status = "registered";
    save();
  }
}
