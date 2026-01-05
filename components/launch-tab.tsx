"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { parseEther } from "viem"
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

// YOUR DEV WALLET (Where the 0.0001 ETH fee goes for now)
const DEV_WALLET = "0x1909b332397144aeb4867B7274a05Dbb25bD1Fec"

export function LaunchTab() {
  const { isConnected } = useAccount()
  const { sendTransaction, data: hash, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const [tokenName, setTokenName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. IMAGE UPLOAD LOGIC
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 2. LAUNCH / TRANSACTION LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return
    
    // Simulate Launch by sending the Creation Fee to your wallet
    // In the future, this will be the Contract Deploy call
    try {
      sendTransaction({
        to: DEV_WALLET,
        value: parseEther("0.0001"), // The Fee
      })
    } catch (error) {
      console.error("Transaction failed:", error)
    }
  }

  // 3. UI STATE HELPERS
  const isButtonDisabled = !isConnected || !tokenName || !symbol || isPending || isConfirming
  
  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet to Launch"
    if (isPending) return "Check Your Wallet..."
    if (isConfirming) return "Confirming Transaction..."
    if (isConfirmed) return "Token Launched Successfully!"
    return "Launch on Base via Clanker"
  }

  // 4. SUCCESS SCREEN
  if (isConfirmed) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="mx-auto h-24 w-24 bg-[#00ff41]/20 rounded-full flex items-center justify-center border-2 border-[#00ff41]">
             <CheckCircle2 className="h-12 w-12 text-[#00ff41]" />
          </div>
          <h2 className="text-3xl font-bold text-white">Token Created!</h2>
          <p className="text-gray-400">
            {tokenName} (${symbol}) is now being deployed to Base.
          </p>
          <div className="p-4 bg-[#111] rounded-lg border border-[#222] text-xs font-mono break-all">
             TX: {hash}
          </div>
          <Button 
             onClick={() => window.location.reload()} 
             className="bg-[#00ff41] text-black font-bold w-full"
          >
             Launch Another
          </Button>
        </motion.div>
      </div>
    )
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

            {/* Image Upload (FIXED) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Token Image</Label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex items-center justify-center rounded-lg border-2 border-dashed border-[#00ff41]/20 bg-[#0a0a0a] p-8 transition-all cursor-pointer hover:border-[#00ff41]/50 hover:bg-[#00ff41]/5 ${imagePreview ? 'border-solid border-[#00ff41]' : ''}`}
              >
                {imagePreview ? (
                  <div className="relative h-32 w-32">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-xs text-white">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                    <p className="mb-1 text-sm font-medium text-gray-300">Click to upload</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
                  </div>
                )}
                
                {/* Hidden Real Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* LAUNCH BUTTON */}
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full font-bold text-base py-6 transition-all ${
                isHovered && !isButtonDisabled ? "neon-glow scale-105" : ""
              } ${
                isButtonDisabled 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isPending || isConfirming ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              {getButtonText()}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
               {isConnected ? (
                 <>
                   <span className="h-2 w-2 rounded-full bg-[#00ff41]"></span>
                   <span>Fee: 0.0001 ETH (Goes to Dev)</span>
                 </>
               ) : (
                 <>
                   <AlertCircle size={12} className="text-yellow-500" />
                   <span className="text-yellow-500">Connect wallet to start</span>
                 </>
               )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}