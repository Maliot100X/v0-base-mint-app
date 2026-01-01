"use client"

import { useState } from "react"
import { Gift, Send, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const availableClaims = [
  {
    id: 1,
    tokenName: "Based Doge",
    ticker: "$DOGE",
    amount: "1,000 tokens",
    creator: "@creator1",
    requirement: "Hold 1M tokens",
    claimed: false,
  },
  {
    id: 2,
    tokenName: "Pepe Chain",
    ticker: "$PEPE",
    amount: "500 tokens",
    creator: "@creator2",
    requirement: "30+ holders",
    claimed: true,
  },
  {
    id: 3,
    tokenName: "Rocket Fuel",
    ticker: "$ROCKET",
    amount: "2,500 tokens",
    creator: "@rocketman",
    requirement: "Follow creator",
    claimed: false,
  },
]

export function AirdropTab() {
  const [tokenAddress, setTokenAddress] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [requirement, setRequirement] = useState("")

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-bold flex items-center justify-center gap-2">
            <Gift className="h-8 w-8 text-[#00ff41]" />
            Airdrops
          </h2>
          <p className="text-sm text-gray-400">{"Creators share tokens with the community"}</p>
        </div>

        <Tabs defaultValue="claim" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0a0a0a] border border-[#00ff41]/20">
            <TabsTrigger
              value="claim"
              className="data-[state=active]:bg-[#00ff41]/10 data-[state=active]:text-[#00ff41]"
            >
              <Gift className="h-4 w-4 mr-2" />
              Available Claims
            </TabsTrigger>
            <TabsTrigger
              value="distribute"
              className="data-[state=active]:bg-[#00ff41]/10 data-[state=active]:text-[#00ff41]"
            >
              <Send className="h-4 w-4 mr-2" />
              Distribute Tokens
            </TabsTrigger>
          </TabsList>

          {/* User View: Available Claims */}
          <TabsContent value="claim" className="mt-6">
            <div className="space-y-3">
              {availableClaims.map((claim) => (
                <Card key={claim.id} className={`glass p-4 ${claim.claimed ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">{claim.tokenName}</h4>
                        <Badge variant="outline" className="border-[#00ff41]/30 text-[#00ff41] bg-[#00ff41]/5">
                          {claim.ticker}
                        </Badge>
                        {claim.claimed && <Badge className="bg-gray-700 text-gray-300">Claimed</Badge>}
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm">
                          <span className="text-gray-400">{"Amount:"}</span>{" "}
                          <span className="text-[#00ff41] font-semibold">{claim.amount}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">{"Creator:"}</span>{" "}
                          <span className="text-white">{claim.creator}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">{"Requirement:"}</span>{" "}
                          <span className="text-white">{claim.requirement}</span>
                        </p>
                      </div>
                      {!claim.claimed && (
                        <Button className="w-full bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30 hover-glow">
                          <Gift className="h-4 w-4 mr-2" />
                          Claim Airdrop
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Creator View: Distribute Tokens */}
          <TabsContent value="distribute" className="mt-6">
            <Card className="glass p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{"Distribute Your Tokens"}</h3>
                <p className="text-sm text-gray-400">{"Set up an airdrop for your token holders"}</p>
              </div>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tokenAddress" className="text-sm font-medium text-gray-300">
                    Token Address
                  </Label>
                  <Input
                    id="tokenAddress"
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="border-[#00ff41]/20 bg-[#0a0a0a] text-white placeholder:text-gray-600 focus:border-[#00ff41]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="text-sm font-medium text-gray-300">
                    Total Amount to Share
                  </Label>
                  <Input
                    id="totalAmount"
                    placeholder="e.g., 100000"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="border-[#00ff41]/20 bg-[#0a0a0a] text-white placeholder:text-gray-600 focus:border-[#00ff41]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirement" className="text-sm font-medium text-gray-300">
                    Claim Requirements
                  </Label>
                  <Input
                    id="requirement"
                    placeholder="e.g., Hold 1M tokens or 30 holders"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="border-[#00ff41]/20 bg-[#0a0a0a] text-white placeholder:text-gray-600 focus:border-[#00ff41]/50"
                  />
                  <p className="text-xs text-gray-500">
                    {"Examples: Hold 1M tokens, 30+ holders, Follow on Farcaster"}
                  </p>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black font-bold py-6 hover-glow">
                  <Send className="h-4 w-4 mr-2" />
                  Create Airdrop
                </Button>
              </form>
            </Card>

            <Card className="glass p-4 mt-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">{"Pro Tip"}</h4>
                  <p className="text-sm text-gray-400">
                    {
                      "Set clear requirements to ensure your airdrop reaches engaged community members. Popular requirements include minimum token holdings or follower counts."
                    }
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
