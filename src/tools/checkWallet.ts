// src/tools/checkWallet.ts
import { JsonRpcProvider, Wallet, formatUnits } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export async function checkWalletBalance(): Promise<string> {
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

  const balanceWei = await provider.getBalance(wallet.address);

  // Increase precision by specifying more decimals (e.g., 6 decimals)
  return formatUnits(balanceWei, 18); // 18 decimals for full precision
}
