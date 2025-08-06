import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, duration, walletAddress, emailData } = await request.json();
    
    if (!amount || !duration || !walletAddress) {
      return NextResponse.json(
        { error: 'Amount, duration, and wallet address are required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify salary proof from uploaded .eml file
    // 2. Check borrowing capacity based on verified income
    // 3. Assess risk and determine borrowing terms
    // 4. Create borrowing smart contract
    // 5. Record the borrowing request in database
    
    // Mock borrowing terms calculation
    const verifiedSalary = emailData?.containsSalaryInfo || false;
    const baseRate = verifiedSalary ? 6.5 : 12.0; // Lower rate for verified salary
    
    const mockBorrowingTerms = {
      requestedAmount: parseFloat(amount),
      approvedAmount: verifiedSalary ? parseFloat(amount) : parseFloat(amount) * 0.7,
      interestRate: baseRate,
      duration: parseInt(duration),
      monthlyPayment: (parseFloat(amount) * (1 + baseRate/100)) / parseInt(duration),
      collateralRequired: !verifiedSalary,
      collateralRatio: verifiedSalary ? 0 : 150, // 150% collateral if no salary verification
      borrowingId: `BORROW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending_approval',
      salaryVerified: verifiedSalary
    };
    
    return NextResponse.json({
      success: true,
      message: 'Borrowing request processed successfully',
      data: {
        borrowingTerms: mockBorrowingTerms,
        benefits: verifiedSalary ? [
          'Lower interest rate due to salary verification',
          'No collateral required',
          'Faster approval process',
          'Higher borrowing limit'
        ] : [
          'Collateral required for approval',
          'Standard interest rate applies',
          'Longer approval process'
        ],
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing borrowing request:', error);
    return NextResponse.json(
      { error: 'Failed to process borrowing request' },
      { status: 500 }
    );
  }
}
