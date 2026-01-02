"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Rocket, Gift, Trophy, User, LogIn, X } from "lucide-react"
import { HomeTab } from "@/components/home-tab"
import { LaunchTab } from "@/components/launch-tab"
import { AirdropTab } from "@/components/airdrop-tab"
import { QuestsTab } from "@/components/quests-tab"
import { ProfileTab } from "@/components/profile-tab"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Tab = "home" | "launch" | "airdrop" | "quests" | "profile"

export default function BaseMintApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [ethBalance] = useState("0.00")
  const [userAddress] = useState("")

  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "launch" as Tab, label: "Launch", icon: Rocket },
    { id: "airdrop" as Tab, label: "Airdrop", icon: Gift },
    { id: "quests" as Tab, label: "Quests", icon: Trophy },
    { id: "profile" as Tab, label: "Profile", icon: User },
  ]

  const handleFarcasterLogin = () => {
    setIsFarcasterConnected(true)
    setShowAuthModal(false)
  }

  const handleWalletConnect = () => {
    setIsWalletConnected(true)
    setShowAuthModal(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col bg-[#050505] text-white overflow-hidden border-x border-[#1a1a1a] shadow-2xl">
        {/* Top Header with Branding */}
        <header className="flex flex-col border-b border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]/50">
            <div className="flex items-center gap-3">
              {/* Pixel-art green coin with B */}
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#00ff41] to-[#00cc33] shadow-[0_0_20px_rgba(0,255,65,0.6)] flex items-center justify-center relative pixelated border-2 border-[#00ff41]">
                  <div className="absolute inset-1 bg-[#00cc33] rounded-md"></div>
                  <div className="absolute inset-2 bg-[#00ff41] rounded-sm"></div>
                  <span className="relative z-10 text-2xl font-black text-black tracking-tighter pixel-font">B</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-[#00ff41] pixel-font">BASEMINT</h1>
                <p className="text-[10px] text-gray-500 font-mono">Pump.fun for Base</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAuthModal(true)}
              size="sm"
              className={`${
                isFarcasterConnected && isWalletConnected
                  ? "bg-[#00ff41] text-black hover:bg-[#00ff41]/90"
                  : "bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30"
              }`}
            >
              <LogIn className="mr-1.5 h-3 w-3" />
              {isFarcasterConnected && isWalletConnected ? `${ethBalance} ETH` : "Connect"}
            </Button>
          </div>
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

        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
          <p className="text-[9px] text-gray-600 font-mono pixel-font">By @maliotsol</p>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <Card className="glass border-[#00ff41]/20 p-6 m-4 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Connect to BaseMint</h3>
                <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleFarcasterLogin}
                  className="w-full bg-[#855DCD] hover:bg-[#855DCD]/90 text-white font-semibold py-5"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in with Farcaster
                </Button>
                <Button
                  onClick={handleWalletConnect}
                  className="w-full bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30 font-semibold py-5"
                >
                  Switch to MetaMask / Base Wallet
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Connect to launch tokens, boost listings, and claim airdrops
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
