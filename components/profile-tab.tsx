"use client"

import { useState } from "react"
import { User, Zap, Crown, Coins, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfileTabProps {
  isConnected: boolean
}

type ProfileView = "coins" | "holdings" | "boosts" | "subscription"

export function ProfileTab({ isConnected }: ProfileTabProps) {
  const [activeView, setActiveView] = useState<ProfileView>("coins")

  const profileViews = [
    { id: "coins" as ProfileView, label: "My Coins", icon: Coins },
    { id: "holdings" as ProfileView, label: "My Holdings", icon: TrendingUp },
    { id: "boosts" as ProfileView, label: "Boosts", icon: Zap },
    { id: "subscription" as ProfileView, label: "Subscription", icon: Crown },
  ]

  if (!isConnected) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="glass p-6 text-center max-w-sm">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="mb-2 text-lg font-bold">Connect to View Profile</h3>
          <p className="mb-4 text-xs text-gray-400">
            Sign in with Farcaster and connect your wallet to view your profile
          </p>
          <Button className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black font-semibold hover-glow text-sm h-10">
            Get Started
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="glass border-b border-[#1a1a1a] p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00ff41] to-[#00cc33] flex items-center justify-center text-xl font-bold text-black">
            ?
          </div>
          <div>
            <h3 className="text-base font-bold">Guest</h3>
            <p className="text-xs text-gray-500">0x...</p>
          </div>
        </div>
      </div>

      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="flex items-center overflow-x-auto">
          {profileViews.map((view) => {
            const Icon = view.icon
            const isActive = activeView === view.id
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all border-b-2 ${
                  isActive ? "text-[#00ff41] border-[#00ff41]" : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {view.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="p-4">
        {activeView === "coins" && (
          <Card className="glass p-6 text-center">
            <p className="text-sm text-gray-400">No tokens launched yet</p>
            <p className="text-xs text-gray-600 mt-1">Create your first token on the Launch tab</p>
          </Card>
        )}

        {activeView === "holdings" && (
          <Card className="glass p-6 text-center">
            <p className="text-sm text-gray-400">No holdings yet</p>
            <p className="text-xs text-gray-600 mt-1">Buy tokens to see them here</p>
          </Card>
        )}

        {activeView === "boosts" && (
          <div className="space-y-3">
            <Card className="glass p-4 border-[#00ff41]/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-base mb-1">30 Minute Boost</h4>
                  <p className="text-xs text-gray-400">Push your token to the top of the feed</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#00ff41]">$3</p>
                  <p className="text-[10px] text-gray-500">USDT</p>
                </div>
              </div>
              <Button
                className="w-full bg-[#00ff41] text-black hover:bg-[#00ff41]/90 font-semibold text-sm h-9"
                onClick={() => console.log("[v0] Payment to 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec")}
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Purchase Boost
              </Button>
            </Card>

            <Card className="glass p-4 border-[#00ff41]/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-base mb-1">1 Hour Boost</h4>
                  <p className="text-xs text-gray-400">Extended visibility for your token</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#00ff41]">$5</p>
                  <p className="text-[10px] text-gray-500">USDT</p>
                </div>
              </div>
              <Button
                className="w-full bg-[#00ff41] text-black hover:bg-[#00ff41]/90 font-semibold text-sm h-9"
                onClick={() => console.log("[v0] Payment to 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec")}
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Purchase Boost
              </Button>
            </Card>

            <p className="text-xs text-gray-500 text-center mt-4">
              Payments processed to: 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec
            </p>
          </div>
        )}

        {activeView === "subscription" && (
          <Card className="glass p-6 border-[#fde047]/20 bg-gradient-to-br from-[#fde047]/5 to-transparent">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-12 w-12 text-[#fde047]" />
            </div>
            <h4 className="font-bold text-xl text-center mb-2">Premium Subscription</h4>
            <p className="text-3xl font-black text-center text-[#fde047] mb-4">
              $9 <span className="text-sm text-gray-400">USDT / Month</span>
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00ff41]"></div>
                <span>Double Quest Points (2x rewards)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00ff41]"></div>
                <span>1 Free Weekly Boost (30 min)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00ff41]"></div>
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00ff41]"></div>
                <span>Exclusive Badge</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#fde047] to-[#facc15] text-black hover:opacity-90 font-bold text-base py-6"
              onClick={() => console.log("[v0] Payment to 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec")}
            >
              <Crown className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
