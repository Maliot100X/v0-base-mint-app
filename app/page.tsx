"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Rocket, Gift, Trophy, User, Wallet } from "lucide-react"
import { HomeTab } from "@/components/home-tab"
import { LaunchTab } from "@/components/launch-tab"
import { AirdropTab } from "@/components/airdrop-tab"
import { QuestsTab } from "@/components/quests-tab"
import { ProfileTab } from "@/components/profile-tab"
import { Button } from "@/components/ui/button"

type Tab = "home" | "launch" | "airdrop" | "quests" | "profile"

export default function BaseMintApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [isConnected, setIsConnected] = useState(false)
  const [ethBalance] = useState("0.42")
  const [username] = useState("@developer")

  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "launch" as Tab, label: "Launch", icon: Rocket },
    { id: "airdrop" as Tab, label: "Airdrop", icon: Gift },
    { id: "quests" as Tab, label: "Quests", icon: Trophy },
    { id: "profile" as Tab, label: "Profile", icon: User },
  ]

  return (
    <div className="flex h-screen max-h-screen flex-col bg-[#050505] text-white overflow-hidden">
      {/* Top Header with Wallet */}
      <header className="flex items-center justify-between border-b border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00ff41] to-[#00cc33] flex items-center justify-center font-bold text-black text-xl">
            B
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">BaseMint</h1>
            <p className="text-xs text-[#00ff41]">{"Pump.fun for Base"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="text-right mr-2">
              <p className="text-xs text-gray-400">{username}</p>
              <p className="text-sm font-bold text-[#00ff41]">{ethBalance} ETH</p>
            </div>
          )}
          <Button
            onClick={() => setIsConnected(!isConnected)}
            className="bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30 hover-glow"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? "Connected" : "Connect"}
          </Button>
        </div>
      </header>

      {/* Top Navigation */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-4">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 transition-all ${
                  isActive ? "text-[#00ff41]" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
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
            {activeTab === "profile" && <ProfileTab isConnected={isConnected} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
