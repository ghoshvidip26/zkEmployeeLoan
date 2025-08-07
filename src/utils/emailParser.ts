/**
 * Email Parser for DKIM-signed Salary Verification Emails
 * Extracts salary data from the salarydoc.eml format
 */

export interface SalaryData {
  salaryAmount: string;
  walletAddress: string;
  employeeName: string;
  companyEmail: string;
  position: string;
  company: string;
  payPeriod: string;
  zkReference: string;
}

export interface DKIMData {
  header: string;
  body: string;
  signature: string;
  domain: string;
  selector: string;
  bodyHash: string;
}

/**
 * Parse the DKIM-signed email and extract salary data
 */
export function parseEmailContent(emailContent: string): {
  salaryData: SalaryData;
  dkimData: DKIMData;
} {
  // Split email into header and body
  const [headerPart, ...bodyParts] = emailContent.split("\n\n");
  const bodyPart = bodyParts.join("\n\n");

  // Extract DKIM signature from header
  const dkimMatch = headerPart.match(
    /DKIM-Signature: v=1; a=rsa-sha256; c=relaxed\/relaxed; d=([^;]+);[\s\S]*?b=([^;=\s]+)/
  );
  if (!dkimMatch) {
    throw new Error("No valid DKIM signature found");
  }

  const domain = dkimMatch[1];
  const signature = dkimMatch[2];

  // Extract selector
  const selectorMatch = headerPart.match(/s=([^;]+);/);
  const selector = selectorMatch ? selectorMatch[1] : "s1";

  // Extract body hash
  const bodyHashMatch = headerPart.match(/bh=([^;=\s]+)/);
  const bodyHash = bodyHashMatch ? bodyHashMatch[1] : "";

  // Extract salary data from email headers and body
  const salaryData: SalaryData = {
    salaryAmount:
      extractHeaderValue(headerPart, "X-Salary-Amount") ||
      extractBodyValue(bodyPart, "SALARY_AMOUNT"),
    walletAddress:
      extractHeaderValue(headerPart, "X-Wallet-Address") ||
      extractBodyValue(bodyPart, "WALLET_ADDRESS"),
    employeeName:
      extractHeaderValue(headerPart, "X-Employee-Name") ||
      extractBodyValue(bodyPart, "EMPLOYEE_NAME"),
    companyEmail:
      extractHeaderValue(headerPart, "X-Company-Email") ||
      extractBodyValue(bodyPart, "COMPANY_EMAIL"),
    position:
      extractHeaderValue(headerPart, "X-Position") ||
      "Senior Software Engineer",
    company: extractHeaderValue(headerPart, "X-Company-Name") || "TechCorp Inc",
    payPeriod:
      extractHeaderValue(headerPart, "X-Salary-Month") || "August 2023",
    zkReference:
      extractHeaderValue(headerPart, "X-ZK-Reference") || "ZK-VERIFY-DEFAULT",
  };

  const dkimData: DKIMData = {
    header: headerPart,
    body: bodyPart,
    signature,
    domain,
    selector,
    bodyHash,
  };

  return { salaryData, dkimData };
}

/**
 * Extract value from email header
 */
function extractHeaderValue(header: string, key: string): string {
  const regex = new RegExp(`${key}:\\s*(.+)`, "i");
  const match = header.match(regex);
  return match ? match[1].trim() : "";
}

/**
 * Extract value from email body (ZK parseable format)
 */
function extractBodyValue(body: string, key: string): string {
  const regex = new RegExp(`${key}:\\s*(.+)`, "i");
  const match = body.match(regex);
  return match ? match[1].trim() : "";
}

/**
 * Convert email content to circuit-compatible format
 */
export function prepareCircuitInputs(
  emailContent: string,
  loanAmount: number,
  userSecret: string
) {
  const { salaryData, dkimData } = parseEmailContent(emailContent);

  // Convert to circuit format
  const header = new TextEncoder().encode(dkimData.header);
  const body = new TextEncoder().encode(dkimData.body);

  // Pad arrays to match circuit constraints
  const MAX_HEADER_LENGTH = 512;
  const MAX_BODY_LENGTH = 1024;

  const paddedHeader = new Uint8Array(MAX_HEADER_LENGTH);
  const paddedBody = new Uint8Array(MAX_BODY_LENGTH);

  paddedHeader.set(header.slice(0, MAX_HEADER_LENGTH));
  paddedBody.set(body.slice(0, MAX_BODY_LENGTH));

  return {
    // Circuit inputs
    header: Array.from(paddedHeader),
    body: Array.from(paddedBody),
    loan_amount: loanAmount.toString(),
    user_secret: userSecret,
    expected_salary: salaryData.salaryAmount,

    // Extracted data
    salaryData,
    dkimData,

    // Calculated values
    maxLoanAmount: Math.floor(parseInt(salaryData.salaryAmount) * 0.3), // 30% of salary
    isEligible: loanAmount <= parseInt(salaryData.salaryAmount) * 0.3,
  };
}

/**
 * Generate nullifier for preventing double-spending
 */
export function generateNullifier(userSecret: string, salary: string): string {
  // Simple hash function for nullifier (in production, use proper cryptographic hash)
  const combined = userSecret + salary;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
}

/**
 * Validate loan eligibility based on salary
 */
export function validateLoanEligibility(
  salaryAmount: string,
  loanAmount: number
): {
  isEligible: boolean;
  maxLoanAmount: number;
  ratio: number;
} {
  const salary = parseInt(salaryAmount);
  const maxLoanAmount = Math.floor(salary * 0.3); // 30% of salary
  const ratio = (loanAmount / salary) * 100;

  return {
    isEligible: loanAmount <= maxLoanAmount,
    maxLoanAmount,
    ratio,
  };
}
