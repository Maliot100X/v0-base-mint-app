"use client";

export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { formatEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Rocket, Gift, Trophy, User, X, Wallet, Monitor, RefreshCw } from "lucide-react";
import { useAccount, useBalance, useConnect, useDisconnect, useEnsName } from "wagmi";

// --- TAB IMPORTS ---
import { HomeTab } from "@/components/home-tab";
import LaunchTab from '@/components/LaunchTab'; 
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
  const [activeTab, setActiveTab] = useState("home");
  const [farcasterContext, setFarcasterContext] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [manualBalance, setManualBalance] = useState<string>("0.00");

  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: wagmiBalance } = useBalance({ address: wagmiAddress });
  const { data: ensName } = useEnsName({ address: wagmiAddress || (manualAddress as `0x${string}`) });

  const effectiveAddress = wagmiAddress || manualAddress;
  const isConnected = isWagmiConnected || !!manualAddress;
  const displayBalance = wagmiAddress
    ? (wagmiBalance ? parseFloat(formatEther(wagmiBalance.value)).toFixed(4) : "0.00")
    : manualBalance;

  const virtualUser = useMemo(() => {
    if (farcasterContext?.user) return farcasterContext.user;
    if (effectiveAddress) {
      const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${effectiveAddress}`;
      return {
        username: ensName || `${effectiveAddress.slice(0, 6)}...`,
        displayName: ensName || "BaseMint Member",
        pfpUrl: avatarUrl,
      };
    }
    return null;
  }, [farcasterContext, effectiveAddress, ensName]);

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) setFarcasterContext(context);
        sdk.actions.ready();
      } catch (err) { console.error(err); }
    };
    init();
  }, []);

  const syncFarcasterWallet = async () => {
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider) return;
      const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
      if (accounts[0]) {
        setManualAddress(accounts[0]);
        const bal = await publicClient.getBalance({ address: accounts[0] as `0x${string}` });
        setManualBalance(parseFloat(formatEther(bal)).toFixed(4));
        setShowAuthModal(false);
      }
    } catch (e) { console.error(e); }
  };

  const handleWagmiConnect = (strategy: 'base' | 'injected') => {
    try {
      setManualAddress("");
      // FIXED: Separated MetaMask and Base IDs
      const targetId = strategy === 'base' ? 'coinbaseWalletSDK' : 'io.metamask';
      
      let connector = connectors.find(c => c.id === targetId);
      
      // Fallback for MetaMask (sometimes called 'injected')
      if (!connector && strategy === 'injected') {
        connector = connectors.find(c => c.id === 'injected');
      }

      if (connector) {
        connect({ connector });
      } else {
        // Ultimate fallback
        connect({ connector: connectors[0] });
      }
      
      setShowAuthModal(false);
    } catch (e) { console.error("Connect Failed", e); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col bg-[#050505] text-white overflow-hidden border-x border-[#1a1a1a]">
        <header className="flex flex-col border-b border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#111] flex items-center justify-center border-2 border-[#00ff41] overflow-hidden">
                {virtualUser?.pfpUrl ? <img src={virtualUser.pfpUrl} alt="User" className="h-full w-full object-cover" /> : <span className="text-2xl font-black text-[#00ff41]">B</span>}
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-[#00ff41] uppercase">BASEMINT</h1>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="text-[#00ff41] font-bold text-sm">{displayBalance} ETH</div>
              <button onClick={() => setShowAuthModal(true)} className="text-[9px] text-gray-500 font-mono uppercase hover:text-[#00ff41] transition-colors border border-transparent hover:border-[#00ff41]/30 px-2 py-1 rounded">{isConnected ? "CONNECTED" : "CONNECT WALLET"}</button>
            </div>
          </div>
        </header>

        <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] flex">
          {[{ id: "home", label: "Home", icon: Home }, { id: "launch", label: "Launch", icon: Rocket }, { id: "airdrop", label: "Airdrop", icon: Gift }, { id: "quests", label: "Quests", icon: Trophy }, { id: "profile", label: "Profile", icon: User }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex-1 flex flex-col items-center gap-1 py-3 ${activeTab === tab.id ? "text-[#00ff41]" : "text-gray-500"}`}>
              <tab.icon className="h-4 w-4" />
              <span className="text-[10px] uppercase">{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff41]" />}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              {activeTab === "home" && <HomeTab />}
              {activeTab === "launch" && <LaunchTab />}
              {activeTab === "airdrop" && <AirdropTab />}
              {activeTab === "quests" && <QuestsTab />}
              {activeTab === "profile" && <ProfileTab userContext={virtualUser ? { user: virtualUser } : null} userAddress={effectiveAddress || ""} balance={displayBalance} onSwitch={() => setShowAuthModal(true)} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showAuthModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <Card className="bg-[#0a0a0a] border border-[#00ff41]/20 p-6 w-full max-sm shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[#00ff41] font-bold uppercase text-sm">{isConnected ? "Wallet Settings" : "Select Connection"}</h2>
                  <X onClick={() => setShowAuthModal(false)} className="cursor-pointer text-gray-500 hover:text-[#00ff41]" />
                </div>
                <div className="space-y-4">
                  {!isConnected ? (
                    <>
                      <Button onClick={syncFarcasterWallet} className="w-full bg-[#855DCD] text-white py-6 font-bold flex gap-2"><RefreshCw size={18} /> SYNC FARCASTER WALLET</Button>
                      <Button onClick={() => handleWagmiConnect('base')} className="w-full bg-[#0052FF] text-white py-6 font-bold flex gap-2"><Wallet size={18} /> BASE SMART WALLET</Button>
                      <Button onClick={() => handleWagmiConnect('injected')} className="w-full bg-[#1a1a1a] text-gray-300 py-6 font-bold flex gap-2"><Monitor size={14} /> METAMASK / BROWSER</Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-[#111] rounded border border-[#222] text-center mb-4"><p className="text-[#00ff41] font-mono font-bold truncate">{virtualUser?.username}</p></div>
                      <Button onClick={() => { disconnect(); setManualAddress(""); }} className="w-full bg-red-900/20 text-red-500 py-4 font-bold">DISCONNECT</Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const BaseMintApp = nextDynamic(() => Promise.resolve(BaseMintAppContent), { ssr: false, loading: () => <div className="min-h-screen bg-black" /> });
export default BaseMintApp;
