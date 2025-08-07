import { NextRequest, NextResponse } from "next/server";
import {
  parseEmailContent,
  validateLoanEligibility,
} from "../../../../utils/emailParser";

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress, emailContent } = await request.json();

    if (!amount || !walletAddress || !emailContent) {
      return NextResponse.json(
        { error: "Amount, wallet address, and email content are required" },
        { status: 400 }
      );
    }

    // Parse the actual DKIM-signed email
    const { salaryData, dkimData } = parseEmailContent(emailContent);

    // Validate loan eligibility (30% of salary rule)
    const eligibility = validateLoanEligibility(
      salaryData.salaryAmount,
      amount
    );

    if (!eligibility.isEligible) {
      return NextResponse.json(
        {
          success: false,
          error: `Loan amount exceeds 30% of verified salary. Maximum allowed: $${eligibility.maxLoanAmount}`,
          data: {
            requestedAmount: amount,
            maxLoanAmount: eligibility.maxLoanAmount,
            salaryAmount: parseInt(salaryData.salaryAmount),
            ratio: eligibility.ratio.toFixed(2) + "%",
          },
        },
        { status: 400 }
      );
    }

    // Return loan terms for zkEmployeeLoan contract interaction
    const loanTerms = {
      borrowingId: `ZK_LOAN_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      requestedAmount: amount,
      approvedAmount: amount, // Full amount approved since it's within 30%
      maxLoanAmount: eligibility.maxLoanAmount,
      interestRate: 6.5, // Premium rate for DKIM-verified salary
      salaryVerified: true,

      // Extracted from DKIM email
      employeeName: salaryData.employeeName,
      company: salaryData.company,
      position: salaryData.position,
      annualSalary: parseInt(salaryData.salaryAmount),
      walletAddress: salaryData.walletAddress,

      // Contract interaction data
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      chainId: 84532, // Base Sepolia

      // DKIM verification status
      dkimDomain: dkimData.domain,
      emailVerified: true,
      zkReference: salaryData.zkReference,
    };

    return NextResponse.json({
      success: true,
      message:
        "Loan eligibility verified. Ready for smart contract interaction.",
      data: {
        loanTerms,
        benefits: [
          "DKIM-verified salary proof",
          "No collateral required",
          "Premium interest rate (6.5%)",
          "Instant approval with ZK proof",
          "Maximum privacy protection",
        ],
        nextSteps: [
          "Generate ZK proof from email",
          "Call takeLoan() on smart contract",
          "Funds will be transferred to wallet",
        ],
        processedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing loan request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process loan request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
