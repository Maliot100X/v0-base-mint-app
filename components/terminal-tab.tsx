"use client"

import { TrendingUp, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const mockTokens = [
  {
    id: 1,
    name: "PEPE 2.0",
    ticker: "PEPE2",
    description: "The next generation of PEPE memes",
    marketCap: "$1.2M",
    bondingProgress: 85,
    isKing: true,
  },
  {
    id: 2,
    name: "Moon Shot",
    ticker: "MOON",
    description: "To the moon and beyond 🚀",
    marketCap: "$890K",
    bondingProgress: 72,
    isKing: false,
  },
  {
    id: 3,
    name: "Based Cat",
    ticker: "BCAT",
    description: "The most based cat on Base",
    marketCap: "$654K",
    bondingProgress: 58,
    isKing: false,
  },
  {
    id: 4,
    name: "Degen Token",
    ticker: "DGEN",
    description: "For the true degens",
    marketCap: "$432K",
    bondingProgress: 41,
    isKing: false,
  },
  {
    id: 5,
    name: "Crypto Punk",
    ticker: "CPUNK",
    description: "Punk rock meets crypto",
    marketCap: "$287K",
    bondingProgress: 29,
    isKing: false,
  },
]

export function TerminalTab() {
  return (
    <div className="h-full overflow-y-auto p-4">
      {/* King of the Hill */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-5 w-5 text-[#fde047]" />
          <h2 className="text-lg font-bold text-[#fde047]">King of the Hill</h2>
        </div>
        {mockTokens
          .filter((token) => token.isKing)
          .map((token) => (
            <Card
              key={token.id}
              className="gold-glow border-2 border-[#fde047]/50 bg-gradient-to-br from-[#1a1410] to-[#0d0d0d] p-4"
            >
              <div className="flex gap-4">
                <div className="pixel-art h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#fde047] to-[#f59e0b] flex items-center justify-center text-2xl font-bold text-black">
                  👑
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#fde047]">{token.name}</h3>
                    <Badge className="bg-[#fde047]/20 text-[#fde047] border-[#fde047]/30">${token.ticker}</Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-400">{token.description}</p>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="font-bold text-[#fde047]">{token.marketCap}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Bonding Curve</span>
                      <span>{token.bondingProgress}%</span>
                    </div>
                    <Progress
                      value={token.bondingProgress}
                      className="h-2 bg-[#1a1a1a]"
                      indicatorClassName="bg-gradient-to-r from-[#fde047] to-[#f59e0b]"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Live Feed */}
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-[#86efac]" />
        <h2 className="text-lg font-bold">Live Feed</h2>
      </div>
      <div className="space-y-3 pb-4">
        {mockTokens
          .filter((token) => !token.isKing)
          .map((token) => (
            <Card
              key={token.id}
              className="border-[#1a1a1a] bg-[#0d0d0d] p-4 transition-all hover:border-[#86efac]/30 hover:bg-[#86efac]/5"
            >
              <div className="flex gap-3">
                <div className="pixel-art h-14 w-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#86efac] to-[#4ade80] flex items-center justify-center text-xl">
                  🎮
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-bold">{token.name}</h3>
                    <Badge variant="outline" className="border-[#86efac]/30 text-[#86efac]">
                      ${token.ticker}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-gray-400">{token.description}</p>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Market Cap</span>
                    <span className="font-semibold text-[#86efac]">{token.marketCap}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Bonding Curve</span>
                      <span>{token.bondingProgress}%</span>
                    </div>
                    <Progress
                      value={token.bondingProgress}
                      className="h-1.5 bg-[#1a1a1a]"
                      indicatorClassName="bg-gradient-to-r from-[#86efac] to-[#4ade80]"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
