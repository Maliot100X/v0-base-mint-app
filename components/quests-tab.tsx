"use client"

import { useState } from "react"
import { Trophy, TrendingUp, Zap, Crown, Clock, UserPlus, Rocket, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const quests = [
  {
    id: 1,
    title: "Follow @maliotsol on Farcaster",
    description: "Follow our creator on Farcaster",
    points: 15,
    completed: false,
    icon: UserPlus,
    action: "Verify",
  },
  {
    id: 2,
    title: "Launch your first Coin",
    description: "Create and deploy your first token",
    points: 15,
    completed: false,
    icon: Rocket,
    action: "Launch",
  },
  {
    id: 3,
    title: "Share BaseMint to Warpcast",
    description: 'Share "Just launched on BaseMint! 🚀"',
    points: 10,
    completed: false,
    icon: Share2,
    action: "Share",
  },
]

const leaderboardData = [
  { rank: 1, username: "---", points: 0, badge: "🥇" },
  { rank: 2, username: "---", points: 0, badge: "🥈" },
  { rank: 3, username: "---", points: 0, badge: "🥉" },
  { rank: 4, username: "---", points: 0, badge: "" },
  { rank: 5, username: "---", points: 0, badge: "" },
  { rank: 6, username: "---", points: 0, badge: "" },
  { rank: 7, username: "---", points: 0, badge: "" },
  { rank: 8, username: "---", points: 0, badge: "" },
  { rank: 9, username: "---", points: 0, badge: "" },
  { rank: 10, username: "---", points: 0, badge: "" },
]

export function QuestsTab() {
  const [userPoints] = useState(0)
  const totalPoints = quests.reduce((acc, quest) => acc + (quest.completed ? quest.points : 0), 0)
  const maxPoints = quests.reduce((acc, quest) => acc + quest.points, 0)

  const handleQuestAction = (questId: number, action: string) => {
    if (questId === 3 && action === "Share") {
      const shareText = encodeURIComponent("Just launched on BaseMint! 🚀")
      window.open(`https://warpcast.com/~/compose?text=${shareText}`, "_blank")
    }
    console.log(`[v0] Quest ${questId} action: ${action}`)
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Points Summary */}
      <Card className="glass p-4 neon-glow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-3xl font-bold text-[#00ff41] mb-0.5">{userPoints}</h2>
            <p className="text-xs text-gray-400">Available Points</p>
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
          <h3 className="text-xl font-bold mb-1">Premium Subscription</h3>
          <p className="text-xs text-gray-400">Unlock exclusive benefits</p>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-[#fde047] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">2x Quest Points</p>
              <p className="text-xs text-gray-400">Double points on all quests</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-[#fde047] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">1 FREE Weekly Boost</p>
              <p className="text-xs text-gray-400">30-minute boost every week</p>
            </div>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-[#fde047] to-[#facc15] text-black font-bold h-11 hover:scale-105 transition-transform text-sm">
          <Crown className="h-3.5 w-3.5 mr-2" />
          Subscribe - $9 USDT/month
        </Button>
      </Card>

      {/* Boost Logic Info */}
      <Card className="glass p-3">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-[#00ff41] mt-0.5" />
          <div>
            <h4 className="font-bold text-sm mb-1">How Boosts Work</h4>
            <p className="text-xs text-gray-400 mb-2">Spend points to push tokens to the top:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-[#00ff41]" />
                <span className="text-gray-300">30 minutes:</span>
                <span className="text-[#00ff41] font-bold">100 points</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-[#00ff41]" />
                <span className="text-gray-300">60 minutes:</span>
                <span className="text-[#00ff41] font-bold">180 points</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quests List */}
      <div>
        <h3 className="text-base font-bold mb-2 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#00ff41]" />
          Available Quests
        </h3>
        <div className="space-y-2">
          {quests.map((quest) => {
            const Icon = quest.icon
            return (
              <Card key={quest.id} className="p-3 glass hover:border-[#00ff41]/50 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-[#00ff41]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-[#00ff41]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1">{quest.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{quest.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#00ff41]">+{quest.points} Points</span>
                        <Button
                          size="sm"
                          onClick={() => handleQuestAction(quest.id, quest.action)}
                          className="bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30 h-7 text-xs"
                        >
                          {quest.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#fde047]" />
          Weekly Rankings
        </h3>
        <Card className="glass p-4 border-[#fde047]/20">
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">
              <span className="text-[#fde047] font-bold">Top 10 users</span> win{" "}
              <span className="text-[#fde047] font-bold">1 Month Free Premium</span> at the end of Week 4
            </p>
          </div>
          <div className="space-y-1.5">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-2 rounded ${
                  entry.rank <= 3 ? "bg-[#fde047]/5 border border-[#fde047]/20" : "bg-[#1a1a1a]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 w-6">#{entry.rank}</span>
                  {entry.badge && <span className="text-base">{entry.badge}</span>}
                  <span className="text-sm font-medium">{entry.username}</span>
                </div>
                <span className="text-sm font-bold text-[#00ff41]">{entry.points}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
