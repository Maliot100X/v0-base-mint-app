"use client";

import { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { Loader2, Rocket, AlertCircle } from "lucide-react";

import {
  createDraftContent,
  getDraftsByCreator,
  markDraftAsCoined,
} from "@/lib/contentStore";

const PLATFORM_REFERRER = "0x1909b332397144aeb4867B7274a05Dbb25bD1Fec";

export default function LaunchTab() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [status, setStatus] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  /**
   * STEP 3: Load existing draft (REAL data)
   */
  useEffect(() => {
    if (!address) return;

    const drafts = getDraftsByCreator(address);
    const activeDraft = drafts.find((d) => d.status === "draft");

    if (activeDraft) {
      setDraftId(activeDraft.id);
      setName(activeDraft.title);
      setTicker(activeDraft.prompt || "");
      setStatus("Draft loaded. Ready to launch.");
    }
  }, [address]);

  /**
   * Launch / Coin it (REAL mint)
   */
  const handleLaunch = async () => {
    if (!isConnected || !address) {
      setStatus("Please connect wallet first");
      return;
    }

    if (!name || !ticker) {
      setStatus("Please enter Name and Ticker");
      return;
    }

    setIsMinting(true);

    try {
      let currentDraftId = draftId;

      // Create draft if none exists yet
      if (!currentDraftId) {
        const draft = createDraftContent({
          creatorWallet: address,
          title: name,
          description: "",
          prompt: ticker,
          imageUrl: "",
          status: "draft",
          createdAt: Date.now(),
        });

        currentDraftId = draft.id;
        setDraftId(draft.id);
      }

      setStatus("Preparing coin deployment...");

      const response = await fetch("/api/create-zora-coin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator: address,
          name,
          symbol: ticker,
          platformReferrer: PLATFORM_REFERRER,
        }),
      });

      const data = await response.json();

      if (!data.success || !data.transaction) {
        throw new Error(data.error || "Failed to prepare transaction");
      }

      setStatus("Please sign the transaction...");

      const hash = await sendTransactionAsync({
        to: data.transaction.to,
        data: data.transaction.data,
        value: BigInt(data.transaction.value || "0"),
      });

      setStatus("Coin deploying on Base...");

      // Mark draft as COINED (REAL state change)
      if (currentDraftId) {
        markDraftAsCoined(currentDraftId);
      }

      setTimeout(() => {
        setStatus("Coin launched successfully!");

        if (data.coinAddress) {
          window.open(
            "https://basescan.org/token/" + data.coinAddress,
            "_blank"
          );
        }
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Transaction failed");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#050505] p-4 text-white overflow-y-auto pb-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black uppercase text-[#00ff41] tracking-tighter">
          Launch Token
        </h2>
        <p className="text-xs text-gray-500 font-mono">
          Content → Coin → Indexed
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">
              Coin Name
            </label>
            <input
              type="text"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">
              Ticker
            </label>
            <input
              type="text"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-sm uppercase"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <button
          onClick={handleLaunch}
          disabled={isMinting}
          className="w-full bg-gradient-to-r from-[#0052FF] to-[#00ff41] py-4 rounded font-black uppercase flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isMinting ? (
            <>
              <Loader2 className="animate-spin" /> Processing…
            </>
          ) : (
            <>
              <Rocket size={18} /> COIN IT
            </>
          )}
        </button>

        {status && (
          <div className="mt-4 p-3 bg-[#111] border border-[#333] rounded flex gap-2">
            <AlertCircle className="w-4 h-4 text-[#00ff41]" />
            <span className="text-xs font-mono">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
