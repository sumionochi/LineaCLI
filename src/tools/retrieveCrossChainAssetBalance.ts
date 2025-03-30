// src/tools/retrieveCrossChainAssetBalance.ts
import { JsonRpcProvider, formatEther } from "ethers";
import * as dotenv from "dotenv";
import { retrieveWalletAddress } from "./retrieveWalletAddress";

dotenv.config();

interface NetworkMapping {
  [chain: string]: string;
}

// Mapping chain names to RPC endpoints from your .env file.
const networkMapping: NetworkMapping = {
  ethereum: process.env.NETWORK_ETH || "",
  polygon: process.env.NETWORK_POLYGON || "",
  linea: process.env.NETWORK || "",
  // Add more chains as needed.
};

/**
 * Retrieves the native balance of the connected wallet on the specified chain.
 * @param chain - The name of the chain (e.g., "ethereum", "polygon", "linea").
 * @returns The wallet balance on that chain, formatted as a human-readable string.
 */
export async function retrieveCrossChainAssetBalance(chain: string): Promise<string> {
  const networkEndpoint = networkMapping[chain.toLowerCase()];
  if (!networkEndpoint) {
    throw new Error(`No network endpoint configured for chain: ${chain}`);
  }
  
  // Create a provider for the selected network.
  const provider = new JsonRpcProvider(networkEndpoint);
  
  // Retrieve the wallet address using our existing tool.
  const walletAddress = await retrieveWalletAddress();
  
  // Query the balance from the provider.
  const balanceWei = await provider.getBalance(walletAddress);
  
  // Format and return the balance.
  return formatEther(balanceWei);
}
