import { ethers } from "ethers";
import { parseEmailContent, generateNullifier } from "./emailParser";
import { generateDKIMProof } from "./generateDKIMProofClean";
import abi from "../app/employee/abi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export interface LoanCreationParams {
  emailContent: string;
  borrowAmount: number;
  userAddress: string;
  signer: ethers.Signer;
  showLog: (message: string) => void;
}

export interface LoanCreationResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  loanDetails?: {
    borrowAmount: number;
    salaryThreshold: number;
    organizationHash: string;
    emailBodyHash: string;
  };
}

/**
 * Create a loan using DKIM-verified salary email
 */
export async function createLoanWithDKIM({
  emailContent,
  borrowAmount,
  userAddress,
  signer,
  showLog,
}: LoanCreationParams): Promise<LoanCreationResult> {
  try {
    showLog("🚀 Starting loan creation with DKIM verification...");

    // Step 1: Parse email content
    showLog("📧 Parsing DKIM-signed email...");
    const { salaryData, dkimData } = parseEmailContent(emailContent);

    const salary = parseInt(salaryData.salaryAmount);
    const maxLoanAmount = Math.floor(salary * 0.3); // 30% of salary

    showLog(`💰 Annual salary: $${salary.toLocaleString()}`);
    showLog(`📊 Max loan amount (30%): $${maxLoanAmount.toLocaleString()}`);
    showLog(`💸 Requested amount: $${borrowAmount.toLocaleString()}`);

    // Step 2: Validate loan eligibility
    if (borrowAmount > maxLoanAmount) {
      throw new Error(
        `Loan amount $${borrowAmount.toLocaleString()} exceeds 30% of salary. Max: $${maxLoanAmount.toLocaleString()}`
      );
    }

    showLog("✅ Loan amount is within 30% salary limit");

    // Step 3: Generate ZK proof
    showLog("🔐 Generating ZK proof from email...");
    const { proof, publicInputs } = await generateDKIMProof(
      emailContent,
      borrowAmount,
      userAddress,
      showLog
    );

    // Step 4: Prepare contract parameters
    showLog("📋 Preparing smart contract parameters...");

    const organizationHash = ethers.keccak256(
      ethers.toUtf8Bytes(salaryData.company)
    );
    const emailBodyHash = ethers.keccak256(ethers.toUtf8Bytes(dkimData.body));

    showLog(`🏢 Company: ${salaryData.company}`);
    showLog(`🔗 Organization hash: ${organizationHash}`);
    showLog(`📄 Email body hash: ${emailBodyHash}`);

    // Step 5: Create contract instance and call createLoan
    showLog("⛓️ Calling smart contract createLoan function...");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

    const tx = await contract.createLoan(
      ethers.hexlify(proof), // proof
      organizationHash, // organizationHash
      salary, // salaryThreshold (full salary)
      emailBodyHash, // emailBodyHash
      ethers.parseUnits(borrowAmount.toString(), 6) // borrowAmount in USDC (6 decimals)
    );

    showLog(`📄 Transaction submitted: ${tx.hash}`);
    showLog("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      showLog("🎉 Loan created successfully!");
      showLog(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
      showLog(`💰 Borrowed: $${borrowAmount.toLocaleString()} USDC`);

      return {
        success: true,
        transactionHash: tx.hash,
        loanDetails: {
          borrowAmount,
          salaryThreshold: salary,
          organizationHash,
          emailBodyHash,
        },
      };
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Loan creation failed: ${errorMessage}`);
    console.error("Loan Creation Error:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Repay an existing loan
 */
export async function repayLoan(
  repayAmount: number,
  signer: ethers.Signer,
  showLog: (message: string) => void
): Promise<LoanCreationResult> {
  try {
    showLog("💸 Starting loan repayment...");
    showLog(`💰 Repay amount: $${repayAmount.toLocaleString()}`);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

    // Convert to USDC format (6 decimals)
    const repayAmountWei = ethers.parseUnits(repayAmount.toString(), 6);

    showLog("⛓️ Calling smart contract repayLoan function...");
    const tx = await contract.repayLoan(repayAmountWei);

    showLog(`📄 Transaction submitted: ${tx.hash}`);
    showLog("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      showLog("🎉 Loan repayment successful!");
      showLog(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      return {
        success: true,
        transactionHash: tx.hash,
      };
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    showLog(`❌ Loan repayment failed: ${errorMessage}`);
    console.error("Loan Repayment Error:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get loan details for a borrower
 */
export async function getLoanDetails(
  borrowerAddress: string,
  provider: ethers.Provider
): Promise<{
  borrowedAmount: number;
  accruedInterest: number;
  currentDebt: number;
  companyName: string;
  salaryThreshold: number;
  isActive: boolean;
}> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);

    const [
      borrowedAmount,
      accruedInterest,
      currentDebt,
      organizationHash,
      companyName,
      salaryThreshold,
      isActive,
    ] = await contract.getLoanDetails(borrowerAddress);

    return {
      borrowedAmount: Number(ethers.formatUnits(borrowedAmount, 6)),
      accruedInterest: Number(ethers.formatUnits(accruedInterest, 6)),
      currentDebt: Number(ethers.formatUnits(currentDebt, 6)),
      companyName,
      salaryThreshold: Number(ethers.formatUnits(salaryThreshold, 0)),
      isActive,
    };
  } catch (error) {
    console.error("Error fetching loan details:", error);
    throw error;
  }
}

/**
 * Check if user has an active loan
 */
export async function hasActiveLoan(
  userAddress: string,
  provider: ethers.Provider
): Promise<boolean> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
    return await contract.s_hasActiveLoan(userAddress);
  } catch (error) {
    console.error("Error checking active loan:", error);
    return false;
  }
}

/**
 * Get protocol statistics
 */
export async function getProtocolStats(provider: ethers.Provider): Promise<{
  totalBorrowed: number;
  totalCollateral: number;
  protocolReserves: number;
  availableLiquidity: number;
}> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);

    const [
      totalBorrowed,
      totalCollateral,
      protocolReserves,
      availableLiquidity,
    ] = await contract.getProtocolStats();

    return {
      totalBorrowed: Number(ethers.formatUnits(totalBorrowed, 6)),
      totalCollateral: Number(ethers.formatUnits(totalCollateral, 6)),
      protocolReserves: Number(ethers.formatUnits(protocolReserves, 6)),
      availableLiquidity: Number(ethers.formatUnits(availableLiquidity, 6)),
    };
  } catch (error) {
    console.error("Error fetching protocol stats:", error);
    throw error;
  }
}
