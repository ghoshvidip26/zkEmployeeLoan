"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { http } from "viem";
import { baseSepolia } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        supportedChains: [baseSepolia],
        defaultChain: baseSepolia,
        externalWallets: {},
      }}
    >
      {children}
    </PrivyProvider>
  );
}
