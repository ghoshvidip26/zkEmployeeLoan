import { ethers } from "ethers";
import { generateDKIMProof } from "./generateDKIMProofClean";

// Smart contract ABI for the repayLoan function
const CONTRACT_ABI = [
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
];

export async function repayLoanWithDKIM(
  emailContent: string,
  loanAmount: number,
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
      loanAmount,
      userAddress,
      showLog
    );

    // Step 2: Prepare contract interaction
    showLog("📋 Preparing smart contract transaction...");
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

    // Convert proof to bytes format expected by contract
    const proofBytes = ethers.hexlify(proof);

    // Convert public inputs to bytes32 array
    const publicInputsBytes32 = publicInputs.map((input) =>
      ethers.zeroPadValue(ethers.toBeHex(BigInt(input)), 32)
    );

    showLog(`📊 Proof size: ${proof.length} bytes`);
    showLog(`📊 Public inputs: ${publicInputs.length} values`);

    // Step 3: Execute smart contract transaction
    showLog("⛓️ Submitting transaction to blockchain...");
    const tx = await contract.repayLoan(proofBytes, publicInputsBytes32);

    showLog(`📄 Transaction submitted: ${tx.hash}`);
    showLog("⏳ Waiting for confirmation...");

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      showLog("✅ Loan repayment successful!");
      showLog(`🎉 Transaction confirmed in block ${receipt.blockNumber}`);
    } else {
      throw new Error("Transaction failed");
    }

    return tx;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Loan repayment failed: ${errorMessage}`);
    console.error("Loan Repayment Error:", error);
    throw error;
  }
}

/**
 * Check loan eligibility without submitting transaction
 */
export async function checkLoanEligibility(
  emailContent: string,
  loanAmount: number,
  userAddress: string,
  showLog: (content: string) => void
): Promise<{
  isEligible: boolean;
  maxLoanAmount: number;
  salaryAmount: number;
  reason?: string;
}> {
  try {
    showLog("🔍 Checking loan eligibility...");

    // Parse email to extract salary information
    const { salaryData, isEligible, maxLoanAmount } = await import(
      "./emailParser"
    ).then((module) =>
      module.prepareCircuitInputs(emailContent, loanAmount, userAddress)
    );

    const salaryAmount = parseInt(salaryData.salaryAmount);

    showLog(`📧 Annual salary: $${salaryAmount}`);
    showLog(`💰 Requested loan: $${loanAmount}`);
    showLog(`📊 Maximum allowed (30%): $${maxLoanAmount}`);
    showLog(`✅ Eligible: ${isEligible ? "Yes" : "No"}`);

    return {
      isEligible,
      maxLoanAmount,
      salaryAmount,
      reason: isEligible
        ? undefined
        : `Loan amount exceeds 30% of salary (max: $${maxLoanAmount})`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Eligibility check failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Estimate gas cost for loan repayment transaction
 */
export async function estimateRepaymentGas(
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
    showLog("⛽ Estimating gas cost...");

    // Generate proof (needed for gas estimation)
    const { proof, publicInputs } = await generateDKIMProof(
      emailContent,
      loanAmount,
      userAddress,
      (msg) => {} // Silent logging for estimation
    );

    const contract = new ethers.Contract(
      contractAddress,
      CONTRACT_ABI,
      provider
    );

    const proofBytes = ethers.hexlify(proof);
    const publicInputsBytes32 = publicInputs.map((input) =>
      ethers.zeroPadValue(ethers.toBeHex(BigInt(input)), 32)
    );

    // Estimate gas
    const gasEstimate = await contract.repayLoan.estimateGas(
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
