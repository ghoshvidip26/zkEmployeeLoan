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
    showLog("🔍 Parsing email content...");

    // Parse email and prepare circuit inputs
    const circuitData = prepareCircuitInputs(
      emailContent,
      loanAmount,
      userAddress
    );

    showLog(`📧 Extracted salary: $${circuitData.salaryData.salaryAmount}`);
    showLog(`💰 Loan amount: $${loanAmount}`);
    showLog(`✅ Loan eligible: ${circuitData.isEligible ? "Yes" : "No"}`);

    if (!circuitData.isEligible) {
      throw new Error(
        `Loan amount exceeds 30% of salary. Max allowed: $${circuitData.maxLoanAmount}`
      );
    }

    const noir = new Noir(circuit as CompiledCircuit);
    const honk = new UltraHonkBackend(circuit.bytecode, { threads: 2 });

    // Convert user address to bytes32 format
    const addressAsBytes32 = ethers.zeroPadValue(
      ethers.toBeHex(BigInt(userAddress)),
      32
    );

    // Generate nullifier to prevent double-spending
    const nullifier = generateNullifier(
      userAddress,
      circuitData.salaryData.salaryAmount
    );

    // Calculate domain hash (simplified - in production use proper DKIM key hash)
    const domainHash = ethers.keccak256(
      ethers.toUtf8Bytes(circuitData.dkimData.domain)
    );

    // Prepare circuit inputs matching the Noir circuit parameters
    const circuitInputs = {
      // DKIM verification inputs
      header: circuitData.header,
      body: circuitData.body,
      pubkey: {
        // Simplified RSA key - in production, extract from DKIM DNS record
        modulus: Array(32).fill("1"), // Placeholder
        exponent: "65537",
      },
      signature: Array(32).fill("1"), // Simplified signature
      body_hash_index: 0,
      dkim_header_sequence: {
        storage: Array(64).fill("0"),
        len: 64,
      },

      // Loan verification inputs
      loan_amount: loanAmount.toString(),
      user_secret: ethers.keccak256(ethers.toUtf8Bytes(userAddress)),
      expected_salary: circuitData.salaryData.salaryAmount,

      // Public outputs
      loan_eligibility: circuitData.isEligible ? "1" : "0",
      nullifier: nullifier,
      domain_hash: domainHash,
    };

    showLog("🔧 Generating witness...");
    const { witness } = await noir.execute(circuitInputs);
    showLog("✅ Generated witness");

    showLog("🔐 Generating ZK proof...");
    const { proof, publicInputs } = await honk.generateProof(witness);
    showLog("✅ Generated ZK proof");

    // Verify proof off-chain
    showLog("🔍 Verifying proof...");
    const isValid = await honk.verifyProof({ proof, publicInputs });
    showLog(`✅ Proof verification: ${isValid ? "Valid" : "Invalid"}`);

    if (!isValid) {
      throw new Error("Generated proof is invalid");
    }

    showLog("🎉 DKIM proof generation completed successfully!");

    return { proof, publicInputs };
  } catch (error) {
    showLog(`❌ Error: ${error.message}`);
    console.error("DKIM Proof Generation Error:", error);
    throw error;
  }
}
