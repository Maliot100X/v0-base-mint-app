"use client";

import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { Loader2, Rocket, AlertCircle } from "lucide-react";

const PLATFORM_REFERRER = "0x1909b332397144aeb4867B7274a05Dbb25bD1Fec";

export default function LaunchTab() {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [status, setStatus] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

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
      setTimeout(() => {
        setStatus("Coin Launched Successfully!");
        if (data.coinAddress) {
          window.open("https://basescan.org/token/" + data.coinAddress, "_blank");
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Transaction failed");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#050505] p-4 text-white overflow-y-auto pb-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black uppercase text-[#00ff41] tracking-tighter">Launch Token</h2>
        <p className="text-xs text-gray-500 font-mono">Deploy instantly on Base via Zora</p>
      </div>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Coin Name</label>
            <input type="text" placeholder="Base Cat" className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-sm text-white focus:border-[#00ff41] outline-none" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Ticker</label>
            <input type="text" placeholder="BCAT" className="w-full bg-[#0a0a0a] border border-[#333] rounded p-3 text-sm text-white focus:border-[#00ff41] outline-none uppercase" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} />
          </div>
        </div>
        <div className="pt-4">
          <button onClick={handleLaunch} disabled={isMinting || !address} className="w-full bg-gradient-to-r from-[#0052FF] to-[#00ff41] hover:opacity-90 text-white font-black uppercase tracking-wider py-4 rounded flex items-center justify-center gap-2 disabled:opacity-50">
            {isMinting ? <><Loader2 className="animate-spin" /> Processing...</> : <><Rocket size={18} /> LAUNCH COIN NOW</>}
          </button>
          <div className="text-center mt-3 space-y-1">
            <p className="text-yellow-500 text-[10px] font-mono">Fee: ~$0.50 Gas Only</p>
          </div>
        </div>
        {status && (
          <div className="mt-4 p-3 bg-[#111] border border-[#333] rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#00ff41]" />
            <span className="text-xs text-gray-300 font-mono break-all">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}