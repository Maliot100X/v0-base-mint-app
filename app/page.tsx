"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { createPublicClient, http, formatEther } from "viem"
import { base } from "viem/chains"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Rocket, Gift, Trophy, User } from "lucide-react"
import { HomeTab } from "@/components/home-tab"
import { LaunchTab } from "@/components/launch-tab"
import { AirdropTab } from "@/components/airdrop-tab"
import { QuestsTab } from "@/components/quests-tab"
import { ProfileTab } from "@/components/profile-tab"

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
})

export default function BaseMintApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [userContext, setUserContext] = useState<any>(null)
  const [userAddress, setUserAddress] = useState<string>("")
  const [realBalance, setRealBalance] = useState<string>("0.00")

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        setUserContext(context);
        
        const provider = await sdk.wallet.getEthereumProvider();
        const accounts = await provider.request({ method: "eth_accounts" }) as string[];
        if (accounts[0]) {
          setUserAddress(accounts[0]);
          const balance = await publicClient.getBalance({ address: accounts[0] as `0x${string}` });
          setRealBalance(parseFloat(formatEther(balance)).toFixed(4));
        }
        await sdk.actions.ready();
      } catch (e) {
        console.log("SDK Ready");
      }
    };
    init();
  }, []);

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
            <div className="text-right">
              <div className="text-[#00ff41] font-bold text-sm">{realBalance} ETH</div>
              <div className="text-[9px] text-gray-500 font-mono">
                {userAddress ? `${userAddress.slice(0, 6)}...` : "Connecting..."}
              </div>
            </div>
          </div>
        </header>

        <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 px-2 py-3 transition-all ${activeTab === tab.id ? "text-[#00ff41]" : "text-gray-600"}`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-[10px] font-medium uppercase">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff41]" />}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
              {activeTab === "home" && <HomeTab />}
              {activeTab === "launch" && <LaunchTab />}
              {activeTab === "airdrop" && <AirdropTab />}
              {activeTab === "quests" && <QuestsTab />}
              {activeTab === "profile" && (
                <ProfileTab 
                  userContext={userContext} 
                  userAddress={userAddress}
                  balance={realBalance}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}