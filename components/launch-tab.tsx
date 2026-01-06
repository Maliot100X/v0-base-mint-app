"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Upload } from "lucide-react";
import { resolveIpfs } from "@/lib/ipfs";

import {
  createDraftContent,
  getDraftsByCreator,
  DraftContent,
} from "@/lib/contentStore";

import {
  getOrCreateCoinIntent,
  getCoinIntentByContent,
  CoinIntent,
} from "@/lib/coinIntentStore";

function formatSupply1B(ticker: string) {
  const t = (ticker || "").toUpperCase();
  return `1B ${t || "TOKEN"}`;
}

export function LaunchTab() {
  const { address } = useAccount();

  const [drafts, setDrafts] = useState<DraftContent[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [previewIntent, setPreviewIntent] = useState<CoinIntent | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Phase-1 UI: “Search Creator Coin”
  const [searchCreatorCoin, setSearchCreatorCoin] = useState("");

  // This is NOT used to send tx in Phase-1.
  const [creatorCoinAddress, setCreatorCoinAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  useEffect(() => {
    if (!address) return;
    const d = getDraftsByCreator(address);
    setDrafts(d);

    // Restore preview if user had already “Coin It” on a draft previously
    // (this is the Phase-1 regression fix at the UI level).
    if (selectedDraftId) {
      const existing = getCoinIntentByContent(selectedDraftId);
      if (existing) setPreviewIntent(existing);
    }
  }, [address]); // intentionally only when wallet changes

  const localPreviewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  async function handleCreateDraft() {
    if (!address || !title || !imageFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload-ipfs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("IPFS upload failed");

      const data = await res.json();
      const ipfsUrl = data?.ipfsUrl || (data?.cid ? `ipfs://${data.cid}` : null);
      if (!ipfsUrl) throw new Error("No CID returned");

      createDraftContent({
        creatorWallet: address,
        title,
        description,
        prompt: title,
        imageUrl: ipfsUrl,
      });

      setTitle("");
      setDescription("");
      setImageFile(null);

      const d = getDraftsByCreator(address);
      setDrafts(d);
    } finally {
      setIsUploading(false);
    }
  }

  function handleCoinIt(draft: DraftContent) {
    if (!address) return;

    setSelectedDraftId(draft.id);

    const intent = getOrCreateCoinIntent({
      contentId: draft.id,
      creatorAddress: address,
      // Keep existing Phase-1 behavior. Do not guess Farcaster username here.
      creatorName: "BaseMint",
      contentText: draft.description || draft.title,
      imageUrl: draft.imageUrl,
      creatorCoinAddress,
    });

    setPreviewIntent(intent);
  }

  return (
    <div className="h-full p-4 overflow-y-auto pb-20">
      <h2 className="text-2xl font-black text-[#00ff41] text-center mb-4">
        Create Content
      </h2>

      {/* CONTENT CREATE */}
      <div className="max-w-sm mx-auto space-y-3 mb-6">
        <input
          placeholder="Title"
          className="w-full bg-[#0a0a0a] border p-2 text-sm rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full bg-[#0a0a0a] border p-2 text-xs rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        {localPreviewUrl && (
          <img
            src={localPreviewUrl}
            className="w-full rounded border object-cover"
            alt="Local preview"
          />
        )}

        <button
          onClick={handleCreateDraft}
          disabled={isUploading}
          className="w-full bg-[#00ff41] text-black font-black text-xs py-2 rounded"
        >
          <Upload size={14} className="inline mr-1" />
          {isUploading ? "Uploading…" : "Create Draft"}
        </button>
      </div>

      {/* DRAFT LIST */}
      <div className="max-w-sm mx-auto space-y-3">
        {drafts.map((draft) => (
          <div key={draft.id} className="border rounded p-3 bg-[#0a0a0a]">
            <div className="flex gap-3">
              <img
                src={resolveIpfs(draft.imageUrl)}
                className="w-14 h-14 rounded object-cover"
                alt={draft.title}
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

      {/* PHASE-1: COIN INTENT + PREVIEW (EMERGE STYLE) */}
      <div className="max-w-sm mx-auto mt-6 space-y-3">
        <div className="border rounded p-4 bg-[#0a0a0a]">
          <p className="text-xs font-black text-[#00ff41] mb-2">
            Search Creator Coin
          </p>
          <input
            className="w-full bg-[#0a0a0a] border p-2 text-xs rounded font-mono"
            placeholder="Search by creator / address / handle (Phase 1 UI only)"
            value={searchCreatorCoin}
            onChange={(e) => setSearchCreatorCoin(e.target.value)}
          />

          <p className="text-xs font-black text-[#00ff41] mt-4 mb-2">
            Pair content to a creator coin
          </p>

          {/* Keep the address field (Phase-1 intent only, NO TX). */}
          <input
            className="w-full bg-[#0a0a0a] border p-2 text-xs rounded font-mono"
            value={creatorCoinAddress}
            onChange={(e) => setCreatorCoinAddress(e.target.value)}
          />

          {!previewIntent ? (
            <p className="text-[11px] text-gray-500 mt-3">
              Select a draft and click <span className="font-bold">Coin It</span>{" "}
              to preview the creator coin configuration.
            </p>
          ) : (
            <div className="mt-4 border rounded p-4 bg-black/30">
              <p className="text-xs text-gray-400 mb-2">Creator Coin Preview</p>

              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-gray-500">Token Name</p>
                  <p className="text-sm font-bold">{previewIntent.tokenName}</p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500">Ticker</p>
                  <p className="text-sm font-bold">${previewIntent.ticker}</p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500">Description</p>
                  <p className="text-[11px] text-gray-300">
                    {previewIntent.description}
                  </p>
                </div>

                {previewIntent.imageUrl && (
                  <img
                    src={resolveIpfs(previewIntent.imageUrl)}
                    className="w-full rounded border mt-2"
                    alt="Coin preview"
                  />
                )}

                <div className="mt-3 border-t pt-3">
                  <p className="text-[10px] text-gray-500">YOU RECEIVE</p>
                  <p className="text-base font-black text-[#00ff41]">
                    {formatSupply1B(previewIntent.ticker)}
                  </p>
                </div>

                {/* Phase 1 STOP message (no minting, no Zora, no tx) */}
                <p className="text-[11px] text-gray-500 mt-2">
                  Phase 1 stops here: Draft → Coin Intent → Preview.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
