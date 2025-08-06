import { abi, bytecode } from "@/app/counter/abi";
import { ethers, Signer } from "ethers";

export async function deployContract(signer: Signer) {
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy();

  console.log("Deploying contract...");
  await contract.waitForDeployment();
  console.log("Contract deployed at:", contract.target);

  return contract;
}
