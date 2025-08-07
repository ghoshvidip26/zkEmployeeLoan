import { ethers } from "ethers";
import { generateDKIMProof } from "./generateDKIMProofClean";

// Smart contract ABI for zkEmployeeLoan contract
const ZKEMPLOYEE_LOAN_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "loanAmount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "takeLoan",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "repayLoan",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getLoanDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "interestRate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export async function takeLoanWithDKIM(
  emailContent: string,
  loanAmount: number,
  userAddress: string,
  contractAddress: string,
  signer: ethers.Signer,
  showLog: (content: string) => void
): Promise<ethers.TransactionResponse> {
  try {
    showLog("🚀 Starting loan application with DKIM verification...");

    // Step 1: Generate ZK proof from email
    showLog("📧 Generating DKIM proof from salary email...");
    const { proof, publicInputs } = await generateDKIMProof(
      emailContent,
      loanAmount,
      userAddress,
      showLog
    );

    // Step 2: Prepare smart contract interaction
    showLog("📋 Preparing zkEmployeeLoan contract transaction...");
    const contract = new ethers.Contract(
      contractAddress,
      ZKEMPLOYEE_LOAN_ABI,
      signer
    );

    // Convert proof to bytes format
    const proofBytes = ethers.hexlify(proof);

    // Convert public inputs to bytes32 array
    const publicInputsBytes32 = publicInputs.map((input) =>
      ethers.zeroPadValue(ethers.toBeHex(BigInt(input)), 32)
    );

    // Convert loan amount to wei (assuming USDC with 6 decimals)
    const loanAmountWei = ethers.parseUnits(loanAmount.toString(), 6);

    showLog(`💰 Loan amount: $${loanAmount}`);
    showLog(`📊 Proof size: ${proof.length} bytes`);
    showLog(`📊 Public inputs: ${publicInputs.length} values`);

    // Step 3: Execute takeLoan transaction
    showLog("⛓️ Submitting takeLoan transaction...");
    const tx = await contract.takeLoan(
      loanAmountWei,
      proofBytes,
      publicInputsBytes32
    );

    showLog(`📄 Transaction submitted: ${tx.hash}`);
    showLog("⏳ Waiting for confirmation...");

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      showLog("✅ Loan taken successfully!");
      showLog(`🎉 Transaction confirmed in block ${receipt.blockNumber}`);
      showLog(`💸 $${loanAmount} USDC will be transferred to your wallet`);
    } else {
      throw new Error("Transaction failed");
    }

    return tx;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Loan application failed: ${errorMessage}`);
    console.error("Take Loan Error:", error);
    throw error;
  }
}

export async function repayLoanWithDKIM(
  emailContent: string,
  repaymentAmount: number,
  userAddress: string,
  contractAddress: string,
  signer: ethers.Signer,
  showLog: (content: string) => void
): Promise<ethers.TransactionResponse> {
  try {
    showLog("🚀 Starting loan repayment with DKIM verification...");

    // Step 1: Generate ZK proof
    showLog("📧 Generating DKIM proof...");
    const { proof, publicInputs } = await generateDKIMProof(
      emailContent,
      repaymentAmount,
      userAddress,
      showLog
    );

    // Step 2: Prepare contract interaction
    showLog("📋 Preparing repayment transaction...");
    const contract = new ethers.Contract(
      contractAddress,
      ZKEMPLOYEE_LOAN_ABI,
      signer
    );

    const proofBytes = ethers.hexlify(proof);
    const publicInputsBytes32 = publicInputs.map((input) =>
      ethers.zeroPadValue(ethers.toBeHex(BigInt(input)), 32)
    );

    showLog(`💰 Repayment amount: $${repaymentAmount}`);

    // Step 3: Execute repayLoan transaction
    showLog("⛓️ Submitting repayment transaction...");
    const tx = await contract.repayLoan(proofBytes, publicInputsBytes32);

    showLog(`📄 Transaction submitted: ${tx.hash}`);
    showLog("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      showLog("✅ Loan repayment successful!");
      showLog(`🎉 Transaction confirmed in block ${receipt.blockNumber}`);
    } else {
      throw new Error("Repayment transaction failed");
    }

    return tx;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Loan repayment failed: ${errorMessage}`);
    console.error("Repay Loan Error:", error);
    throw error;
  }
}

export async function getLoanDetails(
  userAddress: string,
  contractAddress: string,
  provider: ethers.Provider
): Promise<{
  amount: bigint;
  interestRate: bigint;
  active: boolean;
}> {
  try {
    const contract = new ethers.Contract(
      contractAddress,
      ZKEMPLOYEE_LOAN_ABI,
      provider
    );
    const [amount, interestRate, active] = await contract.getLoanDetails(
      userAddress
    );

    return {
      amount,
      interestRate,
      active,
    };
  } catch (error) {
    console.error("Error getting loan details:", error);
    throw error;
  }
}

export async function estimateLoanGas(
  emailContent: string,
  loanAmount: number,
  userAddress: string,
  contractAddress: string,
  provider: ethers.Provider,
  showLog: (content: string) => void
): Promise<{
  gasEstimate: bigint;
  gasPrice: bigint;
  estimatedCost: bigint;
}> {
  try {
    showLog("⛽ Estimating gas for loan transaction...");

    // Generate proof (needed for gas estimation)
    const { proof, publicInputs } = await generateDKIMProof(
      emailContent,
      loanAmount,
      userAddress,
      (msg) => {} // Silent logging for estimation
    );

    const contract = new ethers.Contract(
      contractAddress,
      ZKEMPLOYEE_LOAN_ABI,
      provider
    );

    const proofBytes = ethers.hexlify(proof);
    const publicInputsBytes32 = publicInputs.map((input) =>
      ethers.zeroPadValue(ethers.toBeHex(BigInt(input)), 32)
    );
    const loanAmountWei = ethers.parseUnits(loanAmount.toString(), 6);

    // Estimate gas
    const gasEstimate = await contract.takeLoan.estimateGas(
      loanAmountWei,
      proofBytes,
      publicInputsBytes32
    );
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(0);

    const estimatedCost = gasEstimate * gasPrice;

    showLog(`⛽ Gas estimate: ${gasEstimate.toString()}`);
    showLog(`💰 Gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
    showLog(`💸 Estimated cost: ${ethers.formatEther(estimatedCost)} ETH`);

    return {
      gasEstimate,
      gasPrice,
      estimatedCost,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Gas estimation failed: ${errorMessage}`);
    throw error;
  }
}
