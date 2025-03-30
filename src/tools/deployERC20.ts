// src/tools/deployERC20.ts
import { JsonRpcProvider, Wallet, ContractFactory, parseUnits } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Minimal ERC20 ABI including only the constructor and a few view functions
const ERC20_ABI = [
  "constructor(string name, string symbol, uint256 initialSupply)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
];

// Replace the placeholder below with your compiled ERC20 contract's bytecode.
const ERC20_BYTECODE = "0xYOUR_CONTRACT_BYTECODE_HERE";

export async function deployERC20(
  tokenName: string,
  tokenSymbol: string,
  initialSupply: string // supply as a string (e.g., "1000")
): Promise<string> {
  const networkEndpoint = process.env.NETWORK;
  if (!networkEndpoint) {
    throw new Error("NETWORK endpoint not configured in .env");
  }
  const provider = new JsonRpcProvider(networkEndpoint);

  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("WALLET_PRIVATE_KEY not configured in .env");
  }
  const wallet = new Wallet(privateKey, provider);

  // Create a ContractFactory with the ABI and bytecode
  const factory = new ContractFactory(ERC20_ABI, ERC20_BYTECODE, wallet);

  // Convert the initial supply to wei (assuming 18 decimals)
  const supply = parseUnits(initialSupply, 18);

  // Deploy the contract with the token name, symbol, and initial supply
  const contract = await factory.deploy(tokenName, tokenSymbol, supply);
  await contract.waitForDeployment();

  // Convert the contract's target to string and return it
  return contract.target.toString();
}
