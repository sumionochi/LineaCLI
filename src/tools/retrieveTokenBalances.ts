// src/tools/retrieveTokenBalances.ts
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import * as dotenv from "dotenv";
import { retrieveWalletAddress } from "./retrieveWalletAddress";

dotenv.config();

// Minimal ERC20 ABI including only the functions needed
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

/**
 * Retrieves the balance of the given ERC20 token for the connected wallet.
 * @param tokenAddress - The ERC20 token contract address.
 * @returns The token balance as a human-readable string.
 */
export async function retrieveTokenBalance(tokenAddress: string): Promise<string> {
  const networkEndpoint = process.env.NETWORK;
  if (!networkEndpoint) {
    throw new Error("NETWORK endpoint not configured in .env");
  }
  
  // Create a provider using the RPC endpoint
  const provider = new JsonRpcProvider(networkEndpoint);
  
  // Retrieve the wallet address from our existing tool
  const walletAddress = await retrieveWalletAddress();
  
  // Create a contract instance for the ERC20 token
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
  
  // Query the token balance and decimals
  const balance = await tokenContract.balanceOf(walletAddress);
  const decimals = await tokenContract.decimals();
  
  // Format the balance to a human-readable value
  return formatUnits(balance, decimals);
}
