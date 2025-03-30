// src/tools/checkWallet.ts
import { JsonRpcProvider, Wallet, formatEther } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export async function checkWalletBalance(): Promise<string> {
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

  // Retrieve the wallet balance (in wei) using the provider and format it as Ether
  const balanceWei = await provider.getBalance(wallet.address);
  return formatEther(balanceWei);
}
