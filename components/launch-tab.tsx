"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Upload } from "lucide-react";
import { resolveIpfs } from "@/lib/ipfs";

import {
  getOrCreateCoinIntent,
  getCoinIntentByContent,
  CoinIntent,
} from "@/lib/coinIntentStore";

type Draft = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
};

function formatSupply1B(ticker: string) {
  return `1B ${(ticker || "TOKEN").toUpperCase()}`;
}

export function LaunchTab() {
  const { address } = useAccount();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [previewIntent, setPreviewIntent] = useState<CoinIntent | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [searchCreatorCoin, setSearchCreatorCoin] = useState("");
  const [creatorCoinAddress, setCreatorCoinAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  /* --------------------------------
     LOAD DRAFTS (PERSISTED)
  -------------------------------- */
  useEffect(() => {
    if (!address) return;

    fetch(`/api/content?creator=${address}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.creations)) {
          setDrafts(data.creations);
        }
      })
      .catch(console.error);
  }, [address]);

  const localPreviewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  /* --------------------------------
     CREATE DRAFT (REAL BACKEND)
  -------------------------------- */
  async function handleCreateDraft() {
    if (!address || !title || !imageFile) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);

      const upload = await fetch("/api/upload-ipfs", {
        method: "POST",
        body: fd,
      });

      if (!upload.ok) throw new Error("IPFS upload failed");

      const up = await upload.json();
      const ipfsUrl = up?.ipfsUrl || `ipfs://${up.cid}`;
      if (!ipfsUrl) throw new Error("No IPFS URL");

      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorAddress: address,
          title,
          description,
          imageUrl: ipfsUrl,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const { creation } = await res.json();

      setDrafts((d) => [creation, ...d]);
      setTitle("");
      setDescription("");
      setImageFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }

  /* --------------------------------
     COIN IT (INTENT ONLY)
  -------------------------------- */
  function handleCoinIt(draft: Draft) {
    if (!address) return;

    const intent = getOrCreateCoinIntent({
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

      {/* CREATE */}
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
        {drafts.map((d) => (
          <div key={d.id} className="border rounded p-3 bg-[#0a0a0a]">
            <div className="flex gap-3">
              <img
                src={resolveIpfs(d.imageUrl)}
                className="w-14 h-14 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-bold">{d.title}</p>
                <p className="text-[10px] text-gray-500 truncate">
                  {d.description}
                </p>
              </div>
              <button
                onClick={() => handleCoinIt(d)}
                className="text-xs bg-[#00ff41] text-black px-2 rounded font-black"
              >
                Coin It
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW */}
      <div className="max-w-sm mx-auto mt-6 border rounded p-4 bg-[#0a0a0a]">
        <p className="text-xs font-black text-[#00ff41] mb-2">
          Search Creator Coin
        </p>
        <input
          className="w-full bg-[#0a0a0a] border p-2 text-xs rounded font-mono"
          value={searchCreatorCoin}
          onChange={(e) => setSearchCreatorCoin(e.target.value)}
        />

        <p className="text-xs font-black text-[#00ff41] mt-4 mb-2">
          Pair content to a creator coin
        </p>

        <input
          className="w-full bg-[#0a0a0a] border p-2 text-xs rounded font-mono"
          value={creatorCoinAddress}
          onChange={(e) => setCreatorCoinAddress(e.target.value)}
        />

        {!previewIntent ? (
          <p className="text-[11px] text-gray-500 mt-3">
            Select a draft and click <b>Coin It</b>.
          </p>
        ) : (
          <div className="mt-4 border rounded p-4 bg-black/30">
            <p className="text-sm font-bold">{previewIntent.tokenName}</p>
            <p className="text-sm font-bold">${previewIntent.ticker}</p>
            <p className="text-[11px] text-gray-300">
              {previewIntent.description}
            </p>

            <img
              src={resolveIpfs(previewIntent.imageUrl)}
              className="w-full rounded border mt-2"
            />

            <div className="mt-3 border-t pt-3">
              <p className="text-[10px] text-gray-500">YOU RECEIVE</p>
              <p className="text-base font-black text-[#00ff41]">
                {formatSupply1B(previewIntent.ticker)}
              </p>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">
              Phase 1 stops here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
