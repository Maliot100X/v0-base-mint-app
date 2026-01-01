"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, TrendingUp } from "lucide-react"

export function HomeTab() {
  const officialToken = {
    name: "BaseMint",
    ticker: "$MINT",
    price: "$0.0042",
    marketCap: "$420K",
    progress: 85,
    website: "https://basemint.com",
  }

  const tokens = [
    { id: 1, ticker: "$DOGE", name: "Based Doge", progress: 67, marketCap: "$128K", boosts: 5 },
    { id: 2, ticker: "$PEPE", name: "Pepe Chain", progress: 45, marketCap: "$89K", boosts: 12 },
    { id: 3, ticker: "$CHAD", name: "Chad Coin", progress: 92, marketCap: "$245K", boosts: 3 },
    { id: 4, ticker: "$MOON", name: "To The Moon", progress: 34, marketCap: "$56K", boosts: 8 },
    { id: 5, ticker: "$BASED", name: "Based Token", progress: 78, marketCap: "$167K", boosts: 15 },
    { id: 6, ticker: "$ROCKET", name: "Rocket Fuel", progress: 23, marketCap: "$34K", boosts: 2 },
  ]

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Pinned Official Token */}
      <div className="glass rounded-xl p-6 boosted-glow relative">
        <Badge className="absolute top-4 right-4 bg-[#fde047] text-black border-none font-bold">BOOSTED</Badge>
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#00ff41] to-[#00cc33] flex items-center justify-center text-2xl font-bold text-black">
            B
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold">{officialToken.name}</h3>
              <span className="text-lg text-[#00ff41]">{officialToken.ticker}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{"Official BaseMint Platform Token"}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">{"Live Price"}</p>
                <p className="text-xl font-bold text-[#00ff41]">{officialToken.price}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{"Market Cap"}</p>
                <p className="text-xl font-bold">{officialToken.marketCap}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{"Bonding Progress"}</span>
                <span className="text-[#00ff41]">{officialToken.progress}%</span>
              </div>
              <Progress value={officialToken.progress} className="h-2" indicatorClassName="bg-[#fde047]" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#00ff41] text-black hover:bg-[#00ff41]/90 font-bold hover-glow">
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 bg-transparent"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#00ff41]" />
          {"Live Feed"}
        </h2>
        <div className="space-y-3">
          {tokens.map((token) => (
            <div key={token.id} className="glass rounded-lg p-4 hover:bg-[#0f0f0f] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#00ff41]/20 to-[#00cc33]/20 flex items-center justify-center text-xl font-bold border border-[#00ff41]/30">
                    {token.ticker[1]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{token.ticker}</span>
                      <span className="text-sm text-gray-400">{token.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {"Market Cap:"} <span className="text-[#00ff41]">{token.marketCap}</span>
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#fde047]/50 text-[#fde047] hover:bg-[#fde047]/10 bg-transparent"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {"Boost"} ({token.boosts})
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{"Bonding Curve"}</span>
                  <span className="text-[#00ff41]">{token.progress}%</span>
                </div>
                <Progress
                  value={token.progress}
                  className="h-1.5"
                  indicatorClassName="bg-gradient-to-r from-[#00ff41] to-[#00cc33]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
