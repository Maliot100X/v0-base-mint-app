"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Upload } from "lucide-react";

import {
  createDraftContent,
  getDraftsByCreator,
  DraftContent,
} from "@/lib/contentStore";

import {
  createCoinIntent,
  getCoinIntentByContent,
} from "@/lib/coinIntentStore";

export default function LaunchTab() {
  const { address } = useAccount();

  const [drafts, setDrafts] = useState<DraftContent[]>([]);
  const [previewIntent, setPreviewIntent] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Load drafts for connected wallet
  useEffect(() => {
    if (!address) return;
    setDrafts(getDraftsByCreator(address));
  }, [address]);

  // Create Draft (CONTENT ENTRY)
  function handleCreateDraft() {
    if (!address || !title || !imageUrl) return;

    createDraftContent({
      creatorWallet: address,
      title,
      description,
      prompt: title,
      imageUrl,
    });

    setTitle("");
    setDescription("");
    setImageUrl("");

    setDrafts(getDraftsByCreator(address));
  }

  // Coin It (PREVIEW ONLY)
  function handleCoinIt(draft: DraftContent) {
    if (!address) return;

    const existing = getCoinIntentByContent(draft.id);
    if (existing) {
      setPreviewIntent(existing);
      return;
    }

    const intent = createCoinIntent({
      contentId: draft.id,
      creatorAddress: address,
      creatorName: address.slice(0, 6),
      contentText: draft.description || draft.title,
    });

    setPreviewIntent(intent);
  }

  return (
    <div className="h-full w-full bg-[#050505] p-4 text-white overflow-y-auto pb-20">
      <h2 className="text-2xl font-black uppercase text-[#00ff41] text-center mb-4">
        Create Content
      </h2>

      {/* CONTENT INPUT */}
      <div className="max-w-sm mx-auto space-y-3 mb-6">
        <input
          placeholder="Title"
          className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-xs rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Image URL"
          className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-xs rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button
          onClick={handleCreateDraft}
          className="w-full bg-[#00ff41] text-black font-black text-xs py-2 rounded"
        >
          <Upload size={14} className="inline mr-1" />
          Create Draft
        </button>
      </div>

      {/* DRAFT LIST */}
      <div className="max-w-sm mx-auto space-y-3">
        {drafts.length === 0 && (
          <p className="text-xs text-gray-500 text-center">
            No drafts yet
          </p>
        )}

        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="border border-[#222] rounded p-3 bg-[#0a0a0a]"
          >
            <div className="flex gap-3">
              <img
                src={draft.imageUrl}
                className="w-14 h-14 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-bold">{draft.title}</p>
                <p className="text-[10px] text-gray-500 truncate">
                  {draft.description}
                </p>
              </div>
              <button
                onClick={() => handleCoinIt(draft)}
                className="text-xs bg-[#00ff41] text-black px-2 rounded font-black"
              >
                Coin It
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COIN PREVIEW */}
      {previewIntent && (
        <div className="max-w-sm mx-auto mt-6 border border-[#00ff41]/40 rounded p-4">
          <h4 className="text-xs font-black text-[#00ff41] mb-2">
            Coin Preview
          </h4>
          <p className="text-xs">Name: {previewIntent.tokenName}</p>
          <p className="text-xs">Ticker: ${previewIntent.ticker}</p>
          <p className="text-[10px] text-gray-400 mt-1">
            {previewIntent.description}
          </p>
        </div>
      )}
    </div>
  );
}
