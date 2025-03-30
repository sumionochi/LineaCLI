// src/tools/retrieveWalletAddress.ts
import { JsonRpcProvider, Wallet } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export async function retrieveWalletAddress(): Promise<string> {
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
  return wallet.address;
}
