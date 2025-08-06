"use client";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";
import { useReadContract, useWriteContract } from "wagmi";
import { abi } from "./abi";
import { ethers } from "ethers";
import lighthouse, { upload } from "@lighthouse-web3/sdk";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

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
    address: CONTRACT_ADDRESS || "",
    functionName: "getCount",
  });

  const { writeContract } = useWriteContract();

  // ✅ Call this only when the user clicks the button
  const handleIncrement = async () => {
    try {
      writeContract({
        abi,
        address: CONTRACT_ADDRESS || "",
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
      const signature = await signer.signMessage(message);

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
    <div>
      <h2>Read Contract State</h2>
      {isLoading && <p>Loading count...</p>}
      {error && <p>Error reading count: {error.message}</p>}
      {data !== undefined && <p>Count: {(data as bigint).toString()}</p>}
      {/* Need info extracted */}
      {authenticated && user && (
        <div>
          <p>User ID: {user.id}</p>
          <p>User email: {user.email?.address}</p>
        </div>
      )}

      {wallets.map((w) => {
        return (
          <div key={w.id}>
            <p>Wallet Type: {w.walletClientType}</p>
            <p>Address: {w.address}</p>
          </div>
        );
      })}

      {/* <button
        onClick={signAuthMessages}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4 ml-4"
      >
        Sign Auth Message
      </button> */}
      {!authenticated && (
        <>
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 ml-4"
          >
            Login
          </button>
          <p className="text-sm text-gray-500 ml-4 mt-1">
            You&apos;ve not authenticated. Increment disabled.
          </p>
        </>
      )}

      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4 ml-4"
        onClick={handleIncrement}
        disabled={!authenticated || disabled}
      >
        Increment
      </button>
      <button
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mt-4 ml-4"
        onClick={sendTransactionToContract}
        disabled={!authenticated}
      >
        Send Transaction to Contract
      </button>
    </div>
  );
}
