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

    // For now, create a mock proof while we work on the circuit integration
    showLog("🔧 Creating mock ZK proof (circuit integration in progress)...");

    // Generate nullifier to prevent double-spending
    const nullifier = generateNullifier(
      userAddress,
      circuitData.salaryData.salaryAmount
    );

    // Calculate domain hash (simplified - in production use proper DKIM key hash)
    const domainHash = ethers.keccak256(
      ethers.toUtf8Bytes(circuitData.dkimData.domain)
    );

    // Create mock proof data that matches contract expectations
    const mockProof = new Uint8Array(192); // Standard proof size
    crypto.getRandomValues(mockProof);

    const publicInputs = [
      circuitData.isEligible ? "1" : "0", // loan_eligibility
      nullifier, // nullifier
      domainHash, // domain_hash
    ];

    showLog("✅ Mock ZK proof generated successfully!");
    showLog("📊 Public Inputs:");
    showLog(`  - Loan Eligibility: ${publicInputs[0]}`);
    showLog(`  - Nullifier: ${publicInputs[1]}`);
    showLog(`  - Domain Hash: ${publicInputs[2]}`);

    return { proof: mockProof, publicInputs };

    /* TODO: Uncomment when circuit is properly configured
    const noir = new Noir(circuit as CompiledCircuit);
    const honk = new UltraHonkBackend(circuit.bytecode, { threads: 2 });

    // Prepare circuit inputs matching the Noir circuit parameters
    const circuitInputs = {
      // DKIM verification inputs - BoundedVec format for Noir
      header: {
        storage: circuitData.header,
        len: circuitData.header.length
      },
      body: {
        storage: circuitData.body,
        len: circuitData.body.length
      },
      pubkey: {
        // RSA public key - simplified for now
        n: Array(32).fill("1").map(x => x.toString()), // Field elements as strings
        e: "65537"
      },
      signature: Array(32).fill("1").map(x => x.toString()), // Field elements as strings
      body_hash_index: "0", // Convert to string for Field type
      dkim_header_sequence: {
        storage: Array(64).fill("0"),
        len: 64
      },

      // Payroll lending inputs - all as strings for Field type
      loan_amount: loanAmount.toString(),
      user_secret: ethers.keccak256(ethers.toUtf8Bytes(userAddress)),
      expected_salary: circuitData.salaryData.salaryAmount,

      // Public outputs - as strings for Field type
      loan_eligibility: circuitData.isEligible ? "1" : "0",
      nullifier: nullifier,
      domain_hash: domainHash
    };

    showLog("🔧 Generating witness...");
    
    // Debug: Log circuit inputs structure
    showLog("📊 Circuit inputs debug:");
    showLog(`  - Header length: ${circuitInputs.header.len}`);
    showLog(`  - Body length: ${circuitInputs.body.len}`);
    showLog(`  - Loan amount: ${circuitInputs.loan_amount}`);
    showLog(`  - Expected salary: ${circuitInputs.expected_salary}`);
    showLog(`  - Loan eligibility: ${circuitInputs.loan_eligibility}`);
    
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
    */
  } catch (error: any) {
    showLog(`❌ Error: ${error.message}`);
    console.error("DKIM Proof Generation Error:", error);
    throw error;
  }
}
