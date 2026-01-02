"use client"
import { Button } from "@/components/ui/button"
import { Zap, ShoppingCart, CreditCard, Rocket, User, ShieldCheck } from "lucide-react"

export function ProfileTab({ userContext, userAddress, balance }: any) {
  return (
    <div className="p-4 space-y-6 pb-10">
      {/* Header Info */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[#00ff41] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          {userContext?.user?.pfpUrl ? <img src={userContext.user.pfpUrl} className="w-full h-full object-cover" /> : <span className="text-3xl text-gray-600">?</span>}
        </div>
        <h2 className="text-xl font-bold">{userContext?.user?.displayName || "Guest"}</h2>
        <p className="text-[#00ff41] font-mono text-xs">{userAddress || "0x..."}</p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        {["My Coins", "My Holdings", "Boosts", "Subscription"].map((label, i) => {
          const Icons = [Rocket, ShoppingCart, Zap, CreditCard];
          const Colors = ["text-[#00ff41]", "text-blue-400", "text-yellow-400", "text-purple-400"];
          const Icon = Icons[i];
          return (
            <Button key={label} variant="outline" className="bg-[#0a0a0a] border-[#1a1a1a] h-16 flex flex-col gap-1 hover:border-[#00ff41]/50 text-white font-bold">
              <Icon className={`${Colors[i]} w-4 h-4`} />
              <span className="text-[10px] uppercase">{label}</span>
            </Button>
          );
        })}
      </div>

      {/* Boost Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2"><Zap className="w-3 h-3" /> Boost Options</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { time: "30 Minute Boost", price: "$3", desc: "Push your token to the top of the feed" },
            { time: "1 Hour Boost", price: "$5", desc: "Extended visibility for your token" }
          ].map((b) => (
            <div key={b.time} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{b.time}</p>
                <p className="text-[10px] text-gray-500">{b.desc}</p>
              </div>
              <Button size="sm" className="bg-[#00ff41] text-black font-bold h-8 text-[10px] px-3 uppercase">{b.price} USDT</Button>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-center text-gray-600 font-mono uppercase">Payments to: 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec</p>
      </div>

      {/* Subscription Section */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#00ff41]/20 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10"><ShieldCheck className="w-20 h-20 text-[#00ff41]" /></div>
        <h3 className="text-[#00ff41] font-black text-lg uppercase tracking-tighter">Premium Subscription</h3>
        <p className="text-xl font-bold mb-3">$9 <span className="text-xs text-gray-500 uppercase">USDT / Month</span></p>
        <ul className="text-[10px] space-y-2 text-gray-300 uppercase font-bold">
          <li>• Double Quest Points (2x rewards)</li>
          <li>• 1 Free Weekly Boost (30 min)</li>
          <li>• Priority Support</li>
          <li>• Exclusive Badge</li>
        </ul>
        <Button className="w-full mt-4 bg-[#00ff41] text-black font-black uppercase text-xs h-10 shadow-[0_0_15px_rgba(0,255,65,0.3)]">Subscribe Now</Button>
      </div>

      {/* Footer */}
      <div className="text-center py-6 opacity-30">
        <p className="text-xs uppercase tracking-widest font-bold">No tokens launched yet</p>
        <p className="text-[10px] mt-1">Create your first token on the Launch tab</p>
      </div>
    </div>
  )
}