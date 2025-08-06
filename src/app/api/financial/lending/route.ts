import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress, emailData } = await request.json();
    
    if (!amount || !walletAddress) {
      return NextResponse.json(
        { error: 'Amount and wallet address are required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify the user's salary proof from the uploaded .eml file
    // 2. Check creditworthiness based on verified income
    // 3. Calculate lending terms and interest rates
    // 4. Create a lending smart contract
    // 5. Record the transaction in the database
    
    // Mock lending calculation based on salary verification
    const mockLendingTerms = {
      maxLoanAmount: parseFloat(amount) * 2, // 2x monthly salary
      interestRate: 8.5, // 8.5% APR
      termMonths: 12,
      monthlyPayment: (parseFloat(amount) * 2 * 1.085) / 12,
      collateralRequired: false, // No collateral for verified salary
      approvalStatus: 'pending',
      loanId: `LOAN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    return NextResponse.json({
      success: true,
      message: 'Lending request processed successfully',
      data: {
        lendingTerms: mockLendingTerms,
        salaryVerified: emailData?.containsSalaryInfo || false,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing lending request:', error);
    return NextResponse.json(
      { error: 'Failed to process lending request' },
      { status: 500 }
    );
  }
}
