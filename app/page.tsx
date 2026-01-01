"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Rocket, Gift, Trophy, User, LogIn } from "lucide-react"
import { HomeTab } from "@/components/home-tab"
import { LaunchTab } from "@/components/launch-tab"
import { AirdropTab } from "@/components/airdrop-tab"
import { QuestsTab } from "@/components/quests-tab"
import { ProfileTab } from "@/components/profile-tab"
import { Button } from "@/components/ui/button"

type Tab = "home" | "launch" | "airdrop" | "quests" | "profile"

export default function BaseMintApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [ethBalance] = useState("0.00")
  const [username] = useState("")

  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "launch" as Tab, label: "Launch", icon: Rocket },
    { id: "airdrop" as Tab, label: "Airdrop", icon: Gift },
    { id: "quests" as Tab, label: "Quests", icon: Trophy },
    { id: "profile" as Tab, label: "Profile", icon: User },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex h-screen w-full max-w-[430px] flex-col bg-[#050505] text-white overflow-hidden border-x border-[#1a1a1a]">
        {/* Top Header with Auth Buttons */}
        <header className="flex flex-col border-b border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-center justify-center gap-3 px-4 py-4 border-b border-[#1a1a1a]/50">
            <div className="relative">
              {/* Pixel art green coin with glow */}
              <div className="h-12 w-12 rounded-lg bg-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.5)] flex items-center justify-center relative pixelated">
                <div className="absolute inset-1 bg-[#00cc33] rounded-md"></div>
                <div className="absolute inset-2 bg-[#00ff41] rounded-sm"></div>
                <span className="relative z-10 text-xl font-black text-black tracking-tighter">B</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-[#00ff41] pixel-font">BASEMINT</h1>
              <p className="text-[10px] text-gray-500 font-mono">{"Pump.fun for Base"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-2">
            <Button
              onClick={() => setIsFarcasterConnected(!isFarcasterConnected)}
              size="sm"
              className={`flex-1 text-xs ${
                isFarcasterConnected
                  ? "bg-[#00ff41] text-black hover:bg-[#00ff41]/90"
                  : "bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30"
              }`}
            >
              <LogIn className="mr-1.5 h-3 w-3" />
              {isFarcasterConnected ? "Farcaster ✓" : "Sign in with Farcaster"}
            </Button>
            <Button
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              size="sm"
              className={`flex-1 text-xs ${
                isWalletConnected
                  ? "bg-[#00ff41] text-black hover:bg-[#00ff41]/90"
                  : "bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30"
              }`}
            >
              {isWalletConnected ? `${ethBalance} ETH` : "Connect Base Wallet"}
            </Button>
          </div>

          {isFarcasterConnected && username && (
            <div className="px-4 py-2 text-xs text-center text-[#00ff41] border-t border-[#1a1a1a]/50">{username}</div>
          )}
        </header>

        {/* Top Navigation */}
        <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex flex-col items-center gap-1 px-2 py-3 transition-all ${
                    isActive ? "text-[#00ff41]" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff41] neon-glow"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "home" && <HomeTab />}
              {activeTab === "launch" && <LaunchTab />}
              {activeTab === "airdrop" && <AirdropTab />}
              {activeTab === "quests" && <QuestsTab />}
              {activeTab === "profile" && <ProfileTab isConnected={isFarcasterConnected && isWalletConnected} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
