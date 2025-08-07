import { ethers } from "ethers";
import {
  generateDKIMProof,
  DKIMProofInputs,
  calculateLoanEligibility,
} from "./generateDKIMProof";

// Contract ABI for repayLoan function
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "repayLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export interface RepayLoanParams {
  emailContent: string; // Raw .eml file content
  loanAmount: string; // Requested loan amount in wei/dollars
  userSecret: string; // User's private nullifier
  provider: ethers.BrowserProvider;
  userAddress: string;
  showLog: (content: string) => void;
  circuit?: any; // Compiled circuit (optional until available)
}

export async function repayLoanWithDKIMProof(
  params: RepayLoanParams
): Promise<string> {
  const {
    emailContent,
    loanAmount,
    userSecret,
    provider,
    userAddress,
    showLog,
  } = params;

  try {
    showLog("🚀 Starting loan repayment with DKIM verification...");

    // 1. Parse email to extract DKIM components (simplified - you'd need a proper DKIM parser)
    showLog("📧 Parsing email for DKIM verification...");
    const parsedEmail = parseEmailForDKIM(emailContent);

    if (!parsedEmail.expected_salary) {
      throw new Error("Could not extract salary from email");
    }

    // 2. Calculate loan eligibility
    const salary = parseInt(parsedEmail.expected_salary);
    const loan = parseInt(loanAmount);
    const eligibility = calculateLoanEligibility(salary, loan);

    showLog(`💰 Salary: $${salary.toLocaleString()}`);
    showLog(`🏦 Requested loan: $${loan.toLocaleString()}`);
    showLog(`📊 Loan-to-income ratio: ${eligibility.ratio.toFixed(2)}%`);
    showLog(`✅ Max eligible: $${eligibility.maxLoanAmount.toLocaleString()}`);

    if (!eligibility.eligible) {
      throw new Error(
        `Loan amount exceeds 30% of salary. Max allowed: $${eligibility.maxLoanAmount}`
      );
    }

    // 3. Generate nullifier (prevent double-spending)
    const nullifier = ethers.keccak256(
      ethers.solidityPacked(["uint256", "uint256"], [userSecret, salary])
    );

    // 4. Generate domain hash (simplified - should be from DKIM pubkey)
    const domainHash = ethers.keccak256(
      ethers.toUtf8Bytes("payroll.company.com")
    );

    // 5. Prepare DKIM proof inputs
    const dkimInputs: DKIMProofInputs = {
      ...parsedEmail,
      loan_amount: loanAmount,
      user_secret: userSecret,
      expected_salary: parsedEmail.expected_salary!,
      loan_eligibility: eligibility.eligible ? "1" : "0",
      nullifier: nullifier,
      domain_hash: domainHash,
      // Note: These would come from actual DKIM parsing
      pubkey: {
        n: ["0"], // RSA modulus limbs
        e: "65537", // RSA exponent
      },
      signature: ["0"], // DKIM signature limbs
      body_hash_index: 0,
      dkim_header_sequence: {
        start_index: 0,
        end_index: 100,
      },
    } as DKIMProofInputs;

    // 6. Generate zero-knowledge proof
    showLog("🔮 Generating zero-knowledge proof...");

    if (!params.circuit) {
      throw new Error(
        "Circuit not provided. Please compile your Noir circuit first."
      );
    }

    const { proof, publicInputs } = await generateDKIMProof(
      dkimInputs,
      userAddress,
      showLog,
      params.circuit
    );

    // 7. Prepare contract call
    showLog("📜 Preparing smart contract interaction...");
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    const contract = new ethers.Contract(
      contractAddress,
      CONTRACT_ABI,
      await provider.getSigner()
    );

    // Convert proof to bytes
    const proofBytes = ethers.hexlify(proof);

    // Convert public inputs to bytes32[]
    const publicInputsBytes32 = publicInputs.map((input) =>
      ethers.zeroPadValue(ethers.toBeHex(BigInt(input)), 32)
    );

    showLog("🔗 Calling repayLoan on smart contract...");
    showLog(`📍 Contract: ${contractAddress}`);
    showLog(`🆔 Nullifier: ${nullifier}`);

    // 8. Execute transaction
    const tx = await contract.repayLoan(proofBytes, publicInputsBytes32);
    showLog(`📝 Transaction submitted: ${tx.hash}`);

    showLog("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();

    showLog(`✅ Loan repayment successful!`);
    showLog(`🎯 Block: ${receipt.blockNumber}`);
    showLog(`⛽ Gas used: ${receipt.gasUsed.toString()}`);

    return tx.hash;
  } catch (error: any) {
    showLog(`❌ Loan repayment failed: ${error.message}`);
    console.error("Repay loan error:", error);
    throw error;
  }
}

// Helper function to parse email (simplified version)
function parseEmailForDKIM(emailContent: string): Partial<DKIMProofInputs> {
  try {
    // Split email into header and body
    const [headerPart, bodyPart] = emailContent.split("\r\n\r\n");

    if (!headerPart || !bodyPart) {
      throw new Error("Invalid email format");
    }

    // Convert to byte arrays
    const header = Array.from(new TextEncoder().encode(headerPart));
    const body = Array.from(new TextEncoder().encode(bodyPart));

    // Extract salary from body (multiple patterns)
    const salaryPatterns = [
      /ANNUAL SALARY[:\s]+\$?([0-9,]+)/i,
      /SALARY[:\s]+\$?([0-9,]+)/i,
      /GROSS PAY[:\s]+\$?([0-9,]+)/i,
      /INCOME[:\s]+\$?([0-9,]+)/i,
    ];

    let expectedSalary = "0";
    for (const pattern of salaryPatterns) {
      const match = bodyPart.match(pattern);
      if (match) {
        expectedSalary = match[1].replace(/,/g, "");
        break;
      }
    }

    if (expectedSalary === "0") {
      throw new Error("Could not extract salary from email body");
    }

    return {
      header,
      body,
      expected_salary: expectedSalary,
    };
  } catch (error) {
    console.error("Email parsing error:", error);
    throw new Error("Failed to parse email for DKIM verification");
  }
}

// Export helper for external use
export { calculateLoanEligibility };
