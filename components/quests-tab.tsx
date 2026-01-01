"use client"

import { useState } from "react"
import { Trophy, TrendingUp, Zap, Crown, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const quests = [
  {
    id: 1,
    title: "Daily Task: Boost a token",
    description: "Use your points to boost any token",
    points: 50,
    completed: false,
    daily: true,
  },
  {
    id: 2,
    title: "Follow @BaseMint",
    description: "Follow us on Farcaster for updates",
    points: 100,
    completed: false,
    daily: false,
  },
  {
    id: 3,
    title: "Verify Subscription",
    description: "Subscribe to unlock premium features",
    points: 500,
    completed: false,
    daily: false,
  },
  {
    id: 4,
    title: "Launch 3 Tokens",
    description: "Create three tokens on BaseMint",
    points: 300,
    completed: false,
    daily: false,
  },
  {
    id: 5,
    title: "Refer 5 Friends",
    description: "Invite friends to join BaseMint",
    points: 250,
    completed: false,
    daily: false,
  },
]

export function QuestsTab() {
  const [userPoints] = useState(0)
  const [isSubscribed] = useState(false)
  const totalPoints = quests.reduce((acc, quest) => acc + (quest.completed ? quest.points : 0), 0)
  const maxPoints = quests.reduce((acc, quest) => acc + quest.points, 0)

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Points Summary */}
        <Card className="glass p-4 neon-glow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-3xl font-bold text-[#00ff41] mb-0.5">{userPoints}</h2>
              <p className="text-xs text-gray-400">{"Available Points"}</p>
            </div>
            <Trophy className="h-12 w-12 text-[#fde047]" />
          </div>
          <Progress
            value={(totalPoints / maxPoints) * 100}
            className="h-2 bg-[#1a1a1a]"
            indicatorClassName="bg-gradient-to-r from-[#00ff41] to-[#00cc33]"
          />
          <p className="mt-2 text-[10px] text-gray-500 text-right">
            {totalPoints} / {maxPoints} quest points earned
          </p>
        </Card>

        {/* Premium Subscription Card */}
        <Card className="glass p-4 border-2 border-[#fde047]/30 boosted-glow relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-[#fde047] text-black px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Crown className="h-3 w-3" />
            PREMIUM
          </div>
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-1">{"Premium Subscription"}</h3>
            <p className="text-xs text-gray-400">{"Unlock exclusive benefits"}</p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-[#fde047] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{"2x Quest Points"}</p>
                <p className="text-xs text-gray-400">{"Double points on all quests"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-[#fde047] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{"1 FREE Weekly Boost"}</p>
                <p className="text-xs text-gray-400">{"30-minute boost every week"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Crown className="h-4 w-4 text-[#fde047] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{"Premium Badge"}</p>
                <p className="text-xs text-gray-400">{"Exclusive badge"}</p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-[#fde047] to-[#facc15] text-black font-bold h-11 hover:scale-105 transition-transform text-sm">
            <Crown className="h-3.5 w-3.5 mr-2" />
            {"Subscribe - 0.01 ETH/month"}
          </Button>
        </Card>

        {/* Boost Logic Info */}
        <Card className="glass p-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-[#00ff41] mt-0.5" />
            <div>
              <h4 className="font-bold text-sm mb-1">{"How Boosts Work"}</h4>
              <p className="text-xs text-gray-400 mb-2">{"Spend points to push tokens to the top:"}</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[#00ff41]" />
                  <span className="text-gray-300">{"30 minutes:"}</span>
                  <span className="text-[#00ff41] font-bold">{"100 points"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[#00ff41]" />
                  <span className="text-gray-300">{"60 minutes:"}</span>
                  <span className="text-[#00ff41] font-bold">{"180 points"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quests List */}
        <div>
          <h3 className="text-base font-bold mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#00ff41]" />
            {"Available Quests"}
          </h3>
          <div className="space-y-2">
            {quests.map((quest) => (
              <Card key={quest.id} className="p-3 glass hover:border-[#00ff41]/50 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm truncate">{quest.title}</h4>
                      {quest.daily && (
                        <span className="bg-[#fde047]/20 text-[#fde047] border border-[#fde047]/30 text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                          Daily
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{quest.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#00ff41]">+{quest.points} points</span>
                      <Button
                        size="sm"
                        className="bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30 h-7 text-xs"
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
