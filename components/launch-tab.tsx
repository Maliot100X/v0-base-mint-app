"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function LaunchTab() {
  const [tokenName, setTokenName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [description, setDescription] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating token:", { tokenName, symbol, description })
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-bold">Launch Your Token</h2>
          <p className="text-sm text-gray-400">Create the next big thing on Base</p>
        </div>

        <Card className="glass border-[#00ff41]/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token Name */}
            <div className="space-y-2">
              <Label htmlFor="tokenName" className="text-sm font-medium text-gray-300">
                Token Name
              </Label>
              <Input
                id="tokenName"
                placeholder="e.g., Moon Shot"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="border-[#00ff41]/20 bg-[#0a0a0a] text-white placeholder:text-gray-600 focus:border-[#00ff41]/50 focus:ring-[#00ff41]/20"
              />
            </div>

            {/* Symbol */}
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-sm font-medium text-gray-300">
                Symbol
              </Label>
              <Input
                id="symbol"
                placeholder="e.g., MOON"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="border-[#00ff41]/20 bg-[#0a0a0a] text-white placeholder:text-gray-600 focus:border-[#00ff41]/50 focus:ring-[#00ff41]/20"
                maxLength={10}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell the world about your token..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] border-[#00ff41]/20 bg-[#0a0a0a] text-white placeholder:text-gray-600 focus:border-[#00ff41]/50 focus:ring-[#00ff41]/20"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Token Image</Label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[#00ff41]/20 bg-[#0a0a0a] p-8 transition-colors hover:border-[#00ff41]/50 hover-glow cursor-pointer">
                <div className="text-center">
                  <Upload className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                  <p className="mb-1 text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black font-bold text-base py-6 transition-all ${
                isHovered ? "neon-glow scale-105" : ""
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Launch on Base via Clanker
            </Button>

            <p className="text-center text-xs text-gray-500">
              Creation fee: 0.0001 ETH • Your token will be tradeable instantly
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
