"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"; 
import { injected, coinbaseWallet } from "wagmi/connectors";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    // 1. BASE WALLET (Essential for the Base Mini App popup)
    coinbaseWallet({ 
      appName: "Base Mint",
      preference: "smartWalletOnly" 
    }),
    // 2. METAMASK / WEB (Works on Chrome/Brave)
    injected(),
    // 3. FARCASTER (Syncs your Farcaster profile)
    farcasterMiniApp(),
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}