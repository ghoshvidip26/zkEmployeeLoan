import { UltraHonkBackend } from "@aztec/bb.js";
import circuit from "./zkloans.json";
import { Noir } from "@noir-lang/noir_js";
import { CompiledCircuit } from "@noir-lang/types";
import { ethers } from "ethers";

// Types for the circuit inputs based on your main.nr
export interface DKIMProofInputs {
  // DKIM verification inputs
  header: {
    storage: number[]; // Array of 512 bytes
    len: number; // Actual length of header
  };
  body: {
    storage: number[]; // Array of 1024 bytes
    len: number; // Actual length of body
  };
  pubkey: {
    // RSA public key with KEY_LIMBS_2048 limbs
    n: string[]; // RSA modulus as limbs
    e: string; // RSA exponent (usually 65537)
  };
  signature: string[]; // DKIM signature as Field array
  body_hash_index: number; // Index of body hash in header
  dkim_header_sequence: {
    // Sequence type for header parsing
    data: number[];
    len: number;
  };

  // Payroll lending specific inputs
  loan_amount: string; // Requested loan amount (private)
  user_secret: string; // User's private nullifier secret (private)
  expected_salary: string; // Expected salary from email (private)

  // Public outputs for verification
  loan_eligibility: string; // 1 if eligible, 0 if not
  nullifier: string; // Prevents double-spending
  domain_hash: string; // Hash of verified email domain
}

export interface DKIMProofResult {
  proof: Uint8Array;
  publicInputs: string[];
  // Decoded public outputs
  loanEligibility: boolean;
  nullifier: string;
  domainHash: string;
}

/**
 * Generate ZK proof for DKIM-verified payroll email and loan eligibility
 * @param inputs - All circuit inputs including DKIM data and loan parameters
 * @param showLog - Callback function for logging progress
 * @returns Promise with proof and public inputs
 */
import { UltraHonkBackend } from "@aztec/bb.js";
import circuit from "./zkloans.json";
import { Noir } from "@noir-lang/noir_js";
import { CompiledCircuit } from "@noir-lang/types";
import { ethers } from "ethers";
import { prepareCircuitInputs, generateNullifier } from "./emailParser";

export async function generateDKIMProof(
  emailContent: string,
  loanAmount: number,
  userAddress: string,
  showLog: (content: string) => void
): Promise<{ proof: Uint8Array; publicInputs: string[] }> {
  try {
    showLog("🔧 Initializing Noir circuit...");
    const noir = new Noir(circuit as CompiledCircuit);
    const backend = new UltraHonkBackend(circuit.bytecode, { threads: 2 });

    showLog("📧 Processing DKIM verification inputs...");

    // Prepare circuit inputs - convert to the format expected by Noir
    const circuitInputs = {
      // DKIM verification inputs
      header: {
        storage: inputs.header.storage,
        len: inputs.header.len,
      },
      body: {
        storage: inputs.body.storage,
        len: inputs.body.len,
      },
      pubkey: inputs.pubkey,
      signature: inputs.signature,
      body_hash_index: inputs.body_hash_index,
      dkim_header_sequence: inputs.dkim_header_sequence,

      // Payroll lending inputs
      loan_amount: inputs.loan_amount,
      user_secret: inputs.user_secret,
      expected_salary: inputs.expected_salary,

      // Public outputs
      loan_eligibility: inputs.loan_eligibility,
      nullifier: inputs.nullifier,
      domain_hash: inputs.domain_hash,
    };

    showLog("🔐 Generating witness...");
    const { witness } = await noir.execute(circuitInputs);
    showLog("✅ Witness generated successfully");

    showLog("🎯 Generating ZK proof...");
    const { proof, publicInputs } = await backend.generateProof(witness, {
      keccak: true,
    });
    showLog("✅ ZK proof generated successfully");

    // Verify proof off-chain for debugging
    showLog("🔍 Verifying proof off-chain...");
    const offChainProof = await backend.generateProof(witness);
    const isValid = await backend.verifyProof(offChainProof);
    showLog(`✅ Proof verification: ${isValid ? "VALID" : "INVALID"}`);

    if (!isValid) {
      throw new Error("Generated proof failed verification");
    }

    // Parse public outputs
    const loanEligibility = publicInputs[0] === "1";
    const nullifier = publicInputs[1];
    const domainHash = publicInputs[2];

    showLog("🎉 DKIM proof generation completed successfully!");
    showLog(`📊 Loan Eligible: ${loanEligibility}`);
    showLog(`🔒 Nullifier: ${nullifier.slice(0, 10)}...`);
    showLog(`🌐 Domain Hash: ${domainHash.slice(0, 10)}...`);

    return {
      proof,
      publicInputs,
      loanEligibility,
      nullifier,
      domainHash,
    };
  } catch (error) {
    showLog(`❌ Error generating DKIM proof: ${error}`);
    console.error("DKIM Proof Generation Error:", error);
    throw error;
  }
}

/**
 * Helper function to prepare email data for DKIM verification
 * @param emailData - Raw email data
 * @returns Formatted inputs for the circuit
 */
export function prepareEmailInputs(emailData: {
  header: string;
  body: string;
  publicKey: any;
  signature: string;
  bodyHashIndex: number;
}): Partial<DKIMProofInputs> {
  // Convert header to bounded vector format
  const headerBytes = new TextEncoder().encode(emailData.header);
  const headerStorage = new Array(512).fill(0);
  headerBytes.forEach((byte, i) => {
    if (i < 512) headerStorage[i] = byte;
  });

  // Convert body to bounded vector format
  const bodyBytes = new TextEncoder().encode(emailData.body);
  const bodyStorage = new Array(1024).fill(0);
  bodyBytes.forEach((byte, i) => {
    if (i < 1024) bodyStorage[i] = byte;
  });

  return {
    header: {
      storage: headerStorage,
      len: Math.min(headerBytes.length, 512),
    },
    body: {
      storage: bodyStorage,
      len: Math.min(bodyBytes.length, 1024),
    },
    body_hash_index: emailData.bodyHashIndex,
    // Additional DKIM fields would be processed here
  };
}

/**
 * Calculate loan eligibility based on salary and loan amount
 * @param salary - Annual salary amount
 * @param loanAmount - Requested loan amount
 * @returns Whether loan is eligible (≤ 30% of salary)
 */
export function calculateLoanEligibility(
  salary: number,
  loanAmount: number
): boolean {
  const maxLoanAmount = (salary * 30) / 100; // 30% of salary
  return loanAmount <= maxLoanAmount;
}

/**
 * Generate a nullifier for preventing double-spending
 * @param userSecret - User's private secret
 * @param salary - Verified salary amount
 * @returns Nullifier hash
 */
export function generateNullifier(userSecret: string, salary: string): string {
  // This should use Pedersen hash in production, but for demo we'll use keccak
  return ethers.keccak256(
    ethers.solidityPacked(["string", "string"], [userSecret, salary])
  );
}
