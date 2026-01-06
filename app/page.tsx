"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { createPublicClient, http, formatEther } from "viem";
import { base } from "viem/chains";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Rocket,
  Gift,
  Trophy,
  User,
  Wallet,
  Monitor,
  RefreshCw,
} from "lucide-react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";

/* ─── TABS (MATCH YOUR REAL FILES) ─── */
import { HomeTab } from "@/components/home-tab";
import { LaunchTab } from "@/components/launch-tab";
import { AirdropTab } from "@/components/airdrop-tab";
import { QuestsTab } from "@/components/quests-tab";
import { ProfileTab } from "@/components/profile-tab";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

function BaseMintAppContent() {
  const [activeTab, setActiveTab] = useState<
    "home" | "launch" | "airdrop" | "quests" | "profile"
  >("home");

  const [farcasterContext, setFarcasterContext] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [manualBalance, setManualBalance] = useState("0.00");

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });

  const effectiveAddress = address || manualAddress;

  const displayBalance = address
    ? balance
      ? parseFloat(formatEther(balance.value)).toFixed(4)
      : "0.00"
    : manualBalance;

  const virtualUser = useMemo(() => {
    if (farcasterContext?.user) return farcasterContext.user;
    if (!effectiveAddress) return null;

    return {
      username: ensName || `${effectiveAddress.slice(0, 6)}…`,
      displayName: "BaseMint Member",
      pfpUrl: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${effectiveAddress}`,
    };
  }, [farcasterContext, effectiveAddress, ensName]);

  useEffect(() => {
    (async () => {
      try {
        const ctx = await sdk.context;
        if (ctx?.user) setFarcasterContext(ctx);
        sdk.actions.ready();
      } catch {}
    })();
  }, []);

  const syncFarcasterWallet = async () => {
    const provider = await sdk.wallet.getEthereumProvider();
    if (!provider) return;

    const accounts = (await provider.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts[0]) return;

    setManualAddress(accounts[0]);
    const bal = await publicClient.getBalance({
      address: accounts[0] as `0x${string}`,
    });
    setManualBalance(parseFloat(formatEther(bal)).toFixed(4));
    setShowAuthModal(false);
  };

  const handleWagmiConnect = (type: "base" | "injected") => {
    const id = type === "base" ? "coinbaseWalletSDK" : "io.metamask";
    const connector =
      connectors.find((c) => c.id === id) ||
      connectors.find((c) => c.id === "injected") ||
      connectors[0];

    connect({ connector });
    setShowAuthModal(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex h-screen w-full max-w-[430px] flex-col bg-[#050505] text-white border-x border-[#1a1a1a]">
        {/* HEADER */}
        <header className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4 flex justify-between">
          <div className="flex gap-3 items-center">
            <div className="h-12 w-12 rounded-lg border-2 border-[#00ff41] overflow-hidden">
              {virtualUser?.pfpUrl ? (
                <img src={virtualUser.pfpUrl} className="h-full w-full" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[#00ff41] font-black">
                  B
                </div>
              )}
            </div>
            <span className="text-2xl font-black text-[#00ff41]">BASEMINT</span>
          </div>

          <div className="text-right">
            <div className="text-[#00ff41] font-bold text-sm">
              {displayBalance} ETH
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-[9px] text-gray-500 font-mono uppercase"
            >
              {isConnected || manualAddress ? "CONNECTED" : "CONNECT WALLET"}
            </button>
          </div>
        </header>

        {/* NAV */}
        <nav className="flex border-b border-[#1a1a1a] bg-[#0a0a0a]">
          {[
            { id: "home", icon: Home },
            { id: "launch", icon: Rocket },
            { id: "airdrop", icon: Gift },
            { id: "quests", icon: Trophy },
            { id: "profile", icon: User },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-3 flex flex-col items-center ${
                activeTab === t.id ? "text-[#00ff41]" : "text-gray-500"
              }`}
            >
              <t.icon size={16} />
              <span className="text-[10px] uppercase">{t.id}</span>
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === "home" && <HomeTab />}
              {activeTab === "launch" && <LaunchTab />}
              {activeTab === "airdrop" && <AirdropTab />}
              {activeTab === "quests" && <QuestsTab />}
              {activeTab === "profile" && (
                <ProfileTab
                  userContext={virtualUser ? { user: virtualUser } : null}
                  userAddress={effectiveAddress || ""}
                  balance={displayBalance}
                  onSwitch={() => setShowAuthModal(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* AUTH MODAL */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <Card className="p-6 w-full max-w-sm bg-[#0a0a0a]">
                <Button onClick={syncFarcasterWallet} className="w-full mb-2">
                  <RefreshCw size={14} /> Sync Farcaster
                </Button>
                <Button
                  onClick={() => handleWagmiConnect("base")}
                  className="w-full mb-2"
                >
                  <Wallet size={14} /> Base Wallet
                </Button>
                <Button
                  onClick={() => handleWagmiConnect("injected")}
                  className="w-full"
                >
                  <Monitor size={14} /> MetaMask
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(BaseMintAppContent), {
  ssr: false,
});
