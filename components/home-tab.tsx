"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Loader2 } from "lucide-react"

export function HomeTab() {
  const officialToken = {
    name: "BaseMint",
    ticker: "$BMINT",
    price: "$0.0042",
    marketCap: "$420K",
    progress: 85,
    website: "https://basemint.com",
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Pinned Official Token - $BMINT */}
      <div className="glass rounded-xl p-4 boosted-glow relative">
        <Badge className="absolute top-3 right-3 bg-[#fde047] text-black border-none font-bold text-[10px]">
          BOOSTED
        </Badge>
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 rounded-xl bg-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.5)] flex items-center justify-center text-xl font-bold text-black flex-shrink-0">
            B
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold truncate">{officialToken.name}</h3>
              <span className="text-sm text-[#00ff41] whitespace-nowrap">{officialToken.ticker}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{"Official BaseMint Platform Token"}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-gray-500">{"Live Price"}</p>
                <p className="text-base font-bold text-[#00ff41]">{officialToken.price}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">{"Market Cap"}</p>
                <p className="text-base font-bold">{officialToken.marketCap}</p>
              </div>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">{"Bonding Progress"}</span>
                <span className="text-[#00ff41]">{officialToken.progress}%</span>
              </div>
              <Progress value={officialToken.progress} className="h-1.5" indicatorClassName="bg-[#fde047]" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#00ff41] text-black hover:bg-[#00ff41]/90 font-bold text-xs h-9">
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 bg-transparent h-9 w-9 p-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-lg p-8 text-center">
        <Loader2 className="h-8 w-8 text-[#00ff41] animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400 mb-1">{"Scanning Base for new tokens..."}</p>
        <p className="text-xs text-gray-600">{"Live feed will appear here"}</p>
      </div>
    </div>
  )
}
