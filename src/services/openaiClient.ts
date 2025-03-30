// src/openaiClient.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processCommand(command: string): Promise<string> {
  const prompt = `Parse the following user command and determine the blockchain operation to perform:

"${command}"

Provide the operation in JSON format. For example:
{
  "operation": "check_wallet",
  "params": {}
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Update the model as needed
      messages: [
        {
          role: "system",
          content: "You are a blockchain assistant that outputs only JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    // Use optional chaining and nullish coalescing operator to safely access the content
    return response.choices?.[0]?.message?.content?.trim() ?? "No operation parsed.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error processing command.";
  }
}
