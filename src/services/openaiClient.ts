// src/openaiClient.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processCommand(command: string): Promise<string> {
  const prompt = `You are a blockchain assistant that parses user commands into one of the following operations ONLY:
  - "check_wallet" (Check the wallet balance)
  - "retrieve_wallet_address" (Show the wallet address)
  - "retrieve_token_balances" (Get the balance of a specified ERC20 token. Requires: tokenAddress)
  - "retrieve_token_prices" (Get the price of ETH or an ERC20 token. Requires: token)
  - "send_transaction" (Send a transaction. Requires: to, value, optionally gasPrice and data)
  - "retrieve_cross_chain_asset_balance" (Get wallet balance on another chain. Requires: chain, e.g., ethereum, polygon)
  - "deploy_erc20" (Deploy a new ERC20 token. Requires: tokenName, tokenSymbol, initialSupply)

Parse the following user command into a JSON object with an operation and params (if applicable). Examples:

User: "Check my wallet balance"
Response:
{
  "operation": "check_wallet",
  "params": {}
}

User: "Show my wallet address"
Response:
{
  "operation": "retrieve_wallet_address",
  "params": {}
}

User: "What's the price of ETH?"
Response:
{
  "operation": "retrieve_token_prices",
  "params": {
    "token": "eth"
  }
}

User: "Deploy a new token called MyToken with symbol MTK and initial supply of 1000"
Response:
{
  "operation": "deploy_erc20",
  "params": {
    "tokenName": "MyToken",
    "tokenSymbol": "MTK",
    "initialSupply": "1000"
  }
}

User: "Send 0.05 ETH to 0xabc123..."
Response:
{
  "operation": "send_transaction",
  "params": {
    "to": "0xabc123...",
    "value": "0.05"
  }
}

Now parse the following command:

"${command}"

JSON Response:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or whichever model you prefer
      messages: [
        {
          role: "system",
          content: "You output only valid JSON responses based strictly on the provided list of operations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 250,
      temperature: 0.0, // Deterministic output
    });

    return response.choices?.[0]?.message?.content?.trim() ?? "No operation parsed.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error processing command.";
  }
}
