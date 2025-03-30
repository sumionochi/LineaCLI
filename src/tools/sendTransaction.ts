// src/tools/sendTransaction.ts
import { JsonRpcProvider, Wallet, parseEther } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export interface TransactionParams {
  to: string;
  value: string; // value in Ether as a string (e.g., "0.01")
  gasPrice?: string; // optional gas price in Ether (adjust if needed)
  data?: string; // optional hex data for contract interactions
}

export async function sendTransaction(params: TransactionParams): Promise<string> {
  // Get the network RPC endpoint from your .env file
  const networkEndpoint = process.env.NETWORK;
  if (!networkEndpoint) {
    throw new Error("NETWORK endpoint not configured in .env");
  }
  // Create a provider for the Linea network
  const provider = new JsonRpcProvider(networkEndpoint);

  // Get the wallet private key from your .env file
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("WALLET_PRIVATE_KEY not configured in .env");
  }
  // Create a wallet instance connected to the provider
  const wallet = new Wallet(privateKey, provider);

  // Build the transaction object
  const tx = {
    to: params.to,
    value: parseEther(params.value), // Converts Ether string to wei
    gasPrice: params.gasPrice ? parseEther(params.gasPrice) : undefined,
    data: params.data,
  };

  // Send the transaction
  const txResponse = await wallet.sendTransaction(tx);
  // Wait for the transaction to be mined
  const receipt = await txResponse.wait();
  if (!receipt) {
    throw new Error("Transaction receipt is null");
  }
  // In ethers v6, the transaction hash is available as 'hash'
  return receipt.hash;
}
