"use client"

import { Button } from "@/components/ui/button"
import { Zap, ShoppingCart, CreditCard, Rocket, User, ShieldCheck, Wallet } from "lucide-react"
import { useConnect, useDisconnect } from "wagmi"

export function ProfileTab({ userContext, userAddress, balance, onSwitch }: any) {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Profile Header */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 text-center shadow-xl">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[#00ff41] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          {userContext?.user?.pfpUrl ? (
            <img src={userContext.user.pfpUrl} className="w-full h-full object-cover" />
          ) : (
            <User className="text-gray-600 w-10 h-10" />
          )}
        </div>

        <h2 className="text-xl font-bold">
          {userContext?.user?.displayName || "Guest"}
        </h2>

        <p className="text-[#00ff41] font-mono text-xs">
          {userAddress ? `${userAddress.slice(0, 12)}...` : "Wallet Not Linked"}
        </p>

        <Button
          onClick={onSwitch}
          variant="outline"
          size="sm"
          className="mt-4 border-[#00ff41]/30 text-[#00ff41] text-[10px] h-7 px-3"
        >
          <Wallet className="mr-1 w-3 h-3" /> SWITCH WALLET
        </Button>

        {/* SYNC (ALL) — backup / recovery */}
        <div className="mt-3 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#00ff41]/30 text-[#00ff41] text-[10px] h-7"
            onClick={() => {
              try {
                disconnect()
              } catch (e) {
                console.error("Sync disconnect failed", e)
              }
            }}
          >
            SYNC (ALL)
          </Button>

          <div className="space-y-1">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                size="sm"
                className="w-full text-[10px] h-7"
                onClick={() => connect({ connector })}
              >
                CONNECT {connector.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "My Coins", icon: Rocket, color: "text-[#00ff41]" },
          { label: "My Holdings", icon: ShoppingCart, color: "text-blue-400" },
          { label: "Boosts", icon: Zap, color: "text-yellow-400" },
          { label: "Subscription", icon: CreditCard, color: "text-purple-400" }
        ].map((item) => (
          <Button
            key={item.label}
            variant="outline"
            className="bg-[#0a0a0a] border-[#1a1a1a] h-16 flex flex-col gap-1 hover:border-[#00ff41]/50 text-white font-bold"
          >
            <item.icon className={`${item.color} w-4 h-4`} />
            <span className="text-[10px] uppercase tracking-tighter">
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Boost Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 tracking-widest">
          <Zap className="w-3 h-3 text-yellow-400" /> Boost Options
        </h3>

        <div className="space-y-2">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-sm">30 Minute Boost</p>
              <p className="text-[10px] text-gray-500">Push your token to the top</p>
            </div>
            <Button className="bg-[#00ff41] text-black font-black h-8 text-[10px] px-4 uppercase">
              $3 USDT
            </Button>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-sm">1 Hour Boost</p>
              <p className="text-[10px] text-gray-500">Extended visibility</p>
            </div>
            <Button className="bg-[#00ff41] text-black font-black h-8 text-[10px] px-4 uppercase">
              $5 USDT
            </Button>
          </div>
        </div>

        <p className="text-[9px] text-center text-gray-600 font-mono uppercase tracking-tighter">
          Payments to: 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec
        </p>
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-[#00ff41]/20 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5">
          <ShieldCheck className="w-24 h-24 text-[#00ff41]" />
        </div>

        <h3 className="text-[#00ff41] font-black text-lg uppercase tracking-tighter">
          Premium Subscription
        </h3>

        <p className="text-xl font-bold mb-3">
          $9{" "}
          <span className="text-[10px] text-gray-500 uppercase font-normal font-sans">
            USDT / Month
          </span>
        </p>

        <ul className="text-[10px] space-y-2 text-gray-300 uppercase font-black tracking-tight">
          <li>• Double Quest Points (2x rewards)</li>
          <li>• 1 Free Weekly Boost (30 min)</li>
          <li>• Priority Support</li>
          <li>• Exclusive Badge</li>
        </ul>

        <Button className="w-full mt-4 bg-[#00ff41] text-black font-black uppercase text-xs h-12 shadow-[0_0_20px_rgba(0,255,65,0.4)]">
          Subscribe Now
        </Button>
      </div>
    </div>
  )
}
