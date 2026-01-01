"use client"

import { Plus, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfileTabProps {
  isConnected: boolean
}

export function ProfileTab({ isConnected }: ProfileTabProps) {
  if (!isConnected) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="glass p-6 text-center max-w-sm">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="mb-2 text-lg font-bold">{"Connect to View Profile"}</h3>
          <p className="mb-4 text-xs text-gray-400">
            {"Sign in with Farcaster and connect your wallet to view your profile"}
          </p>
          <Button className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black font-semibold hover-glow text-sm h-10">
            Get Started
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="glass p-6 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-[#00ff41] to-[#00cc33] flex items-center justify-center text-2xl font-bold text-black">
            ?
          </div>
          <h3 className="text-lg font-bold mb-2">{"Profile Loading..."}</h3>
          <p className="text-xs text-gray-400 mb-4">{"Your Farcaster profile will appear here"}</p>
        </Card>

        {/* My Launched Tokens */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold">{"My Launched Tokens"}</h3>
            <Button
              size="sm"
              className="bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/20 border border-[#00ff41]/30 h-8 text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
              New Token
            </Button>
          </div>

          <Card className="glass p-6 text-center">
            <p className="text-sm text-gray-400">{"No tokens launched yet"}</p>
            <p className="text-xs text-gray-600 mt-1">{"Create your first token on the Launch tab"}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
