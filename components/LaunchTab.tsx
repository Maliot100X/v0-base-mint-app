"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Rocket } from "lucide-react";

import {
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

  /**
   * Load drafts for connected wallet
   */
  useEffect(() => {
    if (!address) return;
    setDrafts(getDraftsByCreator(address));
  }, [address]);

  /**
   * COIN IT (PREVIEW ONLY)
   */
  function handleCoinIt(draft: DraftContent) {
    if (!address) return;

    // If intent already exists, reuse it
    const existing = getCoinIntentByContent(draft.id);
    if (existing) {
      setPreviewIntent(existing);
      return;
    }

    const intent = createCoinIntent({
      contentId: draft.id,
      creatorAddress: address,
      creatorName: draft.creatorFid
        ? `Farcaster #${draft.creatorFid}`
        : address.slice(0, 6),
      contentText: draft.description || draft.title,
    });

    setPreviewIntent(intent);
  }

  return (
    <div className="h-full w-full bg-[#050505] p-4 text-white overflow-y-auto pb-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black uppercase text-[#00ff41] tracking-tighter">
          Launch
        </h2>
        <p className="text-xs text-gray-500 font-mono">
          Content → Coin Preview
        </p>
      </div>

      {/* Drafts */}
      <div className="space-y-4 max-w-sm mx-auto">
        {drafts.length === 0 && (
          <p className="text-xs text-gray-500 text-center">
            No drafts yet
          </p>
        )}

        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              {draft.imageUrl && (
                <img
                  src={draft.imageUrl}
                  className="w-14 h-14 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <p className="text-sm font-bold">{draft.title}</p>
                <p className="text-[10px] text-gray-500">
                  Creator: {draft.creatorWallet.slice(0, 10)}…
                </p>
              </div>

              <button
                onClick={() => handleCoinIt(draft)}
                className="px-3 py-1 text-xs font-black bg-[#00ff41] text-black rounded"
              >
                Coin It
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      {previewIntent && (
        <div className="mt-6 max-w-sm mx-auto border border-[#00ff41]/40 rounded-xl p-4 bg-[#050505]">
          <h4 className="text-sm font-black uppercase text-[#00ff41] mb-2">
            Coin Preview
          </h4>

          <div className="space-y-2 text-xs font-mono">
            <p>
              <span className="text-gray-400">Token:</span>{" "}
              {previewIntent.tokenName}
            </p>
            <p>
              <span className="text-gray-400">Ticker:</span>{" "}
              ${previewIntent.ticker}
            </p>
            <p className="text-gray-400">Description:</p>
            <p className="text-gray-300">
              {previewIntent.description}
            </p>
            <p className="text-yellow-500">
              Status: PREPARED
            </p>
          </div>

          <p className="mt-3 text-[10px] text-gray-500">
            Minting happens in the next step.
          </p>
        </div>
      )}
    </div>
  );
}
