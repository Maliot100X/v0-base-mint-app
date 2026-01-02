"use client"

import { useEffect, useState, useCallback } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { createPublicClient, http, formatEther } from "viem"
import { base } from "viem/chains"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Rocket, Gift, Trophy, User, X, LogIn } from "lucide-react"
import { HomeTab } from "@/components/home-tab"
import { LaunchTab } from "@/components/launch-tab"
import { AirdropTab } from "@/components/airdrop-tab"
import { QuestsTab } from "@/components/quests-tab"
import { ProfileTab } from "@/components/profile-tab"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
})

export default function BaseMintApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [userContext, setUserContext] = useState<any>(null)
  const [userAddress, setUserAddress] = useState<string>("")
  const [realBalance, setRealBalance] = useState<string>("0.00")
  const [showAuthModal, setShowAuthModal] = useState(false)

  // 1. AUTO-DETECT USER & WALLET
  const refreshWallet = useCallback(async () => {
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_accounts" }) as string[];
      if (accounts[0]) {
        setUserAddress(accounts[0]);
        const balance = await publicClient.getBalance({ address: accounts[0] as `0x${string}` });
        setRealBalance(parseFloat(formatEther(balance)).toFixed(4));
      }
    } catch (e) { console.error("Wallet detection failed"); }
  }, []);

  useEffect(() => {
    const init = async () => {
      const context = await sdk.context;
      setUserContext(context);
      await refreshWallet();
      sdk.actions.ready();
    };
    init();
  }, [refreshWallet]);

  // 2. REAL CONNECT / SWITCH ACTION
  const handleConnect = async () => {
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
      if (accounts[0]) {
        setUserAddress(accounts[0]);
        await refreshWallet();
        setShowAuthModal(false);
      }
    } catch (e) { console.error("Manual connect failed"); }
  };

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "launch", label: "Launch", icon: Rocket },
    { id: "airdrop", label: "Airdrop", icon: Gift },
    { id: "quests", label: "Quests", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col bg-[#050505] text-white overflow-hidden border-x border-[#1a1a1a]">
        {/* HEADER */}
        <header className="flex flex-col border-b border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#00ff41] to-[#00cc33] shadow-[0_0_20px_rgba(0,255,65,0.6)] flex items-center justify-center relative border-2 border-[#00ff41]">
                <span className="relative z-10 text-2xl font-black text-black tracking-tighter">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-[#00ff41] uppercase">BASEMINT</h1>
                <p className="text-[10px] text-gray-500 font-mono">Pump.fun for Base</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="text-[#00ff41] font-bold text-sm">{realBalance} ETH</div>
              <button onClick={() => setShowAuthModal(true)} className="text-[9px] text-gray-500 font-mono uppercase hover:text-[#00ff41]">
                {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Connect Wallet"}
              </button>
            </div>
          </div>
        </header>

        {/* TABS AT TOP */}
        <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] flex">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex-1 flex flex-col items-center gap-1 px-2 py-3 transition-all ${activeTab === tab.id ? "text-[#00ff41]" : "text-gray-500"}`}>
              <tab.icon className="h-4 w-4" />
              <span className="text-[10px] font-medium uppercase">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff41]" />}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
              {activeTab === "home" && <HomeTab />}
              {activeTab === "launch" && <LaunchTab />}
              {activeTab === "airdrop" && <AirdropTab />}
              {activeTab === "quests" && <QuestsTab />}
              {activeTab === "profile" && <ProfileTab userContext={userContext} userAddress={userAddress} balance={realBalance} onSwitch={() => setShowAuthModal(true)} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* AUTH MODAL / SWITCHER */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <Card className="bg-[#0a0a0a] border border-[#00ff41]/20 p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#00ff41] font-bold uppercase tracking-widest text-sm">Wallet Access</h2>
                <X onClick={() => setShowAuthModal(false)} className="cursor-pointer text-gray-500 hover:text-white" />
              </div>
              <div className="space-y-4">
                <Button onClick={handleConnect} className="w-full bg-[#855DCD] text-white py-6 font-bold flex items-center justify-center gap-2">
                  <LogIn size={18} /> SYNC FARCASTER WALLET
                </Button>
                <Button onClick={handleConnect} className="w-full bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 py-6 font-bold">
                  SWITCH TO BASE / METAMASK
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}