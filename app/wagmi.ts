import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    // Priority 1: Base Smart Wallet / Coinbase Wallet
    // 'all' = Detects extension if installed, otherwise offers Smart Wallet (Passkey)
    coinbaseWallet({ appName: 'BaseMint', preference: 'all' }),
    
    // Priority 2: MetaMask / Browser Fallback
    injected(),
  ],
  ssr: true,
  transports: { 
    [base.id]: http() 
  },
})