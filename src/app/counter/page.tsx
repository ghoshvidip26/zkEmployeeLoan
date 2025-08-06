"use client";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";
import { useReadContract, useWriteContract } from "wagmi";
import { abi } from "./abi";
import { ethers } from "ethers";
import lighthouse, { upload } from "@lighthouse-web3/sdk";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { ArrowUp, Send, User, Wallet, Activity } from "lucide-react";

export default function ContractInteractionComponent() {
  const [disabled, setDisabled] = useState(false);
  const { wallets } = useWallets();
  const { login } = useLogin();
  const { ready, authenticated, user } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  console.log("User:", user);
  console.log("Authenticated:", authenticated);
  console.log("Ready:", ready);
  wallets.forEach((wallet) =>
    console.log("Wallet Type:", wallet.walletClientType, wallet)
  );

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const { data, isLoading, error } = useReadContract({
    abi,
    address: (CONTRACT_ADDRESS as `0x${string}`) || "0x",
    functionName: "getCount",
  });

  const { writeContract } = useWriteContract();

  // ✅ Call this only when the user clicks the button
  const handleIncrement = async () => {
    try {
      writeContract({
        abi,
        address: (CONTRACT_ADDRESS as `0x${string}`) || "0x",
        functionName: "increase",
        args: [],
      });
      setDisabled(true);
      console.log("✅ Incremented count successfully");
    } catch (error) {
      console.log("❌ Error incrementing count:", error);
    }
  };

  const sendTransactionToContract = async () => {
    sendTransaction(
      {
        to: "0x7BF6e2273651a9d13EA021548612D846F1B390D0",
        value: 100000,
      },
      {
        address: wallets[0].address, // Optional: Specify the wallet to use for signing. If not provided, the first wallet will be used.
      }
    );
    console.log("Transaction sent to contract");
  };

  const signAuthMessages = async () => {
    try {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );

      if (!embeddedWallet) {
        console.error("❌ Embedded wallet not found");
        return null;
      }

      // ✅ Switch to Filecoin Hyperspace (Chain ID 314159)
      await embeddedWallet.switchChain(845320009);

      // ✅ Get Ethers-compatible provider
      const provider = new ethers.BrowserProvider(
        await embeddedWallet.getEthereumProvider()
      );

      // ✅ Get signer
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      // ✅ Get auth message from Lighthouse
      const { message } = (await lighthouse.getAuthMessage(signerAddress)).data;
      console.log("📝 Auth message:", message);

      // ✅ Sign the message
      const signature = message ? await signer.signMessage(message) : null;

      return {
        publicKey: signerAddress,
        signMessage: signature,
      };
    } catch (error) {
      console.error("❌ Error signing message with Wallet", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,193,7,0.08),transparent_50%)]" />

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-70"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Smart Contract{" "}
            <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text">
              Interaction
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Interact with zkEmployeeLoan smart contracts using zero-knowledge
            proof verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contract State Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-yellow-500/5 backdrop-blur-sm rounded-3xl border border-green-500/30 p-8 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                Contract State
              </h2>
            </div>

            <div className="space-y-4">
              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="w-6 h-6 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                  <p className="text-yellow-300">Loading count...</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-red-300">
                    Error reading count: {error.message}
                  </p>
                </div>
              )}

              {data !== undefined && (
                <div className="p-6 bg-gradient-to-r from-green-500/20 to-yellow-500/10 rounded-xl border border-green-500/30">
                  <p className="text-2xl font-bold text-green-400">
                    Count: {(data as bigint).toString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Information Card */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-green-500/5 backdrop-blur-sm rounded-3xl border border-yellow-500/30 p-8 animate-slideUp delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">
                User Information
              </h2>
            </div>

            {authenticated && user ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <p className="text-sm text-gray-400 mb-1">User ID</p>
                  <p className="text-green-300 font-mono">{user.id}</p>
                </div>
                {user.email?.address && (
                  <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-yellow-300">{user.email.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-gray-500/10 rounded-xl border border-gray-500/20 text-center">
                <p className="text-gray-400 mb-4">
                  Please authenticate to view user information
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Wallets Section */}
        {wallets.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-green-500/5 to-yellow-500/5 backdrop-blur-sm rounded-3xl border border-green-500/20 p-8 animate-slideUp delay-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                Connected Wallets
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map((w, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-green-500/10 to-yellow-500/5 rounded-xl border border-green-500/20"
                >
                  <p className="text-sm text-gray-400 mb-1">Wallet Type</p>
                  <p className="text-green-300 mb-3 capitalize">
                    {w.walletClientType}
                  </p>
                  <p className="text-sm text-gray-400 mb-1">Address</p>
                  <p className="text-yellow-300 font-mono text-sm break-all">
                    {w.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center animate-slideUp delay-500">
          {!authenticated ? (
            <div className="text-center">
              <button
                onClick={login}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold rounded-2xl hover:from-green-400 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Connect Wallet
              </button>
              <p className="text-gray-400 mt-3 text-sm">
                Authentication required for contract interactions
              </p>
            </div>
          ) : (
            <>
              <button
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500/20 to-green-600/30 border border-green-500/50 text-green-300 font-bold rounded-2xl hover:bg-gradient-to-r hover:from-green-500/30 hover:to-green-600/40 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleIncrement}
                disabled={!authenticated || disabled}
              >
                <ArrowUp className="w-5 h-5" />
                Increment Count
              </button>

              <button
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/30 border border-yellow-500/50 text-yellow-300 font-bold rounded-2xl hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-yellow-600/40 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={sendTransactionToContract}
                disabled={!authenticated}
              >
                <Send className="w-5 h-5" />
                Send Transaction
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
