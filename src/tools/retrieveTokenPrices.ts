// src/tools/retrieveTokenPrices.ts
import axios from "axios";

/**
 * Retrieves the price of a given token in USDC (USD).
 * 
 * If the token is "eth" or "ethereum" (case-insensitive), it calls CoinGecko's Ethereum endpoint.
 * Otherwise, it assumes the token parameter is a contract address on Ethereum and queries the token price.
 * 
 * @param token - Either "eth" / "ethereum" or an ERC20 contract address.
 * @returns The token price in USD as a string.
 */
export async function retrieveTokenPrice(token: string): Promise<string> {
  // For ETH (or Ethereum), use the dedicated endpoint
  if (token.toLowerCase() === "eth" || token.toLowerCase() === "ethereum") {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: "ethereum",
        vs_currencies: "usd",
      },
    });
    const price = response.data.ethereum.usd;
    return price.toString();
  } else {
    // For an ERC20 token, assume token is the contract address.
    // CoinGecko expects the contract address in lowercase.
    const contractAddress = token.toLowerCase();
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/token_price/ethereum", {
      params: {
        contract_addresses: contractAddress,
        vs_currencies: "usd",
      },
    });
    const price = response.data[contractAddress]?.usd;
    if (price === undefined) {
      throw new Error(`Price for token ${token} not found.`);
    }
    return price.toString();
  }
}
