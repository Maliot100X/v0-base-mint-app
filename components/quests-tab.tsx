"use client"

import { useState } from "react"
import { Check, Trophy, TrendingUp, Zap, Crown, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    completed: true,
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
  const [userPoints, setUserPoints] = useState(750)
  const [isSubscribed] = useState(false)
  const totalPoints = quests.reduce((acc, quest) => acc + (quest.completed ? quest.points : 0), 0)
  const maxPoints = quests.reduce((acc, quest) => acc + quest.points, 0)

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Points Summary */}
        <Card className="glass p-6 neon-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold text-[#00ff41] mb-1">{userPoints}</h2>
              <p className="text-sm text-gray-400">{"Available Points"}</p>
            </div>
            <Trophy className="h-14 w-14 text-[#fde047]" />
          </div>
          <Progress
            value={(totalPoints / maxPoints) * 100}
            className="h-3 bg-[#1a1a1a]"
            indicatorClassName="bg-gradient-to-r from-[#00ff41] to-[#00cc33]"
          />
          <p className="mt-2 text-xs text-gray-500 text-right">
            {totalPoints} / {maxPoints} quest points earned
          </p>
        </Card>

        {/* Premium Subscription Card */}
        <Card className="glass p-6 border-2 border-[#fde047]/30 boosted-glow relative overflow-hidden">
          <Badge className="absolute top-4 right-4 bg-[#fde047] text-black border-none font-bold">
            <Crown className="h-3 w-3 mr-1" />
            PREMIUM
          </Badge>
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-2">{"Premium Subscription"}</h3>
            <p className="text-sm text-gray-400">{"Unlock exclusive benefits and boost your presence"}</p>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-[#fde047] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{"2x Quest Points"}</p>
                <p className="text-sm text-gray-400">{"Earn double points on all quests"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-[#fde047] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{"1 FREE Weekly Boost"}</p>
                <p className="text-sm text-gray-400">{"30-minute boost token every week"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-[#fde047] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{"Premium Badge"}</p>
                <p className="text-sm text-gray-400">{"Stand out with exclusive badge"}</p>
              </div>
            </div>
          </div>
          {!isSubscribed ? (
            <Button className="w-full bg-gradient-to-r from-[#fde047] to-[#facc15] text-black font-bold py-6 hover:scale-105 transition-transform">
              <Crown className="h-4 w-4 mr-2" />
              {"Subscribe Now - 0.01 ETH/month"}
            </Button>
          ) : (
            <Badge className="w-full justify-center py-3 bg-[#00ff41] text-black font-bold">
              <Check className="h-4 w-4 mr-2" />
              {"Active Subscription"}
            </Badge>
          )}
        </Card>

        {/* Boost Logic Info */}
        <Card className="glass p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-[#00ff41] mt-0.5" />
            <div>
              <h4 className="font-bold mb-1">{"How Boosts Work"}</h4>
              <p className="text-sm text-gray-400 mb-2">
                {"Spend your earned points to push tokens to the top of the Home feed. Boost durations:"}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#00ff41]" />
                  <span className="text-gray-300">{"30 minutes:"}</span>
                  <span className="text-[#00ff41] font-bold">{"100 points"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#00ff41]" />
                  <span className="text-gray-300">{"60 minutes:"}</span>
                  <span className="text-[#00ff41] font-bold">{"180 points"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quests List */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#00ff41]" />
            {"Available Quests"}
          </h3>
          <div className="space-y-3">
            {quests.map((quest) => (
              <Card
                key={quest.id}
                className={`p-4 transition-all ${
                  quest.completed ? "glass border-[#00ff41]/30" : "glass hover:border-[#00ff41]/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{quest.title}</h4>
                      {quest.daily && (
                        <Badge className="bg-[#fde047]/20 text-[#fde047] border-[#fde047]/30 text-xs">Daily</Badge>
                      )}
                      {quest.completed && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00ff41]">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#00ff41]">
                        +{quest.points} points{" "}
                        {isSubscribed && !quest.completed && <span className="text-[#fde047]">(2x)</span>}
                      </span>
                      {!quest.completed && (
                        <Button
                          size="sm"
                          className="bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30"
                        >
                          Complete
                        </Button>
                      )}
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
