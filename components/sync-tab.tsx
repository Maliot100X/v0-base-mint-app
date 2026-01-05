"use client"
import { useConnect, useAccount, useDisconnect } from "wagmi"
import { Link2 } from "lucide-react"

export function SyncTab() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="p-4 space-y-6 bg-black min-h-screen text-white text-center italic uppercase font-bold">
      <Link2 className="w-12 h-12 text-[#00ff41] mx-auto mb-4" />
      <h2 className="text-xl tracking-tighter">Wallet Sync</h2>
      <p className="text-[10px] font-mono text-gray-500">{isConnected ? address : "NOT CONNECTED"}</p>
      <div className="flex flex-col gap-3 pt-4">
        {connectors.map((connector) => (
          <button key={connector.id} onClick={() => connect({ connector })} className="border border-[#1a1a1a] p-4 rounded-xl text-xs hover:border-[#00ff41]">
            CONNECT {connector.name}
          </button>
        ))}
        {isConnected && <button onClick={() => disconnect()} className="text-red-500 text-[10px] pt-4">DISCONNECT</button>}
      </div>
    </div>
  )
}