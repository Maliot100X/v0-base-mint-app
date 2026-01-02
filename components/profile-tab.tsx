"use client"
import { Button } from "@/components/ui/button"
import { Zap, ShoppingCart, CreditCard, Rocket, User } from "lucide-react"

export function ProfileTab({ userContext, userAddress, balance }: any) {
  return (
    <div className="p-4 space-y-4">
      {/* Profile Info Header */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[#00ff41] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
          {userContext?.user?.pfpUrl ? (
            <img src={userContext.user.pfpUrl} alt="PFP" className="w-full h-full object-cover" />
          ) : (
            <User className="text-gray-600 w-10 h-10" />
          )}
        </div>
        <h2 className="text-xl font-bold">{userContext?.user?.displayName || "Guest"}</h2>
        <p className="text-[#00ff41] font-mono text-xs">{userAddress ? `${userAddress.slice(0, 10)}...` : "0x..."}</p>
      </div>

      {/* Grid of Buttons - RESTORED EXACTLY */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="bg-[#0a0a0a] border-[#1a1a1a] h-16 flex flex-col gap-1 hover:border-[#00ff41]/50 text-white font-bold">
          <Rocket className="text-[#00ff41] w-4 h-4" />
          <span className="text-[10px] uppercase">My Coins</span>
        </Button>
        <Button variant="outline" className="bg-[#0a0a0a] border-[#1a1a1a] h-16 flex flex-col gap-1 hover:border-[#00ff41]/50 text-white font-bold">
          <ShoppingCart className="text-blue-400 w-4 h-4" />
          <span className="text-[10px] uppercase">My Holdings</span>
        </Button>
        <Button variant="outline" className="bg-[#0a0a0a] border-[#1a1a1a] h-16 flex flex-col gap-1 hover:border-[#00ff41]/50 text-white font-bold">
          <Zap className="text-yellow-400 w-4 h-4" />
          <span className="text-[10px] uppercase">Boosts</span>
        </Button>
        <Button variant="outline" className="bg-[#0a0a0a] border-[#1a1a1a] h-16 flex flex-col gap-1 hover:border-[#00ff41]/50 text-white font-bold">
          <CreditCard className="text-purple-400 w-4 h-4" />
          <span className="text-[10px] uppercase">Subscription</span>
        </Button>
      </div>

      {/* Empty State Footer */}
      <div className="text-center py-10 opacity-30">
        <p className="text-xs uppercase tracking-widest font-bold">No tokens launched yet</p>
        <p className="text-[10px] mt-1">Create your first token on the Launch tab</p>
      </div>
    </div>
  )
}