"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { http } from "viem";
import { baseSepolia } from "viem/chains";
// import { createConfig, WagmiProvider } from "wagmi";
import { defineChain } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig } from "@privy-io/wagmi";
import { WagmiProvider } from "@privy-io/wagmi";

export const myCustomChain = defineChain({
  id: 845320009,
  name: "Horizen Testnet - Base Sepolia",
  network: "Horizen - Base Sepolia",
  nativeCurrency: {
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: "ETH",
    symbol: "ETH",
  },

  rpcUrls: {
    default: {
      http: ["https://horizen-rpc-testnet.appchain.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://horizen-explorer-testnet.appchain.base.org/",
    },
  },
});

export const wagmi = createConfig({
  chains: [myCustomChain],
  transports: {
    [myCustomChain.id]: http(),
  },
});

const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        supportedChains: [myCustomChain],
        defaultChain: myCustomChain,
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmi}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
