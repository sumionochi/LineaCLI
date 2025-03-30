// src/cli.ts
import * as readline from "readline";
import { processCommand } from "./services/openaiClient";
import { checkWalletBalance } from "./tools/checkWallet";
import { sendTransaction, TransactionParams } from "./tools/sendTransaction";
import { retrieveWalletAddress } from "./tools/retrieveWalletAddress";
import { retrieveTokenBalance } from "./tools/retrieveTokenBalances";
import { retrieveTokenPrice } from "./tools/retrieveTokenPrices";
import { retrieveCrossChainAssetBalance } from "./tools/retrieveCrossChainAssetBalance";
import { deployERC20 } from "./tools/deployERC20";

export function startCLI(): void {  // <-- export added here
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "LineaCLI> ",
  });

  console.log("Welcome to LineaCLI! Type your command or 'exit' to quit.");
  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    console.log("Processing command with OpenAI...");
    const aiResponse = await processCommand(input);
    console.log(`AI Parsed Operation: ${aiResponse}`);

    try {
      // Parse the AI response which is expected to be valid JSON
      const parsed = JSON.parse(aiResponse);
      const operation = parsed.operation;
      const params = parsed.params || {};

      switch (operation) {
        case "check_wallet": {
          const balance = await checkWalletBalance();
          console.log(`Wallet balance: ${balance} ETH`);
          break;
        }
        case "send_transaction": {
          const txParams = params as TransactionParams;
          const txHash = await sendTransaction(txParams);
          console.log(`Transaction sent! Tx hash: ${txHash}`);
          break;
        }
        case "retrieve_wallet_address": {
          const address = await retrieveWalletAddress();
          console.log(`Wallet address: ${address}`);
          break;
        }
        case "retrieve_token_balances": {
          const tokenAddress: string = params.tokenAddress;
          if (!tokenAddress) {
            console.log("Token address parameter missing.");
            break;
          }
          const tokenBalance = await retrieveTokenBalance(tokenAddress);
          console.log(`Token balance for ${tokenAddress}: ${tokenBalance}`);
          break;
        }
        case "retrieve_token_prices": {
          const token: string = params.token;
          if (!token) {
            console.log("Token parameter missing.");
            break;
          }
          try {
            const price = await retrieveTokenPrice(token);
            console.log(`Price of ${token}: $${price} USD`);
          } catch (err) {
            console.error("Error retrieving token price:", err);
          }
          break;
        }
        case "retrieve_cross_chain_asset_balance": {
          const chain: string = params.chain;
          if (!chain) {
            console.log("Chain parameter missing.");
            break;
          }
          try {
            const balance = await retrieveCrossChainAssetBalance(chain);
            console.log(`Balance on ${chain}: ${balance} ETH`);
          } catch (err) {
            console.error("Error retrieving cross-chain asset balance:", err);
          }
          break;
        }
        case "deploy_erc20": {
            const { tokenName, tokenSymbol, initialSupply } = params;
            if (!tokenName || !tokenSymbol || !initialSupply) {
              console.log("Missing parameters for deploying ERC20 (tokenName, tokenSymbol, initialSupply).");
              break;
            }
            try {
              const deployedAddress = await deployERC20(tokenName, tokenSymbol, initialSupply);
              console.log(`ERC20 Token deployed at address: ${deployedAddress}`);
            } catch (err) {
              console.error("Error deploying ERC20 token:", err);
            }
            break;
          }
        default:
          console.log(`Operation '${operation}' not recognized.`);
      }
    } catch (err) {
      console.error("Error parsing AI response or executing operation:", err);
      console.log("Raw AI response:", aiResponse);
    }

    rl.prompt();
  }).on("close", () => {
    console.log("Exiting LineaCLI. Goodbye!");
    process.exit(0);
  });
}
