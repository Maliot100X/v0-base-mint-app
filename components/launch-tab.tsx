"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Upload } from "lucide-react";
import { resolveIpfs } from "@/lib/ipfs";

import {
  createDraftContent,
  getDraftsByCreator,
  DraftContent,
  markDraftRegistered,
} from "@/lib/contentStore";

import {
  getOrCreateCoinIntent,
  CoinIntent,
} from "@/lib/coinIntentStore";

import { prepareZoraContentMint } from "@/lib/zoraContentMint";

function formatSupply1B(ticker: string) {
  return `1B ${(ticker || "TOKEN").toUpperCase()}`;
}

export function LaunchTab() {
  const { address } = useAccount();
  const { data: wallet } = useWalletClient();

  const [drafts, setDrafts] = useState<DraftContent[]>([]);
  const [previewIntent, setPreviewIntent] = useState<CoinIntent | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [creatorCoinAddress, setCreatorCoinAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  useEffect(() => {
    if (!address) return;
    setDrafts(getDraftsByCreator(address));
  }, [address]);

  const localPreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  // =========================
  // CREATE DRAFT
  // =========================
  async function handleCreateDraft() {
    if (!address || !title || !imageFile) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);

      const res = await fetch("/api/upload-ipfs", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("IPFS upload failed");
      const data = await res.json();

      createDraftContent({
        creatorWallet: address,
        title,
        description,
        prompt: title,
        imageUrl: data.ipfsUrl,
      });

      setTitle("");
      setDescription("");
      setImageFile(null);
      setDrafts(getDraftsByCreator(address));
    } finally {
      setIsUploading(false);
    }
  }

  // =========================
  // COIN IT (REAL ZORA FLOW)
  // =========================
  async function handleCoinIt(draft: DraftContent) {
    if (!address || !wallet) {
      alert("Connect wallet first");
      return;
    }

    // 🔒 STEP 1 — REGISTER CONTENT (REAL MINT)
    if (draft.status === "draft") {
      try {
        // 1️⃣ Build metadata JSON
        const metadata = {
          name: draft.title,
          description: draft.description,
          image: draft.imageUrl,
          external_url: "https://v0-base-mint-app.vercel.app",
          attributes: [
            { trait_type: "Platform", value: "BaseMint" },
            { trait_type: "Type", value: "Content" },
          ],
        };

        // 2️⃣ Upload metadata JSON to Pinata
        const metaRes = await fetch(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pinataContent: metadata }),
          }
        );

        const metaData = await metaRes.json();
        if (!metaData?.IpfsHash) {
          throw new Error("Metadata upload failed");
        }

        const metadataUri = `ipfs://${metaData.IpfsHash}`;

        // 3️⃣ Prepare REAL Zora content mint
        const tx = prepareZoraContentMint({
          creator: address as any,
          metadataUri,
        });

        alert("Confirm content mint in wallet (cheap Base tx)");

        // 4️⃣ Wallet signs transaction
        await wallet.sendTransaction({
          to: tx.to,
          data: tx.data,
          value: tx.value,
        });

        // 5️⃣ Mark content as registered
        markDraftRegistered(draft.id);
        setDrafts(getDraftsByCreator(address));

        alert("Content registered. Click Coin It again to create coin.");
        return;
      } catch (e: any) {
        alert(e.message || "Content mint failed");
        return;
      }
    }

    // 🔓 STEP 2 — CONTENT IS NOW COINABLE
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

      {/* CREATE CONTENT */}
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

      {/* DRAFT LIST */}
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
                <p className="text-[10px] text-[#00ff41]">
                  STATUS: {draft.status.toUpperCase()}
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
        <div className="max-w-sm mx-auto mt-6 border rounded p-4 bg-black/30">
          <p className="text-sm font-bold">{previewIntent.tokenName}</p>
          <p className="text-sm font-bold">${previewIntent.ticker}</p>
          <img
            src={resolveIpfs(previewIntent.imageUrl)}
            className="w-full rounded border mt-2"
          />
          <p className="mt-3 text-[#00ff41] font-black">
            {formatSupply1B(previewIntent.ticker)}
          </p>
        </div>
      )}
    </div>
  );
}
