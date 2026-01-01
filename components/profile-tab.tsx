"use client"

import { ExternalLink, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const myTokens = [
  {
    id: 1,
    name: "Degen Token",
    ticker: "DGEN",
    marketCap: "$432K",
    holders: 1234,
    createdAt: "2 days ago",
  },
  {
    id: 2,
    name: "Based Cat",
    ticker: "BCAT",
    marketCap: "$654K",
    holders: 2156,
    createdAt: "5 days ago",
  },
]

interface ProfileTabProps {
  isConnected: boolean
}

export function ProfileTab({ isConnected }: ProfileTabProps) {
  if (!isConnected) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="glass p-8 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <Plus className="h-10 w-10 text-gray-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold">{"Connect Your Wallet"}</h3>
          <p className="mb-4 text-sm text-gray-400">{"Connect your wallet to view your profile and launched tokens"}</p>
          <Button className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black font-semibold hover-glow">
            Connect Wallet
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="mb-6 glass p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-2 border-[#00ff41]">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-[#00ff41] to-[#00cc33] text-2xl font-bold text-black">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-xl font-bold">@johndegen</h2>
                <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/30">Verified</Badge>
              </div>
              <p className="mb-3 text-sm text-gray-400">{"Token creator • Degen trader • Based on Base"}</p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-bold text-[#00ff41]">{myTokens.length}</span>
                  <span className="ml-1 text-gray-400">Tokens</span>
                </div>
                <div>
                  <span className="font-bold text-[#00ff41]">3.4K</span>
                  <span className="ml-1 text-gray-400">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-[#00ff41]">890</span>
                  <span className="ml-1 text-gray-400">Following</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* My Launched Tokens */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">{"My Launched Tokens"}</h3>
          <Button size="sm" className="bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30">
            <Plus className="mr-1 h-4 w-4" />
            New Token
          </Button>
        </div>

        <div className="space-y-3 pb-4">
          {myTokens.map((token) => (
            <Card key={token.id} className="glass p-4 transition-all hover:border-[#00ff41]/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="font-bold">{token.name}</h4>
                    <Badge variant="outline" className="border-[#00ff41]/30 text-[#00ff41] bg-[#00ff41]/5">
                      ${token.ticker}
                    </Badge>
                  </div>
                  <div className="mb-3 flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">{"Market Cap:"} </span>
                      <span className="font-semibold text-[#00ff41]">{token.marketCap}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{"Holders:"} </span>
                      <span className="font-semibold">{token.holders}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {"Created"} {token.createdAt}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-[#00ff41]">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
