"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Loader2, Rocket, FileText } from "lucide-react"

import { getAllDraftContent } from "@/lib/contentStore"

export function HomeTab() {
  const officialToken = {
    name: "BaseMint Platform",
    ticker: "$BMINT",
    price: "---",
    marketCap: "---",
    progress: 0,
    website: "https://basemint.com",
  }

  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const all = getAllDraftContent()
    setItems(all.sort((a, b) => b.createdAt - a.createdAt))
  }, [])

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* OFFICIAL TOKEN — UNCHANGED */}
      <div className="glass rounded-xl p-4 boosted-glow relative">
        <Badge className="absolute top-3 right-3 bg-[#fde047] text-black border-none font-bold text-[10px]">
          OFFICIAL
        </Badge>
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#00ff41] to-[#00cc33] shadow-[0_0_20px_rgba(0,255,65,0.5)] flex items-center justify-center text-2xl font-bold text-black flex-shrink-0 pixelated border-2 border-[#00ff41]">
            B
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold truncate">{officialToken.name}</h3>
              <span className="text-sm text-[#00ff41] whitespace-nowrap">
                {officialToken.ticker}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Official BaseMint Platform Token
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-gray-500">Live Price</p>
                <p className="text-base font-bold text-[#00ff41]">
                  {officialToken.price}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Market Cap</p>
                <p className="text-base font-bold text-gray-400">
                  {officialToken.marketCap}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">Bonding Progress</span>
                <span className="text-gray-500">---</span>
              </div>
              <Progress
                value={officialToken.progress}
                className="h-1.5"
                indicatorClassName="bg-[#fde047]"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-[#00ff41] text-black font-bold text-xs h-9">
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#00ff41]/30 text-[#00ff41] bg-transparent h-9 w-9 p-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* EXISTING SYNC CARD — UNCHANGED */}
      <div className="glass rounded-lg p-8 text-center">
        <Loader2 className="h-8 w-8 text-[#00ff41] animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400 mb-1 font-semibold">
          Syncing Base Network...
        </p>
        <p className="text-xs text-gray-600">
          New tokens will appear here
        </p>
      </div>

      {/* 🔥 NEW: REAL CONTENT INDEX (PHASE 2 STEP 1) */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
            Latest Creations
          </h3>

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 space-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm truncate">
                  {item.title}
                </span>

                <span
                  className={`text-[10px] uppercase font-mono px-2 py-1 rounded ${
                    item.status === "coined"
                      ? "bg-[#00ff41]/20 text-[#00ff41]"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="text-[10px] text-gray-500 font-mono break-all">
                Creator: {item.creatorWallet}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                {item.status === "coined" ? (
                  <>
                    <Rocket className="w-3 h-3" /> Coined
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3" /> Draft
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
