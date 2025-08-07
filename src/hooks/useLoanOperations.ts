import { useState, useCallback } from "react";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import {
  takeLoanWithDKIM,
  repayLoanWithDKIM,
  getLoanDetails,
  estimateLoanGas,
} from "../utils/zkLoanContract";
import { validateLoanEligibility } from "../utils/emailParser";

export interface LoanOperation {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  transactionHash: string | null;
  logs: string[];
}

export function useLoanOperations() {
  const { wallets } = useWallets();
  const [operation, setOperation] = useState<LoanOperation>({
    isLoading: false,
    isSuccess: false,
    error: null,
    transactionHash: null,
    logs: [],
  });

  const addLog = useCallback((message: string) => {
    setOperation((prev) => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`],
    }));
  }, []);

  const resetOperation = useCallback(() => {
    setOperation({
      isLoading: false,
      isSuccess: false,
      error: null,
      transactionHash: null,
      logs: [],
    });
  }, []);

  const takeLoan = useCallback(
    async (emailContent: string, loanAmount: number) => {
      try {
        resetOperation();
        setOperation((prev) => ({ ...prev, isLoading: true }));

        if (!wallets.length) {
          throw new Error("No wallet connected");
        }

        const wallet = wallets[0];
        await wallet.switchChain(84532); // Base Sepolia

        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const userAddress = await signer.getAddress();

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (!contractAddress) {
          throw new Error("Contract address not configured");
        }

        addLog("🚀 Starting loan application...");
        addLog(`💰 Loan amount: $${loanAmount}`);
        addLog(`👤 User address: ${userAddress}`);

        // Step 1: Parse email and check eligibility
        addLog("🔍 Validating loan eligibility from email...");
        const emailParser = await import("../utils/emailParser");
        const { salaryData } = emailParser.parseEmailContent(emailContent);
        const eligibility = emailParser.validateLoanEligibility(
          salaryData.salaryAmount,
          loanAmount
        );

        if (!eligibility.isEligible) {
          throw new Error(
            `Loan exceeds 30% of salary. Max: $${eligibility.maxLoanAmount}`
          );
        }

        addLog(`📧 Verified salary: $${salaryData.salaryAmount}`);
        addLog(
          `✅ Loan approved: $${loanAmount} (${eligibility.ratio.toFixed(
            1
          )}% of salary)`
        );

        // Step 2: Estimate gas
        addLog("⛽ Estimating transaction cost...");
        const gasEstimate = await estimateLoanGas(
          emailContent,
          loanAmount,
          userAddress,
          contractAddress,
          ethersProvider,
          addLog
        );

        // Step 3: Execute takeLoan transaction
        addLog("📧 Processing DKIM verification and taking loan...");
        const tx = await takeLoanWithDKIM(
          emailContent,
          loanAmount,
          userAddress,
          contractAddress,
          signer,
          addLog
        );

        setOperation((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          transactionHash: tx.hash,
        }));

        addLog(`🎉 Loan taken successfully! TX: ${tx.hash}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        addLog(`❌ Error: ${errorMessage}`);

        setOperation((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [wallets, addLog, resetOperation]
  );

  const processLoanRepayment = useCallback(
    async (emailContent: string, loanAmount: number) => {
      try {
        resetOperation();
        setOperation((prev) => ({ ...prev, isLoading: true }));

        if (!wallets.length) {
          throw new Error("No wallet connected");
        }

        const wallet = wallets[0];
        await wallet.switchChain(84532); // Base Sepolia

        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const userAddress = await signer.getAddress();

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (!contractAddress) {
          throw new Error("Contract address not configured");
        }

        addLog("🚀 Starting loan repayment process...");
        addLog(`💰 Loan amount: $${loanAmount}`);
        addLog(`👤 User address: ${userAddress}`);

        // Step 1: Check eligibility
        addLog("🔍 Checking loan eligibility...");
        const eligibility = await checkLoanEligibility(
          emailContent,
          loanAmount,
          userAddress,
          addLog
        );

        if (!eligibility.isEligible) {
          throw new Error(eligibility.reason || "Loan not eligible");
        }

        // Step 2: Estimate gas
        addLog("⛽ Estimating transaction cost...");
        const gasEstimate = await estimateRepaymentGas(
          emailContent,
          loanAmount,
          userAddress,
          contractAddress,
          ethersProvider,
          addLog
        );

        // Step 3: Execute transaction
        addLog("📧 Processing DKIM verification and submitting transaction...");
        const tx = await repayLoanWithDKIM(
          emailContent,
          loanAmount,
          userAddress,
          contractAddress,
          signer,
          addLog
        );

        setOperation((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          transactionHash: tx.hash,
        }));

        addLog(`🎉 Loan repayment successful! TX: ${tx.hash}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        addLog(`❌ Error: ${errorMessage}`);

        setOperation((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [wallets, addLog, resetOperation]
  );

  const checkEligibilityOnly = useCallback(
    async (emailContent: string, loanAmount: number) => {
      try {
        resetOperation();
        setOperation((prev) => ({ ...prev, isLoading: true }));

        if (!wallets.length) {
          throw new Error("No wallet connected");
        }

        const wallet = wallets[0];
        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const userAddress = await signer.getAddress();

        addLog("🔍 Checking loan eligibility...");

        const eligibility = await checkLoanEligibility(
          emailContent,
          loanAmount,
          userAddress,
          addLog
        );

        setOperation((prev) => ({
          ...prev,
          isLoading: false,
          isSuccess: eligibility.isEligible,
        }));

        return eligibility;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        addLog(`❌ Error: ${errorMessage}`);

        setOperation((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [wallets, addLog, resetOperation]
  );

  return {
    operation,
    processLoanRepayment,
    checkEligibilityOnly,
    resetOperation,
    addLog,
  };
}
