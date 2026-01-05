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
  createCoinIntent,
  getCoinIntentByContent,
  CoinIntent,
} from "@/lib/coinIntentStore";

export default function LaunchTab() {
  const { address } = useAccount();

  const [drafts, setDrafts] = useState<DraftContent[]>([]);
  const [previewIntent, setPreviewIntent] = useState<CoinIntent | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [creatorCoinAddress, setCreatorCoinAddress] = useState(
    "0xe648dc77cff081b000b7c07e9b594a69b2242094"
  );

  useEffect(() => {
    if (!address) return;
    setDrafts(getDraftsByCreator(address));
  }, [address]);

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

      const data = await res.json();
      if (!data.ipfsUrl) throw new Error("IPFS upload failed");

      createDraftContent({
        creatorWallet: address,
        title,
        description,
        prompt: title,
        imageUrl: data.ipfsUrl, // ipfs://CID
      });

      setTitle("");
      setDescription("");
      setImageFile(null);
      setDrafts(getDraftsByCreator(address));
    } finally {
      setIsUploading(false);
    }
  }

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

      {/* INPUT */}
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

      {/* DRAFTS */}
      <div className="max-w-sm mx-auto space-y-3">
        {drafts.map((draft) => (
          <div key={draft.id} className="border rounded p-3 bg-[#0a0a0a]">
            <div className="flex gap-3">
              <img
                src={resolveIpfs(draft.imageUrl)}
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

      {/* PREVIEW */}
      {previewIntent && (
        <div className="max-w-sm mx-auto mt-6 border rounded p-4 bg-[#0a0a0a]">
          <input
            className="w-full border p-2 text-xs rounded mb-3 font-mono"
            value={creatorCoinAddress}
            onChange={(e) => setCreatorCoinAddress(e.target.value)}
          />

          <img
            src={resolveIpfs(previewIntent.imageUrl)}
            className="w-full rounded border mb-3"
          />

          <p className="text-xs text-gray-400">
            Minting is next (Phase 4). Preview only.
          </p>
        </div>
      )}
    </div>
  );
}
