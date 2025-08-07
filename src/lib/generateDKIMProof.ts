import { UltraHonkBackend } from "@aztec/bb.js";
// import circuit from "../../circuits/target/payroll_dkim.json"; // Update path when circuit is compiled
import { Noir } from "@noir-lang/noir_js";
import { CompiledCircuit } from "@noir-lang/types";
import { ethers } from "ethers";

export interface DKIMProofInputs {
  // DKIM verification inputs
  header: number[]; // Email header as bytes
  body: number[]; // Email body as bytes
  pubkey: {
    // RSA public key components
    n: string[]; // Modulus as limbs
    e: string; // Exponent
  };
  signature: string[]; // DKIM signature as limbs
  body_hash_index: number; // Index of body hash in header
  dkim_header_sequence: {
    // Header parsing sequence
    start_index: number;
    end_index: number;
  };

  // Payroll lending specific inputs
  loan_amount: string; // Requested loan amount (private)
  user_secret: string; // User's nullifier secret (private)
  expected_salary: string; // Expected salary from email (private)

  // Public outputs (for verification)
  loan_eligibility: string; // 1 if eligible, 0 if not
  nullifier: string; // Prevents double-spending
  domain_hash: string; // Hash of verified email domain
}

export async function generateDKIMProof(
  inputs: DKIMProofInputs,
  userAddress: string,
  showLog: (content: string) => void,
  circuit: CompiledCircuit // Pass circuit as parameter until it's compiled
): Promise<{ proof: Uint8Array; publicInputs: string[] }> {
  try {
    showLog("🔄 Initializing DKIM proof generation...");

    const noir = new Noir(circuit);
    const honk = new UltraHonkBackend(circuit.bytecode, { threads: 2 });

    // Convert user address to bytes32 format for consistency
    const addressAsBytes32 = ethers.zeroPadValue(
      ethers.toBeHex(BigInt(userAddress)),
      32
    );

    // Prepare circuit inputs matching main.nr function signature
    const circuitInputs = {
      // DKIM verification inputs
      header: inputs.header,
      body: inputs.body,
      pubkey: {
        n: inputs.pubkey.n.map((limb) => BigInt(limb).toString()),
        e: BigInt(inputs.pubkey.e).toString(),
      },
      signature: inputs.signature.map((limb) => BigInt(limb).toString()),
      body_hash_index: inputs.body_hash_index.toString(),
      dkim_header_sequence: {
        start_index: inputs.dkim_header_sequence.start_index.toString(),
        end_index: inputs.dkim_header_sequence.end_index.toString(),
      },

      // Payroll lending inputs
      loan_amount: BigInt(inputs.loan_amount).toString(),
      user_secret: BigInt(inputs.user_secret).toString(),
      expected_salary: BigInt(inputs.expected_salary).toString(),

      // Public outputs
      loan_eligibility: BigInt(inputs.loan_eligibility).toString(),
      nullifier: BigInt(inputs.nullifier).toString(),
      domain_hash: BigInt(inputs.domain_hash).toString(),
    };

    showLog("📧 Verifying DKIM signature and email integrity...");
    showLog(
      `💰 Checking loan amount: $${inputs.loan_amount} against salary: $${inputs.expected_salary}`
    );
    showLog(`🔒 User address: ${userAddress}`);
    showLog(`🆔 Nullifier: ${inputs.nullifier}`);

    showLog("⚡ Generating witness...");
    const { witness } = await noir.execute(circuitInputs);
    showLog("✅ Witness generated successfully");

    showLog("🔮 Generating zero-knowledge proof...");
    const { proof, publicInputs } = await honk.generateProof(witness, {
      keccak: true,
    });
    showLog("✅ ZK proof generated successfully");

    // Verify proof off-chain for debugging
    showLog("🔍 Verifying proof off-chain...");
    const offChainProof = await honk.generateProof(witness);
    const isValid = await honk.verifyProof(offChainProof);
    showLog(`✅ Proof verification: ${isValid ? "VALID" : "INVALID"}`);

    if (!isValid) {
      throw new Error("Generated proof is invalid");
    }

    // Log public inputs for debugging
    showLog("📊 Public Inputs:");
    showLog(`  - Loan Eligibility: ${publicInputs[0]}`);
    showLog(`  - Nullifier: ${publicInputs[1]}`);
    showLog(`  - Domain Hash: ${publicInputs[2]}`);

    showLog("🎉 DKIM proof generation completed successfully!");

    return { proof, publicInputs };
  } catch (error: any) {
    showLog(`❌ DKIM proof generation failed: ${error.message}`);
    console.error("DKIM Proof Generation Error:", error);
    throw new Error(`Failed to generate DKIM proof: ${error.message}`);
  }
}

// Helper function to parse email and extract required inputs
export function parseEmailForDKIM(
  emailContent: string
): Partial<DKIMProofInputs> {
  try {
    // Split email into header and body
    const [headerPart, bodyPart] = emailContent.split("\r\n\r\n");

    // Convert to byte arrays
    const header = Array.from(new TextEncoder().encode(headerPart));
    const body = Array.from(new TextEncoder().encode(bodyPart));

    // Extract salary from body (this is a simplified example)
    const salaryMatch = bodyPart.match(/SALARY[:\s]+\$?([0-9,]+)/i);
    const expectedSalary = salaryMatch ? salaryMatch[1].replace(/,/g, "") : "0";

    return {
      header,
      body,
      expected_salary: expectedSalary,
      // Note: pubkey, signature, and other DKIM fields would need to be
      // extracted using a proper DKIM parsing library
    };
  } catch (error) {
    console.error("Email parsing error:", error);
    throw new Error("Failed to parse email for DKIM verification");
  }
}

// Helper to calculate loan eligibility
export function calculateLoanEligibility(
  salary: number,
  loanAmount: number
): {
  eligible: boolean;
  maxLoanAmount: number;
  ratio: number;
} {
  const maxLoanAmount = Math.floor(salary * 0.3); // 30% of salary
  const ratio = (loanAmount / salary) * 100;
  const eligible = loanAmount <= maxLoanAmount;

  return {
    eligible,
    maxLoanAmount,
    ratio,
  };
}
