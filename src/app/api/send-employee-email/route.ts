import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmployeeEmailParams {
  name: string;
  email: string;
  walletAddress: string;
  position: string;
  salary: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmployeeEmailParams = await request.json();
    const { name, email, walletAddress, position, salary } = body;
    console.log("Received body:", body);
    
    console.log(`🚀 Sending welcome email to ${name}...`);
    
    const employeeId = `EMP-${Date.now().toString().slice(-6)}`;
    console.log(`Generated Employee ID: ${employeeId}`);
    const monthlySalary = (parseFloat(salary) / 12).toFixed(2);
    console.log("Monthly Salary:", monthlySalary);
    
    const msg = {
      to: email,
      from: "support@wooecomblinks.online",
      subject: `🎉 Welcome to zkVerify - Your Employment Verification`,
      html: `
      <div style="font-family: Inter, sans-serif; background: #f5f7fa; padding: 24px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); overflow: hidden;">
          <div style="background: #10b981; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to zkVerify!</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Official Employment Verification Document</p>
          </div>

          <div style="padding: 32px 24px;">
            <h2 style="margin-top: 0; color: #1f2937;">Dear ${name},</h2>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Welcome to our organization! This email serves as your official employment verification document for zkVerify integration.
            </p>
            
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
              <h3 style="margin: 0 0 16px 0; font-size: 20px;">💰 Your Compensation Details</h3>
              <div style="font-size: 18px; font-weight: bold;">
                Annual Salary: $${parseFloat(salary).toLocaleString()} USD
              </div>
              <div style="font-size: 16px; margin-top: 8px; opacity: 0.9;">
                Monthly: $${parseFloat(monthlySalary).toLocaleString()} USD
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #374151; font-size: 16px;">📋 Employee Information</h4>
              <div style="display: grid; gap: 8px;">
                <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 4px 0;"><strong>Employee ID:</strong> ${employeeId}</p>
                <p style="margin: 4px 0;"><strong>Position:</strong> ${position}</p>
                <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 4px 0;"><strong>Wallet Address:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${walletAddress}</code></p>
                <p style="margin: 4px 0;"><strong>Verification Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h4 style="margin-top: 0; color: #065f46;">✅ Employment Status</h4>
              <p style="color: #065f46; margin-bottom: 8px;">
                <strong>Status:</strong> Active Employee<br>
                <strong>Start Date:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Employment Type:</strong> Full-time
              </p>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #92400e;">🔐 zkVerify Integration</h4>
              <p style="color: #92400e; margin-bottom: 8px;">
                This DKIM-signed email can be used to generate zero-knowledge proofs of your employment and salary information without revealing personal details.
              </p>
              <p style="color: #92400e; margin-bottom: 0; font-size: 14px;">
                <strong>ZK Reference:</strong> ZK-VERIFY-${Date.now()}
              </p>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">
                &copy; ${new Date().getFullYear()} zkVerify • Privacy-First Employment Verification 🔐
              </p>
            </div>
          </div>
        </div>
      </div>
      `,
      text: `
      zkVerify - Official Employment Verification
      
      Dear ${name},
      
      Welcome to our organization! This email serves as your official employment verification document.
      
      EMPLOYEE INFORMATION:
      - Name: ${name}
      - Employee ID: ${employeeId}
      - Position: ${position}
      - Email: ${email}
      - Wallet Address: ${walletAddress}
      - Verification Date: ${new Date().toLocaleDateString()}
      
      COMPENSATION DETAILS:
      - Annual Salary: $${parseFloat(salary).toLocaleString()} USD
      - Monthly Salary: $${parseFloat(monthlySalary).toLocaleString()} USD
      
      EMPLOYMENT STATUS:
      - Status: Active Employee
      - Start Date: ${new Date().toLocaleDateString()}
      - Employment Type: Full-time
      
      ZK VERIFICATION:
      This DKIM-signed email can be used to generate zero-knowledge proofs of your employment and salary information.
      ZK Reference: ZK-VERIFY-${Date.now()}
      
      zkVerify - Privacy-First Employment Verification
      `,
      headers: {
        'X-Payroll-Verification': 'DKIM-ZK-ENABLED',
        'X-Annual-Salary': salary,
        'X-Employee-ID': employeeId,
        'X-Employee-Name': name,
        'X-Employee-Position': position,
        'X-Organization': 'zkVerify-Corp',
        'X-ZK-Reference': `ZK-VERIFY-${Date.now()}`,
        'X-Wallet-Address': walletAddress
      }
    };

    const result = await sgMail.send(msg);
    console.log(`✅ SUCCESS! Welcome email sent to ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result[0].headers['x-message-id'],
      employeeId: employeeId
    });

  } catch (error: any) {
    console.error('❌ Failed to send email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: error.response?.body || error.message
      },
      { status: 500 }
    );
  }
}
