// src/cli.ts
import * as readline from 'readline';

export function startCLI(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'LineaCLI> '
  });

  console.log("Welcome to LineaCLI! Type your command or 'exit' to quit.");

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    // For now, simply echo the command.
    console.log(`You entered: ${input}`);
    rl.prompt();
  }).on('close', () => {
    console.log("Exiting LineaCLI. Goodbye!");
    process.exit(0);
  });
}
